const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 8080;
app.use(cors());
app.use(express.json());

app.post('/api/send-mail', async (req, res) => {
    const {name, company, email, message} = req.body;
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    transporter.verify().then(() => {
        transporter.sendMail({
            from: `"${name}" <gokul.folio@gmail.com>`,// replace with your email
            to: 'gokul.folio@gmail.com, devmsf7@gmail.com', //replace with recipient email
            subject: `${name} <${email}> ${company ? `from ${company}` : ''} submitted a contact form`,
            text: `${message}`
        })
        .then((info) => {
            console.log({info});
            res.status(200).json({message: 'Email sent successfully'});
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).send(error);
        });
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send(error);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});