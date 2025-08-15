import nodemailer from "nodemailer";
export async function sendEmail({
  from = process.env.APP_EMAIL,
  to = [],
  cc = [],
  bcc = [],
  subject = "Welcome to Srahah 🎉",
  text = "",
  html = "",
  attachments= []
}={}
){

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
       user: process.env.APP_EMAIL, 
      pass: process.env.APP_PASSWORD 
    },
  })

  const info = await transport.sendMail({
    from: `"Saraha ❤"<${from}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments
  });
  // console.log({message_sent : info.messageId})
}


// await sendEmail({
//     to: email,
//     // cc : "example@gmail.com", // show to all
//     // bcc : "example@gmail.com", // blind to all
//     html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <title>Welcome Email</title>
//   <style>
//     * {
//       box-sizing: border-box;
//     }

//     body {
//       margin: 0;
//       padding: 0;
//       font-family: Arial, sans-serif;
//       background-color: #f4f4f4;
//     }

//     .email-wrapper {
//       max-width: 600px;
//       margin: auto;
//       background: #ffffff;
//       border-radius: 8px;
//       overflow: hidden;
//       box-shadow: 0 0 10px rgba(0,0,0,0.1);
//     }

//     .header {
//       background-color: #00bfa6;
//       padding: 20px;
//       text-align: center;
//       color: #fff;
//       font-size: 24px;
//       font-weight: bold;
//     }

//     .content {
//       padding: 30px 20px;
//       text-align: center;
//     }

//     .content h2 {
//       color: #333333;
//       font-size: 22px;
//       margin-bottom: 15px;
//     }

//     .content p {
//       font-size: 16px;
//       color: #555;
//       margin-bottom: 25px;
//     }

//     .btn {
//       display: inline-block;
//       padding: 12px 24px;
//       background-color: #00bfa6;
//       color: white;
//       text-decoration: none;
//       border-radius: 5px;
//       font-weight: bold;
//     }

//     .social {
//       text-align: center;
//       padding: 20px 0;
//     }

//     .social a {
//       margin: 0 10px;
//       display: inline-block;
//     }

//     .social img {
//       width: 40px;
//       height: 40px;
//       border-radius: 50%;
//     }

//     @media only screen and (max-width: 600px) {
//       .email-wrapper {
//         width: 100% !important;
//         border-radius: 0;
//       }

//       .btn {
//         display: block;
//         width: 80%;
//         margin: auto;
//       }
//     }
//   </style>
// </head>
// <body>

//   <div class="email-wrapper">
//     <div class="header">Saraha App</div>

//     <div class="content">
//       <h2>Hello ${user.fullName} 👋</h2>
//       <p>Welcome to Saraha! Click below to confirm your email and start using your account.</p>
//       <a href="https://your-app.com/confirm?email=${encodeURIComponent(
//         user.email
//       )}" class="btn">Confirm Email</a>
//     </div>

//     <!-- Social Media Section -->
//     <div class="social">
//       <a target="_blank" href=${process.env.facebookLink}>
//         <img title="Facebook" src="https://localfiles.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb">
//       </a>
//       <a target="_blank" href=${process.env.instagramLink}>
//         <img title="Instagram" src="https://localfiles.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Instagram">
//       </a>
//       <a target="_blank" href=${process.env.linkedinLink}">
//         <img title="LinkedIn" src="https://localfiles.stripocdn.email/content/assets/img/social-icons/logo-black/linkedin-logo-black.png" alt="LinkedIn">
//       </a>
//     </div>

//     <!-- Anti-clipping technique -->
//   <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;">      </div>
//   </div>

// </body>
// </html>`,
//     attachments: [
//       // plain text
//       {
//         // filename : "CV",
//         // path : path.resolve("./cv.pdf"),
//         // contentType:"application/pdf"
//       }
//     ],
//   })