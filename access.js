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


  const apiRequests = [

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

  // 【重複排除・選別ロジック】同じプロバイダ情報を1つに絞り込む
  const uniqueProviders = [];
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

  const finalIspInfo = uniqueProviders.length > 0 ? uniqueProviders[0] : '取得失敗';

  return `log
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
