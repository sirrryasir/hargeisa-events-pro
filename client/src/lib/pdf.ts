import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (payment: any) => {
  const doc = new jsPDF();

  // Header Branding
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("HARGEISA EVENTS PRO", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("STRICTLY PROFESSIONAL EVENT INFRASTRUCTURE", 105, 30, { align: "center" });

  // Reset text color for body
  doc.setTextColor(0, 0, 0);

  // Invoice Meta
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL RECEIPT", 20, 55);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`ID: ${payment.transactionId}`, 20, 62);
  doc.text(`DATE: ${new Date(payment.paymentDate).toLocaleDateString()}`, 140, 62);

  // Billing Sections
  doc.setDrawColor(230, 230, 230);
  doc.line(20, 70, 190, 70);

  doc.setFont("helvetica", "bold");
  doc.text("BILLING TO:", 20, 80);
  doc.setFont("helvetica", "normal");
  doc.text(payment.clientName.toUpperCase(), 20, 86);

  doc.setFont("helvetica", "bold");
  doc.text("ASSET BOOKED:", 140, 80);
  doc.setFont("helvetica", "normal");
  doc.text(payment.venueName.toUpperCase(), 140, 86);

  // Financial Table
  autoTable(doc, {
    startY: 100,
    margin: { left: 20, right: 20 },
    head: [["SERVICE DESCRIPTION", "STATUS", "AMOUNT (USD)"]],
    body: [
      [payment.type.toUpperCase(), payment.status.toUpperCase(), `$${payment.amount.toFixed(2)}`],
    ],
    styles: {
      fontSize: 9,
      cellPadding: 6,
      font: "helvetica",
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      2: { halign: "right", fontStyle: "bold" },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 120;

  // Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PAID", 140, finalY + 20);
  doc.text(`$${payment.amount.toFixed(2)}`, 190, finalY + 20, { align: "right" });

  // Footer
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, 270, 190, 270);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("This is a system-generated document from Hargeisa Events Pro.", 105, 278, { align: "center" });
  doc.text("Verification Code: " + Math.random().toString(36).substring(7).toUpperCase(), 105, 283, { align: "center" });

  doc.save(`Invoice_${payment.transactionId}.pdf`);
};
