export const emailTemplate = async(data)=>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your OTP Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      background-color: #00bfa6;
      color: white;
      text-align: center;
      padding: 20px 0;
      font-size: 24px;
    }

    .content {
      padding: 30px 20px;
      text-align: center;
    }

    .content p {
      font-size: 18px;
      color: #333;
      margin-bottom: 30px;
    }

    .otp {
      display: inline-block;
      background-color: #f0f0f0;
      padding: 12px 24px;
      font-size: 28px;
      letter-spacing: 12px;
      font-weight: bold;
      border-radius: 6px;
      color: #333;
      margin-bottom: 30px;
    }

    .button-container {
      margin-top: 10px;
    }

    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #00bfa6;
      color: white;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      font-size: 16px;
    }

    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #999;
    }

    @media only screen and (max-width: 600px) {
      .otp {
        font-size: 22px;
        letter-spacing: 8px;
        padding: 10px 20px;
      }

      .button {
        padding: 12px 24px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">Saraha App</div>
    <div class="content">
      <p>Hello <strong>${data.user.fullName}</strong>,<br/>
      ${data.title}</p>

      <div class="otp">${data.otp}</div>

      <div class="button-container">
        <a href="" class="button">${data.world}</a>
      </div>
    </div>
    <div class="footer">
      If you didn’t request this code, you can safely ignore this message.
    </div>
  </div>

</body>
</html>
`
}