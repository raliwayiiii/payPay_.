const dns = require('dns').promises;

async function getAccessLog(req, webrtcData) {
  const ua = req.headers['user-agent'] || '不明';

  let clientIp = req.headers['x-forwarded-for'];
  if (clientIp) {
    clientIp = clientIp.split(',')[0].trim();
  } else {
    clientIp = req.socket.remoteAddress || '不明';
  }

  const webrtcV4 = webrtcData.webrtc_v4 || '未検出';
  const webrtcV6 = webrtcData.webrtc_v6 || '未検出';
  const webrtcLocal = webrtcData.webrtc_local || '未検出';

  let infoSources = [];

  try {
    const ipApiRes = await fetch(`http://ip-api.com{clientIp}?fields=isp,org`);
    if (ipApiRes.ok) {
      const ipData = await ipApiRes.json();
      if (ipData.isp) infoSources.push(ipData.isp);
      if (ipData.org && ipData.org !== ipData.isp) infoSources.push(ipData.org);
    }

    if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1' && clientIp !== '不明') {
      const hostnames = await dns.reverse(clientIp);
      if (hostnames && hostnames.length > 0) {
        infoSources.push(hostnames[0]);
      }
    }
  } catch (err) {
    console.error("アクセス解析エラー:", err);
  }

  const uniqueProviders = [];
  infoSources.forEach(source => {
    const lowerSource = source.toLowerCase();
    const isDuplicate = uniqueProviders.some(p => 
      p.toLowerCase().includes(lowerSource) || lowerSource.includes(p.toLowerCase())
    );
    if (!isDuplicate && source.trim() !== '') {
      uniqueProviders.push(source);
    }
  });

  const finalIspInfo = uniqueProviders.length > 0 ? uniqueProviders.join(' / ') : '取得失敗';

  return `access
access時間 ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}

接続元IP: ${clientIp}
選別ISP/DNS: ${finalIspInfo}
UA: ${ua}

Webrtc多段IPs
グローバルIPv4: ${webrtcV4}
グローバルIPv6: ${webrtcV6}
ローカルIP: ${webrtcLocal}`;
}

module.exports = { getAccessLog };
