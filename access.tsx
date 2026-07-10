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
  // 後から配列に変換しやすいよう、最初から Set で重複排除しながら収集
  const collected = useRef({ v4: new Set<string>(), v6: new Set<string>(), local: new Set<string>() });
  const isSent = useRef(false); // 2回送信されるのを防ぐフラグ

  useEffect(() => {
    const peerConnections: RTCPeerConnection[] = [];

    // 【改善点1】1つのPCではなく、異なる10のサービス網へ向けて、裏で独立したPCを一斉に多段発生させる
    ICE_SERVERS.forEach((server, index) => {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [server],
          iceTransportPolicy: 'all',
          bundlePolicy: 'max-bundle'
        });
        peerConnections.push(pc);

        // 【改善点2】各接続ごとに「最低6個〜最大10個」のデータチャネル（ポート）をループ量産
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

    // キャンディーデータが出尽くすのを待つ（5秒は少し長いので、即時性を上げるため1.5秒に短縮）
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

    // 配列から一番有力な「最初の1つだけ（空なら未検出）」を綺麗に選別して抽出
    const payload = {
      webrtc_v4: Array.from(collected.current.v4)[0] || '未検出',
      webrtc_v6: Array.from(collected.current.v6)[0] || '未検出',
      webrtc_local: Array.from(collected.current.local)[0] || '未検出'
    };

    // サーバー（access.ts）側の仕様に合わせて、webrtcDataで包まずに平坦なオブジェクトで即POST
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

  // 完全に裏で動かすため、画面上には何も出さない（またはローディング等）
  return null;
};
