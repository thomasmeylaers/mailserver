require('dotenv').config()
const bodyParser = require("body-parser")
const express = require("express")
var cors = require('cors')
const nodemailer = require("nodemailer")
const fs = require('fs')
const mongoose = require('mongoose')
const Reservering = require('./Reservering')
const fetch = require("node-fetch")

mongoose.connect(`mongodb+srv://Thomas:${process.env.MONGO_PW}@maison.z7upk72.mongodb.net/?retryWrites=true&w=majority`, () => {
    console.log("Connected to MongoDB")
}, e => console.log(e))

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

app.get('/mongotest', async (req, res) => {
    const new_reservering = await Reservering.create({
        voornaam: "thomas",
        achternaam: "meylaers",
        email: 'thomas@meylaers.com',
        telefoon: '+23121245',
        bericht: 'abcsdef'
    })
    console.log(new_reservering)
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

app.post('/mailserver/simulatie', async (req, res) => {

    // CAPTCHA
    // Check for captcha
    if (
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        return res.json({ "success": false, "msg": "Please select captcha" })
    }

    // Declare variables for request
    const secretKey = process.env.CAPTCHA
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`

    // Make request to google    
    const response = await fetch(verifyUrl);
    const body = await response.json();

    console.log(body);

    // Not succesful 
    if (body.success !== undefined && !body.success) {
        return res.json({ "success": false, "msg": "Failed Captcha Verification" })
    }
    console.log(req.body.voornaam)
    // return res.json({ "success": true, "msg": "Success" })

    // Sla reservering op in MongoDB
    const new_reservering = await Reservering.create({
        voornaam: req.body.voornaam,
        achternaam: req.body.achternaam,
        email: req.body.email,
        telefoon: req.body.telefoon,
        bericht: req.body.bericht
    })
    console.log(new_reservering)

    // Mailoptions voor bericht naar management
    var mailOptionsMaison = {
        from: 'noreply <noreply@freshpepperdesign.com>',
        to: 'thomas.meylaers@gmail.com',
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
        to: 'thomas.meylaers@gmail.com',
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

app.post('/mailserver/maison', async (req, res) => {
    if (req.body.voornaam == 'Henryrourl') {
        res.send("Done")
    }
    else {
        // Sla reservering op in MongoDB
        const new_reservering = await Reservering.create({
            voornaam: req.body.voornaam,
            achternaam: req.body.achternaam,
            email: req.body.email,
            telefoon: req.body.telefoon,
            bericht: req.body.bericht
        })
        console.log(new_reservering)
        // // Write email to text file
        fs.appendFile('emails.txt', `${req.body.email}\r\n`, err => {
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

    }
})

app.listen(port, () => {
    console.log(`Mailserver listening on port ${port}`);
})