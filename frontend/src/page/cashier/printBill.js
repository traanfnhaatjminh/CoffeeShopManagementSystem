import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Roboto from "../../fonts/Roboto_Regular.json"

export  const generatePDF = (cart, selectedTable) => {
    const doc = new jsPDF({
      format: 'a7',
      unit: 'mm',
    });

    // Set courier font for monospace
    doc.addFileToVFS('Roboto.ttf', Roboto);
    doc.addFont('Roboto.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto'); 
  
    doc.setFontSize(8);

    // Header
    doc.text(`B.${selectedTable + 1} [A]`, 10, 10);

    // Staff and timestamp
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
    doc.text(`Nhân viên: Staff`, 10, 25);
    doc.text(`Ngày: ${formattedDate}`, 10, 20);

    // Draw horizontal line
    doc.text('Tên hàng', 8, 15);
    doc.text('SL', 60, 25);
    doc.line(10, 27, 60, 27); // Line under headers

    // Items list
    let yPosition = 32;
    cart.forEach((item, index) => {
      // Main item text
      doc.text(`${index + 1}. ${item.pname}`, 10, yPosition);
      doc.text(item.quantity.toString(), 50, yPosition);

      // Add note if exists (like "No milk fresh")
      if (item.note) {
        yPosition += 4;
        doc.text(item.note, 15, yPosition); // Indented note
      }

      // Draw line after each item
      yPosition += 4;
      doc.line(10, yPosition, 60, yPosition);

      yPosition += 5; // Space for next item
    });

    // Footer
    doc.text('... [2] ...', 25, yPosition + 5);

    doc.save(`hoadon${selectedTable}.pdf`);
  };