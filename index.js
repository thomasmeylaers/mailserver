require('dotenv').config()
const bodyParser = require("body-parser")
const express = require("express")
var cors = require('cors')
const nodemailer = require("nodemailer")

const app = express()
app.use(cors())
const port = 3000

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Transporter
var transporter = nodemailer.createTransport({
    host: 'mail.mihos.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'noreply@freshpepperdesign.com', // your domain email address
        pass: process.env.MAIL_PW // your password
    }
});

app.get('/test', (req, res) => {
    console.log(process.env.MAIL_PW)
})

app.post('/contact/maison', (req, res) => {
    // Mailoptions
    var mailOptionsMaison = {
        from: 'noreply <noreply@freshpepperdesign.com>',
        to: 'thomas.meylaers@gmail.com',
        subject: "Nieuw bericht van maisonlaventure.be",
        html: `<h6>Voornaam: ${req.body.voornaam}</h6>
                <h6>Achternaam: ${req.body.achternaam}</h6>
                <h6>E-mail: ${req.body.email}</h6>
                <h6>Telefoonnummer: ${req.body.telefoon}</h6>
                <h6>Bericht: ${req.body.bericht}</h6>
                `
    };
    // Send mail
    transporter.sendMail(mailOptionsMaison, function (err, data) {
        if (err) return res.status(500).send(err)
        res.redirect("http://127.0.0.1:5501/index.html")
    });
})

app.listen(port, () => {
    console.log(`Mailserver listening on port ${port}`);
})