const orderSuccessEmail = ({
  name,
  orderId,
  amount,
  invoiceUrl,
  paymentMethod = "Cash on Delivery",
}) => {
  const isCOD = paymentMethod === "Cash on Delivery";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed - Pluto Intero</title>

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

    .title {
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 20px;
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

    .order-box {
      margin-top: 25px;
      padding: 20px;
      background: #f7f9f7;
      border-left: 4px solid #2f6f5e;
      border-radius: 8px;
    }

    .cta {
      display: inline-block;
      margin-top: 30px;
      color: #000;
      background: #ffffff;
      border: 2px solid #000;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
    }

    .invoice-btn {
      display: inline-block;
      margin-top: 15px;
      color: #1A2228;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
    }

    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 13px;
      color: #888;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="title">🎉 Order Confirmed!</div>

    <div class="content">
      <p>Hi <span class="highlight">${name}</span>,</p>

      <p>
        Thank you for shopping with <strong>Pluto Intero</strong>.
        Your order has been placed successfully and is now being processed.
      </p>

      <div class="order-box">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Amount:</strong> ₹${amount}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${
          isCOD ? "Pay on Delivery" : "Paid"
        }</p>
      </div>

      ${
        isCOD
          ? `<p><strong>Note:</strong> Please keep the exact amount ready. Payment will be collected at the time of delivery.</p>`
          : ""
      }

      <p>You can download your invoice using the button below.</p>

      <a
        href="${invoiceUrl}"
        class="invoice-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Invoice (PDF)
      </a>

      <br/>

      <a class="cta" href="https://plutointero.com/profile">
        View My Orders
      </a>
    </div>

    <div class="footer">
      Need help? Contact
      <a href="mailto:support@plutointero.com">support@plutointero.com</a>
      <br/>
      © ${new Date().getFullYear()} Pluto Intero
    </div>
  </div>
</body>
</html>`;
};

export default orderSuccessEmail;
