import React, { useEffect, useRef } from 'react';

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
      await fetch('/api/log-access', {
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
const { getAccessLog } = require('./getAccessLog');
