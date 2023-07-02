const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Whatsapp Bot Aktif!");
});

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

app.post("/check", async (req, res) => {
    const { number } = req.body;
    if (!number || number.length < 10 || number.length > 13 || isNaN(number)) {
        return res.json({
            status: "error",
            message: "Invalid number",
            example: "905300000000",
        });
    }
    const user = await client.getContactById(`${number}@c.us`);
    const pic = await client.getProfilePicUrl(`${number}@c.us`);
    res.send(`
    <center style="padding-top: 7%; font-family: sans-serif; font-size: 20px;">
        <h1>Fast <span style="color: #25D366">Whatsapp</span> Checker</h1><br>
        <img src="${pic}" alt="Profile Picture" style="width: 250px; height: 250px; border-radius: 50%;">
        <p>
            Number: ${number}<br>
            Name: ${user?.pushname}<br>
            Is Business: ${user?.isBusiness}<br>
            Is Enterprise: ${user?.isEnterprise}<br>
        </p>
    </center>
    `)
});

client.initialize();
app.listen(80, () => {
    console.log("Sistem Aktif!");
});