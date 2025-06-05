const nodemailer = require('nodemailer');
const { Readable } = require('stream');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
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
        to: [process.env.EMAIL_TO, process.env.EMAIL_TO_ADM],
        subject: `MEDI-Q: Nouveau formulaire de ${formData.patientCode}`,
        html: `
          <h2>🩺 Formulaire MEDI-Q reçu</h2>
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

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent. Response from SMTP:");
        console.log(info);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
};
