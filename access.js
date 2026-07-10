const dns = require('dns').promises;

function isIPv6(ip) {
  return ip.includes(':');
}

async function getAccessLog(req, webrtcData) {
  const ua = req.headers['user-agent'] || '不明';

  let clientIp = req.headers['x-forwarded-for'];
  if (clientIp) {
    clientIp = clientIp.split(',')[0].trim();
  } else {
    clientIp = req.socket.remoteAddress || '不明';
  }


  const detectedIpType = isIPv6(clientIp) ? 'IPv6' : 'IPv4';

  const webrtcV4 = webrtcData.webrtc_v4 || '未検出';
  const webrtcV6 = webrtcData.webrtc_v6 || '未検出';
  const webrtcLocal = webrtcData.webrtc_local || '未検出';


  let infoSources = []; 
  let dnsSources = [];  
  let coordinates = null; 


  const apiRequests = [


    fetch(`http://ip-api.com{clientIp}?fields=isp,org,lat,lon`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (data.isp) infoSources.push(data.isp);
          if (data.org && data.org !== data.isp) infoSources.push(data.org);
          if (data.lat && data.lon && !coordinates) {
            coordinates = { lat: data.lat, lon: data.lon };
          }
        }
      }).catch(() => {}),



    fetch(`https://ipinfo.io{clientIp}/json`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (data.org) {
            const cleanOrg = data.org.replace(/^AS\d+\s+/, '');
            infoSources.push(cleanOrg);
          }
          if (data.loc && !coordinates) {
            const [lat, lon] = data.loc.split(',').map(Number);
            coordinates = { lat, lon };
          }
        }
      }).catch(() => {}),



    fetch(`https://ipapi.co{clientIp}/json/`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (data.org) infoSources.push(data.org);
          if (data.latitude && data.longitude && !coordinates) {
            coordinates = { lat: data.latitude, lon: data.longitude };
          }
        }
      }).catch(() => {})
  ];

  if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1' && clientIp !== '不明') {
    apiRequests.push(
      dns.reverse(clientIp)
        .then(hostnames => {
     
          if (hostnames && hostnames.length > 0) dnsSources.push(hostnames[0]);
        }).catch(() => {})
    );
  }

  try {
    await Promise.all(apiRequests);
  } catch (err) {
    console.error("多段API解析エラー:", err);
  }


  const uniqueProviders = [];

  infoSources.sort((a, b) => b.length - a.length);
  
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
  const finalDnsInfo = dnsSources.length > 0 ? dnsSources[0] : '逆引き失敗';


 let googleMapUrl = '位置情報取得失敗';
  if (coordinates) {
    googleMapUrl = `https://google.com{coordinates.lat},${coordinates.lon}`;
  }

  // 元のフォーマットを維持しつつ、新項目を安全に追加
  return `log
access ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}

IP: ${clientIp} (${detectedIpType})
ISP: ${finalIspInfo}
DNS: ${finalDnsInfo}
GoogleMap: ${googleMapUrl}
UA: ${ua}

Webrtc多段IPs
IPv4: ${webrtcV4}
IPv6: ${webrtcV6}
localIP: ${webrtcLocal}`;
}

module.exports = { getAccessLog };
