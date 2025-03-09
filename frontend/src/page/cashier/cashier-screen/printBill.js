// Import required libraries
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../../fonts/Roboto-Regular-normal';

export const generatePDF = (cart, selectedTable, note) => {
  // Create PDF document
  const doc = new jsPDF({
    format: 'a7',
    unit: 'mm',
    orientation: 'portrait',
  });
  const FONT_REGULAR = 'Roboto-Regular';

  // Thiết lập font size ban đầu
  doc.setFontSize(10);

  // Thông tin ngày giờ hiện tại
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;

  // Header hóa đơn
  doc.setFontSize(12);
  doc.setFont(FONT_REGULAR);
  doc.text(`B.${selectedTable + 1} [A]`, 10, 10);
  doc.setFont(FONT_REGULAR);
  doc.text(`Ngày: ${formattedDate}`, 10, 15);
  doc.text(`Nhân viên: Staff`, 10, 20);

  // Tiêu đề cột
  doc.setFontSize(10);
  doc.setFont(FONT_REGULAR);
  doc.text('Tên hàng', 10, 25);
  doc.text('SL', 50, 25);
  doc.line(10, 27, 60, 27); // Đường kẻ phân cách

  // Danh sách sản phẩm
  let yPosition = 32;

  cart.forEach((item, index) => {
    // Tên sản phẩm và số lượng
    doc.setFont(FONT_REGULAR);
    doc.text(`${index + 1}. ${item.pname}`, 10, yPosition);
    doc.text(item.quantity.toString(), 50, yPosition);

    // Ghi chú (nếu có)

    // Đường kẻ phân cách giữa các mục
    yPosition += 4;
    doc.line(10, yPosition, 60, yPosition);

    yPosition += 5;
  });
  if (note) {
    yPosition += 4;
    doc.setFont(FONT_REGULAR);
    doc.text(`Ghi chú: ${note}`, 15, yPosition);
  }
  // Footer
  doc.setFont(FONT_REGULAR);
  doc.text('... [2] ...', 25, yPosition + 5);

  // Lưu file PDF
  doc.save(`hoadon${selectedTable}.pdf`);

  // Trả về đối tượng PDF (nếu cần)
  return doc;
};

// Alternative function if you only have one font variant available
export const generatePDFWithSingleFont = (cart, selectedTable) => {
  // Create PDF document
  const doc = new jsPDF({
    format: 'a7',
    unit: 'mm',
    orientation: 'portrait',
  });

  // Import and register the font
  // This assumes you've already imported the font file elsewhere in your code
  // If not, you would need the full font registration code here

  // Set font to Roboto
  doc.setFont('Roboto-Regular');

  // Thiết lập font size ban đầu
  doc.setFontSize(10);

  // Thông tin ngày giờ hiện tại
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;

  // Header hóa đơn - Simulate bold by using larger font size
  doc.setFontSize(12);
  const titleText = `B.${selectedTable + 1} [A]`;
  doc.text(titleText, 10, 10);
  doc.text(titleText, 10.1, 10); // Draw again with slight offset to create bold effect

  doc.setFontSize(10);
  doc.text(`Ngày: ${formattedDate}`, 10, 15);
  doc.text(`Nhân viên: Staff`, 10, 20);

  // Tiêu đề cột - Simulate bold
  const headingSize = 10;
  doc.setFontSize(headingSize);
  const heading1 = 'Tên hàng';
  const heading2 = 'SL';
  doc.text(heading1, 10, 25);
  doc.text(heading1, 10.1, 25);
  doc.text(heading2, 50, 25);
  doc.text(heading2, 50.1, 25);
  doc.line(10, 27, 60, 27); // Đường kẻ phân cách

  // Danh sách sản phẩm
  let yPosition = 32;

  cart.forEach((item, index) => {
    // Tên sản phẩm và số lượng
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${item.pname}`, 10, yPosition);
    doc.text(item.quantity.toString(), 50, yPosition);

    // Ghi chú (nếu có) - Simulate italic by using a slight slant
    if (item.note) {
      yPosition += 4;
      // To simulate italic, we can use the transform methods
      doc.saveGraphicsState();
      doc.setTextMatrix(1, 0.2, 0, 1, 15, yPosition);
      doc.text(`Ghi chú: ${item.note}`, 0, 0);
      doc.restoreGraphicsState();
    }

    // Đường kẻ phân cách giữa các mục
    yPosition += 4;
    doc.line(10, yPosition, 60, yPosition);

    yPosition += 5;
  });

  // Footer - Simulate bold
  const footerText = '... [2] ...';
  doc.text(footerText, 25, yPosition + 5);
  doc.text(footerText, 25.1, yPosition + 5);

  // Lưu file PDF
  doc.save(`hoadon${selectedTable}.pdf`);

  // Trả về đối tượng PDF (nếu cần)
  return doc;
};

// Example of what a font registration file (roboto-regular.js) might contain:
/*
(function(jsPDFAPI) {
  var font = 'BASE64_ENCODED_FONT_DATA_HERE';
  
  var callAddFont = function() {
    this.addFileToVFS('Roboto-Regular-normal.ttf', font);
    this.addFont('Roboto-Regular-normal.ttf', 'Roboto-Regular', 'normal');
  };
  
  jsPDFAPI.events.push(['addFonts', callAddFont]);
})(jsPDF.API);
*/
