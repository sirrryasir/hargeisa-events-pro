import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (payment: any) => {
  const doc = jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.text("HARGEISA EVENTS PRO", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("STRICTLY PROFESSIONAL EVENT SOLUTIONS", 105, 28, { align: "center" });
  
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Invoice Details
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 20, 50);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Invoice No: ${payment.transactionId}`, 20, 60);
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 20, 65);
  doc.text(`Status: ${payment.status.toUpperCase()}`, 20, 70);
  
  // Bill To
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 130, 50);
  doc.setFont("helvetica", "normal");
  doc.text(payment.clientName, 130, 60);
  doc.text("Hargeisa, Somaliland", 130, 65);
  
  // Item Table
  autoTable(doc, {
    startY: 85,
    head: [["Description", "Venue/Service", "Amount"]],
    body: [
      [payment.type, payment.venueName, `$${payment.amount}`]
    ],
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 80 }
  });
  
  // Footer
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL PAID: $${payment.amount}`, 190, finalY, { align: "right" });
  
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Thank you for choosing Hargeisa Events Pro.", 105, 280, { align: "center" });
  doc.text("This is a computer-generated document and does not require a physical signature.", 105, 285, { align: "center" });
  
  doc.save(`Invoice_${payment.transactionId}.pdf`);
};
