const nodemailer = require('nodemailer');
const { Readable } = require('stream');
require('dotenv').config();




// 🚨 Add these debug lines:
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✔️ present" : "❌ missing");
console.log("EMAIL_TO:", process.env.EMAIL_TO);

const transporter = nodemailer.createTransport({
    host: 'aten.ch-dns.net',
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = async function sendMediqEmail(formData) {
    const jsonBuffer = Buffer.from(JSON.stringify(formData, null, 2));

    const mailOptions = {
        from: `"MEDI-Q Formulaire" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `🩺 MEDI-Q: Nouveau formulaire de ${formData.patientCode}`,
        html: `
      <h2>Formulaire MEDI-Q reçu</h2>
      <p>Voir le fichier joint pour les données complètes.</p>
    `,
        attachments: [
            {
                filename: `mediq-${formData.patientCode}-${Date.now()}.json`,
                content: jsonBuffer,
                contentType: 'application/json'
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};
