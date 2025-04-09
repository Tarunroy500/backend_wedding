const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  logger: true,
  debug: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendContactEmail = async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      phone,
      eventDate,
      selectedPackage,
      emiPreference,
    } = req.body;
    // console.log(req.body);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIEVER,
      subject: "New Contact Form Submission",
      html: `
                <h3>New Contact Form Message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Event Date:</strong> ${
                  eventDate || "Not specified"
                }</p>
                <p><strong>Package:</strong> ${
                  selectedPackage || "Not selected"
                }</p>
                <p><strong>EMI Preference:</strong> ${
                  emiPreference || "Not selected"
                }</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
      };
    //   console.log(mailOptions);
      

    await transporter.sendMail(mailOptions).then((info) => {
      console.log("Email sent: " + info.response);
    }
    ).catch((error) => {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email" });
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
