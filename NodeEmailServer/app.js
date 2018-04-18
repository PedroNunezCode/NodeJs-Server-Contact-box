// Imports the dependacies we downloaded.
const express = require('express'); // Write handling for http and url paths.
const bodyParser = require('body-parser'); // Reads http post data.
const exphbs = require('express-handlebars'); // View engine
const nodemailer = require('nodemailer'); // Allows to send mail. Use this if using for contact box.
const path = require('path') // Provides utilities for working with file and directory paths

const app = express(); // Web framework for express application.

//View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars'); // Handle bars view engine.


//Body parser Middleware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index');
});

// This html will apear where the email is delivered.
// This will contain all the input from the customer.
app.post('/send', (req, res) => {
    const output = `
        <p>Customer contact request.</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: <b>${req.body.name}</b></li>
            <li>Name: <b>${req.body.company}</b></li>
            <li>Name: <b>${req.body.email}</b></li>
            <li>Name: <b>${req.body.phone}</b></li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    // Allows nodemailer to send email from email below..
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // If port number is 465, Change to True.
        auth: {
            user: 'senderemail@test.com', // Email that sends the request.
            pass: 'secretpassword' // Password for email sender.
        },
        tls:{
            rejectUnauthorized: false // Allows localhost to send data.
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Support request" <senderemail@test.com>', // sender address
        to: 'list@gmail.com, list@gmail.org', // list of receivers add ','.
        subject: 'Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body template made above (line 30)
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('index', {msg: 'Email has been sent'})
    });
    
});

app.listen(3000, () => console.log('Server started...'));