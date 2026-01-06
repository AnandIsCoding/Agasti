import PDFDocument from "pdfkit";

/**
 * Generate modern invoice PDF buffer
 * @returns {Promise<Buffer>}
 */
const generateInvoiceBuffer = ({ order, user }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* ================= PAYMENT DATA (NO GUESSING) ================= */
      const paymentMethod = order.paymentMethod || "Online Payment";
      const paymentStatus = order.paymentStatus || "Paid";
      const isCOD = paymentMethod === "Cash on Delivery";

      /* ================= HEADER ================= */
      doc.fontSize(22).font("Helvetica-Bold").text("Pluto Intero");

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Premium Furniture & Home Decor")
        .moveDown(1.5);

      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("INVOICE", { align: "right" });
      doc.moveDown();

      /* ================= META ================= */
      const invoiceTop = doc.y;

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Invoice ID: ${order._id}`, 50, invoiceTop)
        .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`)
        .text(`Payment Method: ${paymentMethod}`)
        .text(`Payment Status: ${paymentStatus}`);

      doc
        .font("Helvetica-Bold")
        .text("Bill To:", 350, invoiceTop)
        .font("Helvetica")
        .text(user.name || "Customer")
        .text(user.email || "");

      doc.moveDown(2);

      /* ================= TABLE HEADER ================= */
      const tableTop = doc.y;

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("#", 50, tableTop)
        .text("Product", 80, tableTop)
        .text("Qty", 350, tableTop)
        .text("Price", 400, tableTop)
        .text("Total", 470, tableTop);

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      /* ================= TABLE ROWS ================= */
      doc.font("Helvetica").fontSize(10);

      let y = doc.y + 5;

      order.products.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;

        doc
          .text(index + 1, 50, y)
          .text(
            item.name || item.title || item.product?.name || "Product",
            80,
            y,
            { width: 250 },
          )
          .text(item.quantity, 360, y)
          .text(`Rs. ${item.price}`, 400, y)
          .text(`Rs. ${itemTotal}`, 470, y);

        y += 20;
      });

      doc.moveDown(2);
      doc.moveTo(50, y).lineTo(550, y).stroke();

      /* ================= TOTAL ================= */
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Total Amount", 350, y + 15)
        .text(`Rs. ${order.totalAmount}`, 470, y + 15);

      if (isCOD) {
        doc
          .moveDown(1)
          .fontSize(10)
          .font("Helvetica-Bold")
          .text("Amount Due:", 350)
          .text(`Rs. ${order.totalAmount}`, 470);
      }

      /* ================= FOOTER ================= */
      doc.moveDown(4);

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("gray")
        .text(
          isCOD
            ? "Note: Payment will be collected at the time of delivery."
            : "This is a system-generated invoice and does not require a signature.",
          { align: "center" },
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoiceBuffer;
