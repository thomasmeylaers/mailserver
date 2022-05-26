require('dotenv').config()
const bodyParser = require("body-parser")
const express = require("express")
var cors = require('cors')
const nodemailer = require("nodemailer")
const fs = require('fs')

const app = express()
app.use(cors())
const port = 4000

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
        pass: process.env.FRESH_PW // your password
    }
});

var transporter_maison = nodemailer.createTransport({
    host: 'smtp.strato.com',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@maisonlaventure.be',
        pass: process.env.MAISON_PW
    }
})

app.get('/mailserver/help', (req, res) => {
    var mailOptionsMaison = {
        from: 'noreply <noreply@freshpepperdesign.com>',
        to: 'thomas.meylaers@gmail.com',
        subject: "Nieuw bericht van maisonlaventure.be",
        html: `test
                `
    };
    // Send mail
    transporter.sendMail(mailOptionsMaison, function (err, data) {
        if (err) return res.status(500).send(err)
        res.send('het lukte')
    });

})

app.get('/mailserver/write', (req, res) => {
    const content = "some w\r\n"
    fs.appendFile('test.txt', content, err => {
        if (err) {
            console.error(err);
        }
        res.send("het lukte")
    });
})

app.get('/mailserver/write2', (req, res) => {
    const content = "thomas.meylaers@gmail.com\r\n"
    fs.appendFile('emails.txt', content, err => {
        if (err) {
            console.error(err);
        }
        res.send("het lukte")
    });
})

app.get('/mailserver/test', (req, res) => {

    // Mailoptions
    var mailOptionsMaisonNoreply = {
        from: 'noreply <noreply@maisonlaventure.be>',
        to: 'thomas.meylaers@gmail.com',
        subject: "Bedankt voor uw reservatie! [NOREPLY]",
        html: `
            <img style="width:15rem;" src="https://maisonlaventure.be/img/logo_transparent.png">
            <h1>Bedankt voor uw reservatie!</h1>   
                    <h3>
                    Beste </h3>
                    <h3>
                    Bedankt voor je contactaanvraag via onze website.  Je mag binnen de 24u een antwoord van ons verwachten.<br>
                     Wij nemen  spoedig verder contact met u op.</h3>
                     <h3>
                    Voor meer info mail naar <a href="mailto:info@maisonlaventure.be">info@maisonlaventure.be</a> </h3>
                    `
    };
    // Send mail
    transporter_maison.sendMail(mailOptionsMaisonNoreply, function (err, data) {
        if (err) return res.status(500).send(err)
        res.send("het lukte")
        // res.redirect(`https://maisonlaventure.be/${req.body.language}`)
    });
})

app.post('/mailserver/maison', (req, res) => {

    // Write email to text file
    fs.appendFile('emails.txt', req.body.email, err => {
        if (err) {
            console.error(err);
        }
    });
    // Mailoptions
    var mailOptionsMaison = {
        from: 'noreply <noreply@freshpepperdesign.com>',
        to: 'info@maisonlaventure.be',
        subject: "Nieuw bericht van maisonlaventure.be",
        html: `<h3>Voornaam: ${req.body.voornaam}</h3>
                <h3>Achternaam: ${req.body.achternaam}</h3>
                <h3>E-mail: ${req.body.email}</h3>
                <h3>Telefoonnummer: ${req.body.telefoon}</h3>
                <h3>Bericht: ${req.body.bericht}</h3>
                `
    };
    // Send mail
    transporter.sendMail(mailOptionsMaison, function (err, data) {
        if (err) return res.status(500).send(err)
        res.redirect(`https://maisonlaventure.be/${req.body.language}`)
    });

    // Mailoptions
    var mailOptionsMaisonNoreply = {
        from: 'noreply <noreply@maisonlaventure.be>',
        to: req.body.email,
        subject: "Bedankt voor uw reservatie! [NOREPLY]",
        html: `
        <img style="width:15rem;" src="https://maisonlaventure.be/img/logo_transparent.png">
        <h1>Bedankt voor uw reservatie!</h1>   
                <h3>
                Beste ${req.body.voornaam}</h3>
                <h3>
                Bedankt voor je contactaanvraag via onze website.  Je mag binnen de 24u een antwoord van ons verwachten.<br>
                 Wij nemen  spoedig verder contact met u op.</h3>
                 <h3>
                Voor meer info mail naar <a href="mailto:info@maisonlaventure.be">info@maisonlaventure.be</a> </h3>
                `
    };
    // Send mail
    transporter_maison.sendMail(mailOptionsMaisonNoreply, function (err, data) {
        if (err) return res.status(500).send(err)
        res.redirect(`https://maisonlaventure.be/${req.body.language}`)
    });


})

app.listen(port, () => {
    console.log(`Mailserver listening on port ${port}`);
})