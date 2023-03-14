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

var transporter_maison_meldingen = nodemailer.createTransport({
  host: 'smtp.strato.com',
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@maisonlaventure.be',
    pass: process.env.MAISON_PW
  }
})


app.get('/mailserver/meldingenTest', async (req, res) => {
  var mailOptionsMeldingMaison = {
    from: "Meldingen <meldingen@maisonlaventure.be>",
    to: 'thomas.meylaers@gmail.com',
    subject: "Nieuw bericht van maisonlaventure.be",
    html: `<h3>Voornaam: </h3>
                <h3>Achternaam: </h3>
                <h3>E-mail: </h3>
                <h3>Telefoonnummer: </h3>
                <h3>Bericht: </h3>
                `
  };
  // Send mail
  transporter_maison_meldingen.sendMail(mailOptionsMeldingMaison, function (err, data) {
    if (err) return res.status(500).send(err)
  });
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
        <h1>Bedankt voor uw reservatie!</h1>   
                <p>
                Beste ${req.body.voornaam}</p>
                <p>
                Bedankt voor je contactaanvraag via onze website.  Je mag binnen de 24u een antwoord van ons verwachten.<br></p>
                 <p>
                Voor meer info mail naar <a href="mailto:info@maisonlaventure.be">info@maisonlaventure.be</a> </p>
                <br>
                <table id="zs-output-sig" border="0" cellpadding="0" cellspacing="0"
    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse; width:650px;">
    <tbody>
      <tr>
        <td style="padding: 0px !important;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td style="padding: 0px !important;">
                                  <table border="0" cellpadding="0" cellspacing="0"
                                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                    <tbody>
                                      <tr>
                                        <td
                                          style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                          <span
                                            style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                            Met vriendelijke groeten,</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="border-collapse:collapse;padding-bottom:7px;height:7px;"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0px !important;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
            <tbody>
              <tr>
                <td width="156" style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="border-collapse:collapse;line-height:0px;padding: 0px !important;"><img height="128"
                            width="200" alt="" border="0" src="https://maisonlaventure.be/img/mail/logo_cropped.png">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <!-- asdfasdf? -->
                <td width="11" style="border-collapse:collapse;padding-right: 10px;width:0px;"></td>
                <td style="padding: 0px !important;width: 205px;position: relative;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;position: absolute;top: 10px;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td style="padding: 0px !important;">
                                  <table border="0" cellpadding="0" cellspacing="0"
                                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                    <tbody>
                                      <tr>
                                        <td
                                          style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                          <span
                                            style="font-family:Helvetica, sans-serif;font-size:18px;font-style:normal;line-height:17px;font-weight:800;color:#000001;display:inline;text-align: right;">Team
                                            Maison l'Aventure</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>


                      <tr style="float: right;padding-top: 5px;">
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse; ">
                            <tbody>
                              <tr>
                                <td style="padding: 0px !important;">
                                  <table border="0" cellpadding="0" cellspacing="0"
                                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                    <tbody>
                                      <tr>
                                        <td
                                          style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                          <span
                                            style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;font-weight:400;color:#000001;display:inline; position: relative;">
                                            <a style="text-decoration: none; color: #000001; position: absolute; right: 28px;top: 1.3px;"
                                              href="https://www.facebook.com/Maisonlaventure/" target="_blank"><img
                                                style="width: 15px;"
                                                src="https://maisonlaventure.be/img/mail/facebook.png"
                                                alt="facebook icon"> <a style="position: absolute; right: 0;"
                                                href="https://www.instagram.com/maison_laventure/" target="_blank"><img
                                                  style="width: 18px;"
                                                  src="https://maisonlaventure.be/img/mail/instagram.png"
                                                  alt="instagram icon"></a>
                                          </span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td width="11" style="border-collapse:collapse;padding-right: 14px;width:0px;"></td>

                <td width="2"
                  style="border-collapse:collapse;background-color:#1B7034;width: 1px;vertical-align: super;padding: 0px !important;">
                </td>
                <td width="11" style="border-collapse:collapse;padding-right: 14px;width:0px;"></td>

                <!-- asdfasdfasdf -->
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td style="padding: 0px !important;">
                                  <table border="0" cellpadding="0" cellspacing="0"
                                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                    <tbody>
                                      <tr>
                                        <td
                                          style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                          <span
                                            style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;text-decoration: none;color: black;"><a
                                              target="_blank" href="tel:+32475285068"
                                              style="text-decoration: none; color:black;"><img style="width: 18px;"
                                                src="https://maisonlaventure.be/img/mail/phone.png" alt="phone icon">
                                              0033/9-75 35 72 71&nbsp;</a></span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td style="padding: 0px !important;">
                                  <table border="0" cellpadding="0" cellspacing="0"
                                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                    <tbody>
                                      <tr>
                                        <td
                                          style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                          <span
                                            style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                            <a href="mailto:info@maisonlaventure.be"
                                              style="text-decoration: none; color:black;"><img style="width: 18px;"
                                                src="https://maisonlaventure.be/img/mail/mail.png" alt="mail icon">
                                              info@maisonlaventure.be</a> </span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td style="padding: 0px !important;">
                                  <table border="0" cellpadding="0" cellspacing="0"
                                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                    <tbody>
                                      <tr>
                                        <td
                                          style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                          <span
                                            style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                            <a style="text-decoration: none; color: #000001;"
                                              href="https://maisonlaventure.be/" target="_blank"><img
                                                style="width: 18px;"
                                                src="https://maisonlaventure.be/img/mail/internet.png"
                                                alt="internet icon"> www.maisonlaventure.be</a></span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td style="padding: 0px !important;">
                                  <table border="0" cellpadding="0" cellspacing="0"
                                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                    <tbody>
                                      <tr>
                                        <td
                                          style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                          <span
                                            style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                            <a style="text-decoration: none; color: #000001;"
                                              href="https://www.google.com/maps?ll=46.764297,2.012311&z=17&t=m&hl=nl&gl=BE&mapclient=embed&cid=13840459975442114610"
                                              target="_blank"><img style="width: 18px;"
                                                src="https://maisonlaventure.be/img/mail/location.png"
                                                alt="location icon"> Les Petites
                                              Douces, 36120 Pruniers (Indre)</a> </span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

    </tbody>
  </table>
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
  console.log("IK KRIJG IETS")
  console.log(Date())
  // CAPTCHA
  // Check for captcha
  if (
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ) {
    console.log("PLEASE SELECT CAPTCHA")
    return res.json({ "success": false, "msg": "Please select captcha" })
  }

  // Declare variables for request
  const secretKey = process.env.CAPTCHA
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`

  // Make request to google    
  const response = await fetch(verifyUrl);
  const body = await response.json();


  // Not succesful 
  if (body.success !== undefined && !body.success) {
    console.log("FAILED CAPTCHA VERIFICATION")
    return res.json({ "success": false, "msg": "Failed Captcha Verification" })
  }
  console.log(req.body.voornaam)
  // return res.json({ "success": true, "msg": "Success" })

  // Sla reservering op in MongoDB
  console.log("START")
  const new_reservering = await Reservering.create({
    voornaam: req.body.voornaam,
    achternaam: req.body.achternaam,
    email: req.body.email,
    telefoon: req.body.telefoon,
    bericht: req.body.bericht
  })


  console.log(new_reservering)
  console.log("-------------------------------------------------------")

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
  });

  // Mailoptions
  var mailOptionsMaisonNoreply = {
    from: 'noreply <noreply@maisonlaventure.be>',
    to: 'thomas.meylaers@gmail.com',
    subject: "Bedankt voor uw reservatie! [NOREPLY]",
    html: `        <h1>Bedankt voor uw reservatie!</h1>   
        <p>
        Beste ${req.body.voornaam}</p>
        <p>
        Bedankt voor je contactaanvraag via onze website.  Je mag binnen de 24u een antwoord van ons verwachten.<br></p>
         <p>
        Voor meer info mail naar <a href="mailto:info@maisonlaventure.be">info@maisonlaventure.be</a> </p>
        <br>
        <table id="zs-output-sig" border="0" cellpadding="0" cellspacing="0"
style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse; width:650px;">
<tbody>
<tr>
<td style="padding: 0px !important;">
  <table border="0" cellpadding="0" cellspacing="0"
    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
    <tbody>
      <tr>
        <td style="padding: 0px !important;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                    Met vriendelijke groeten,</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:7px;height:7px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
</tr>
<tr>
<td style="padding: 0px !important;">
  <table border="0" cellpadding="0" cellspacing="0"
    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
    <tbody>
      <tr>
        <td width="156" style="padding: 0px !important;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="border-collapse:collapse;line-height:0px;padding: 0px !important;"><img height="128"
                    width="200" alt="" border="0" src="https://maisonlaventure.be/img/mail/logo_cropped.png">
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <!-- asdfasdf? -->
        <td width="11" style="border-collapse:collapse;padding-right: 10px;width:0px;"></td>
        <td style="padding: 0px !important;width: 205px;position: relative;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;position: absolute;top: 10px;">
            <tbody>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:18px;font-style:normal;line-height:17px;font-weight:800;color:#000001;display:inline;text-align: right;">Team
                                    Maison l'Aventure</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>


              <tr style="float: right;padding-top: 5px;">
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse; ">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;font-weight:400;color:#000001;display:inline; position: relative;">
                                    <a style="text-decoration: none; color: #000001; position: absolute; right: 28px;top: 1.3px;"
                                      href="https://www.facebook.com/Maisonlaventure/" target="_blank"><img
                                        style="width: 15px;"
                                        src="https://maisonlaventure.be/img/mail/facebook.png"
                                        alt="facebook icon"> <a style="position: absolute; right: 0;"
                                        href="https://www.instagram.com/maison_laventure/" target="_blank"><img
                                          style="width: 18px;"
                                          src="https://maisonlaventure.be/img/mail/instagram.png"
                                          alt="instagram icon"></a>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td width="11" style="border-collapse:collapse;padding-right: 14px;width:0px;"></td>

        <td width="2"
          style="border-collapse:collapse;background-color:#1B7034;width: 1px;vertical-align: super;padding: 0px !important;">
        </td>
        <td width="11" style="border-collapse:collapse;padding-right: 14px;width:0px;"></td>

        <!-- asdfasdfasdf -->
        <td style="padding: 0px !important;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;text-decoration: none;color: black;"><a
                                      target="_blank" href="tel:+32475285068"
                                      style="text-decoration: none; color:black;"><img style="width: 18px;"
                                        src="https://maisonlaventure.be/img/mail/phone.png" alt="phone icon">
                                      0033/9-75 35 72 71&nbsp;</a></span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                    <a href="mailto:info@maisonlaventure.be"
                                      style="text-decoration: none; color:black;"><img style="width: 18px;"
                                        src="https://maisonlaventure.be/img/mail/mail.png" alt="mail icon">
                                      info@maisonlaventure.be</a> </span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                    <a style="text-decoration: none; color: #000001;"
                                      href="https://maisonlaventure.be/" target="_blank"><img
                                        style="width: 18px;"
                                        src="https://maisonlaventure.be/img/mail/internet.png"
                                        alt="internet icon"> www.maisonlaventure.be</a></span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                    <a style="text-decoration: none; color: #000001;"
                                      href="https://www.google.com/maps?ll=46.764297,2.012311&z=17&t=m&hl=nl&gl=BE&mapclient=embed&cid=13840459975442114610"
                                      target="_blank"><img style="width: 18px;"
                                        src="https://maisonlaventure.be/img/mail/location.png"
                                        alt="location icon"> Les Petites
                                      Douces, 36120 Pruniers (Indre)</a> </span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
</tr>

</tbody>
</table>`
  };
  // Send mail
  transporter_maison.sendMail(mailOptionsMaisonNoreply, function (err, data) {
    if (err) return res.status(500).send(err)
    res.json({ "success": true, "msg": "Everything went correctly" })
  });

})

app.post('/mailserver/maison', async (req, res) => {
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
  console.log(Date())
  console.log(new_reservering)
  console.log("-------------------------------------------------------")
  // // Write email to text file
  fs.appendFile('emails.txt', `${req.body.email}\r\n`, err => {
    if (err) {
      console.error(err);
    }
  });
  // Mailoptions
  var mailOptionsMaison = {
    from: 'Meldingen <meldingen@maisonlaventure.be>',
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
  transporter_maison_meldingen.sendMail(mailOptionsMaison, function (err, data) {
    if (err) return res.status(500).send(err)
  });

  // Mailoptions
  var mailOptionsMaisonNoreply = {
    from: 'noreply <noreply@maisonlaventure.be>',
    to: req.body.email,
    subject: "Bedankt voor uw reservatie! [NOREPLY]",
    html: `        <h1>Bedankt voor uw reservatie!</h1>   
        <p>
        Beste ${req.body.voornaam}</p>
        <p>
        Bedankt voor je contactaanvraag via onze website.  Je mag binnen de 24u een antwoord van ons verwachten.<br></p>
         <p>
        Voor meer info mail naar <a href="mailto:info@maisonlaventure.be">info@maisonlaventure.be</a> </p>
        <br>
        <table id="zs-output-sig" border="0" cellpadding="0" cellspacing="0"
style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse; width:650px;">
<tbody>
<tr>
<td style="padding: 0px !important;">
  <table border="0" cellpadding="0" cellspacing="0"
    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
    <tbody>
      <tr>
        <td style="padding: 0px !important;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                    Met vriendelijke groeten,</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:7px;height:7px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
</tr>
<tr>
<td style="padding: 0px !important;">
  <table border="0" cellpadding="0" cellspacing="0"
    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
    <tbody>
      <tr>
        <td width="156" style="padding: 0px !important;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="border-collapse:collapse;line-height:0px;padding: 0px !important;"><img height="128"
                    width="200" alt="" border="0" src="https://maisonlaventure.be/img/mail/logo_cropped.png">
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <!-- asdfasdf? -->
        <td width="11" style="border-collapse:collapse;padding-right: 10px;width:0px;"></td>
        <td style="padding: 0px !important;width: 205px;position: relative;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;position: absolute;top: 10px;">
            <tbody>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:18px;font-style:normal;line-height:17px;font-weight:800;color:#000001;display:inline;text-align: right;">Team
                                    Maison l'Aventure</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>


              <tr style="float: right;padding-top: 5px;">
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse; ">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;font-weight:400;color:#000001;display:inline; position: relative;">
                                    <a style="text-decoration: none; color: #000001; position: absolute; right: 28px;top: 1.3px;"
                                      href="https://www.facebook.com/Maisonlaventure/" target="_blank"><img
                                        style="width: 15px;"
                                        src="https://maisonlaventure.be/img/mail/facebook.png"
                                        alt="facebook icon"> <a style="position: absolute; right: 0;"
                                        href="https://www.instagram.com/maison_laventure/" target="_blank"><img
                                          style="width: 18px;"
                                          src="https://maisonlaventure.be/img/mail/instagram.png"
                                          alt="instagram icon"></a>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td width="11" style="border-collapse:collapse;padding-right: 14px;width:0px;"></td>

        <td width="2"
          style="border-collapse:collapse;background-color:#1B7034;width: 1px;vertical-align: super;padding: 0px !important;">
        </td>
        <td width="11" style="border-collapse:collapse;padding-right: 14px;width:0px;"></td>

        <!-- asdfasdfasdf -->
        <td style="padding: 0px !important;">
          <table border="0" cellpadding="0" cellspacing="0"
            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;text-decoration: none;color: black;"><a
                                      target="_blank" href="tel:+32475285068"
                                      style="text-decoration: none; color:black;"><img style="width: 18px;"
                                        src="https://maisonlaventure.be/img/mail/phone.png" alt="phone icon">
                                      0033/9-75 35 72 71&nbsp;</a></span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                    <a href="mailto:info@maisonlaventure.be"
                                      style="text-decoration: none; color:black;"><img style="width: 18px;"
                                        src="https://maisonlaventure.be/img/mail/mail.png" alt="mail icon">
                                      info@maisonlaventure.be</a> </span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                    <a style="text-decoration: none; color: #000001;"
                                      href="https://maisonlaventure.be/" target="_blank"><img
                                        style="width: 18px;"
                                        src="https://maisonlaventure.be/img/mail/internet.png"
                                        alt="internet icon"> www.maisonlaventure.be</a></span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0px !important;">
                  <table border="0" cellpadding="0" cellspacing="0"
                    style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px !important;">
                          <table border="0" cellpadding="0" cellspacing="0"
                            style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px!important;border-spacing:0px;margin:0px;border-collapse:collapse;">
                            <tbody>
                              <tr>
                                <td
                                  style="border-collapse:collapse;font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;padding: 0px !important;">
                                  <span
                                    style="font-family:Helvetica, sans-serif;font-size:15.0px;font-style:normal;line-height:17px;font-weight:400;color:#000001;display:inline;">
                                    <a style="text-decoration: none; color: #000001;"
                                      href="https://www.google.com/maps?ll=46.764297,2.012311&z=17&t=m&hl=nl&gl=BE&mapclient=embed&cid=13840459975442114610"
                                      target="_blank"><img style="width: 18px;"
                                        src="https://maisonlaventure.be/img/mail/location.png"
                                        alt="location icon"> Les Petites
                                      Douces, 36120 Pruniers (Indre)</a> </span>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-collapse:collapse;padding-bottom:1px;height:3px;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
</tr>

</tbody>
</table>
                `
  };
  // Send mail
  transporter_maison.sendMail(mailOptionsMaisonNoreply, function (err, data) {
    if (err) return res.status(500).send(err)
    res.json({ "success": true, "msg": "Everything went correctly" })
  });

})

app.listen(port, () => {
  console.log(`Mailserver listening on port ${port}`);
})