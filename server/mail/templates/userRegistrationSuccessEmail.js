const userRegistrationSuccessEmail = (name) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Pluto Intero</title>
    <style>
      body {
        background-color: #f5f0e5;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 40px 0;
        color: #333;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 40px 30px;
        border-radius: 12px;
        box-shadow: 0 0 12px rgba(0,0,0,0.08);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header img {
        max-width: 120px;
      }

      .title {
        font-size: 24px;
        color: #1a1a1a;
        margin-top: 20px;
        font-weight: 700;
      }

      .content {
        font-size: 16px;
        line-height: 1.6;
        color: #444;
      }

      .highlight {
        font-weight: 600;
        color: #000;
      }

      .cta {
        display: inline-block;
        margin-top: 30px;
        color: #000000ff;
        background: #f7f9f7;
        border:2px solid black;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        transition: background 0.3s ease-in-out;
      }

      

      .tips {
        margin-top: 40px;
        padding: 20px;
        background: #f7f9f7;
        border-left: 4px solid #2f6f5e;
        border-radius: 8px;
      }

      .tips ul {
        margin: 0;
        padding-left: 20px;
        text-align: left;
      }

      .footer {
        text-align: center;
        margin-top: 40px;
        font-size: 13px;
        color: #888;
      }

      a {
        color: #2f6f5e;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <div class="title">Welcome to Pluto Intero, ${name}!</div>
      </div>

      <div class="content">
        <p>We’re excited to have you join the <span class="highlight">Pluto Intero</span> community.</p>

        <p>
          Pluto Intero is more than a home décor brand — we’re on a mission to
          redefine living spaces through <span class="highlight">sustainable materials,
          thoughtful design, and smart innovation</span>.
        </p>

        <p>
          From our iconic <strong>Smart Wall Lamps</strong> to future-forward décor made
          from recycled materials, every product is designed to make your home
          beautiful, functional, and eco-conscious.
        </p>

        <div class="tips">
          <strong>🌱 Get Started with Pluto Intero:</strong>
          <ul>
            <li>🛋️ Explore our <strong>sustainable home décor collections</strong>.</li>
            <li>💡 Discover <strong>smart, touch-enabled designs</strong>.</li>
            <li>♻️ Support products made from <strong>100% recycled materials</strong>.</li>
            <li>📦 Enjoy <strong>easy installation</strong> with no drilling required.</li>
          </ul>
        </div>

        <a class="cta" href="https://plutointero.com/products">
          Explore Our Collection
        </a>
      </div>

      <div class="footer">
        Need assistance? Reach us at
        <a href="mailto:support@plutointero.com">support@plutointero.com</a>
        <br/>
        © ${new Date().getFullYear()} Pluto Intero. Designed for a sustainable future.
      </div>
    </div>
  </body>
  </html>`;
};

export default userRegistrationSuccessEmail;

//  <img src="https://your-logo-url.com/pluto-intero-logo.png" alt="Pluto Intero Logo" />
