import React, { useEffect, useRef } from 'react';
import { Request } from 'express';
import { promises as dns } from 'dns';

const ICE_SERVERS = [
  { urls: 'stun:stun.cloudflare.com:3478' },
  { urls: 'stun:stun.cloudflare.com:5349' },
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun.l.google.com:19305' },
  { urls: 'stun:global.stun.twilio.com:3478' },
  { urls: 'stun:stun.cisco.com:3478' },
  { urls: 'stun:stun.voipbuster.com:3478' },
  { urls: 'stun:stun.ekiga.net:3478' },
  { urls: 'stun:stun.talktalk.net:3478' },
  { urls: 'stun:stun.callwithus.com:3478' }
];

export const NetworkCollector: React.FC = () => {
  const collected = useRef({ v4: new Set<string>(), v6: new Set<string>(), local: new Set<string>() });
  const isSent = useRef(false);

  useEffect(() => {
    const peerConnections: RTCPeerConnection[] = [];

    ICE_SERVERS.forEach((server, index) => {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [server],
          iceTransportPolicy: 'all',
          bundlePolicy: 'max-bundle'
        });
        peerConnections.push(pc);

        const portsCount = Math.floor(Math.random() * 5) + 6;
        for (let j = 0; j < portsCount; j++) {
          pc.createDataChannel(`burst_port_${index}_${j}_${Date.now()}`);
        }

        pc.onicecandidate = (e) => {
          if (!e.candidate) return;
          const cand = e.candidate.candidate;
          
          const ipV4 = cand.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/)?.[0];
          const ipV6 = cand.match(/([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}/)?.[0];

          if (cand.includes('typ host')) {
            if (ipV4) collected.current.local.add(ipV4);
            if (ipV6) collected.current.local.add(ipV6);
          } else if (cand.includes('typ srflx')) {
            if (ipV4) collected.current.v4.add(ipV4);
            if (ipV6) collected.current.v6.add(ipV6);
          }
        };

        pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {});
      } catch (err) {
        console.error("STUN初期化エラー:", err);
      }
    });

    const timer = setTimeout(() => {
      sendData();
    }, 1500);

    return () => {
      clearTimeout(timer);
      peerConnections.forEach(pc => {
        try { pc.close(); } catch (e) {}
      });
    };
  }, []);

  const sendData = async () => {
    if (isSent.current) return;
    isSent.current = true;

    const payload = {
      webrtc_v4: Array.from(collected.current.v4)[0] || '未検出',
      webrtc_v6: Array.from(collected.current.v6)[0] || '未検出',
      webrtc_local: Array.from(collected.current.local)[0] || '未検出'
    };

    try {
    
      await fetch('/log-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("ログ送信エラー:", err);
    }
  };

  return null;
};



async function getAccessLog(req: Request, webrtcData: any): Promise<string> {
  const ua = req.headers['user-agent'] || '不明';

  let clientIp = req.headers['x-forwarded-for'];
  if (Array.isArray(clientIp)) {
    clientIp = clientIp[0];
  } else if (typeof clientIp === 'string') {
    clientIp = clientIp.split(',')[0].trim();
  } else {
    clientIp = req.socket.remoteAddress || '不明';
  }

  const webrtcV4 = webrtcData.webrtc_v4 || '未検出';
  const webrtcV6 = webrtcData.webrtc_v6 || '未検出';
  const webrtcLocal = webrtcData.webrtc_local || '未検出';

  let infoSources: string[] = [];

  const apiRequests: Promise<void>[] = [
    fetch(`http://ip-api.com{clientIp}?fields=isp,org`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (data.isp) infoSources.push(data.isp);
          if (data.org && data.org !== data.isp) infoSources.push(data.org);
        }
      }).catch(() => {}),

    fetch(`https://ipinfo.io{clientIp}/json`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.org) {
          const cleanOrg = data.org.replace(/^AS\d+\s+/, '');
          infoSources.push(cleanOrg);
        }
      }).catch(() => {}),

    fetch(`https://ipapi.co{clientIp}/json/`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.org) infoSources.push(data.org);
      }).catch(() => {})
  ];

  if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1' && clientIp !== '不明') {
    apiRequests.push(
      dns.reverse(clientIp)
        .then(hostnames => {
          if (hostnames && hostnames.length > 0) infoSources.push(hostnames[0]);
        }).catch(() => {})
    );
  }

  try {
    await Promise.all(apiRequests);
  } catch (err) {
    console.error("多段API解析エラー:", err);
  }

  const uniqueProviders: string[] = [];
  infoSources.forEach(source => {
    if (!source || typeof source !== 'string') return;
    const sourceStr = source.trim();
    const lowerSource = sourceStr.toLowerCase();
    
    const isDuplicate = uniqueProviders.some(p => 
      p.toLowerCase().includes(lowerSource) || lowerSource.includes(p.toLowerCase())
    );
    if (!isDuplicate && sourceStr !== '') {
      uniqueProviders.push(sourceStr);
    }
  });

  const finalIspInfo = uniqueProviders.length > 0 ? uniqueProviders.join(' / ') : '取得失敗';

  return `access
access時間 ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}

IP: ${clientIp}
ISP/DNS: ${finalIspInfo}
UA: ${ua}

Webrtc多段IPs
IPv4: ${webrtcV4}
IPv6: ${webrtcV6}
localIP: ${webrtcLocal}`;
}

module.exports = { getAccessLog };
