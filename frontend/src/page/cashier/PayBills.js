import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Roboto from "../../fonts/Roboto_Regular.json"

export const generatePDF = (selectBill, paymentMethod, selectedTable, discount, totalCost) => {
  // Tạo tài liệu PDF với kích thước phù hợp với hóa đơn nhỏ
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 150] // Kích thước phù hợp với hóa đơn nhỏ
  });

  // Thiết lập font
  doc.addFileToVFS('Roboto.ttf', Roboto);
    doc.addFont('Roboto.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto'); 
  
  // Hàm căn giữa text
  const centerText = (text, y, size = 10) => {
    doc.setFontSize(size);
    const textWidth = doc.getStringUnitWidth(text) * size / doc.internal.scaleFactor;
    const x = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Tạo số hóa đơn 
  const currentDate = new Date();
  

  // Tạo ngày và thời gian
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
 
  

  // Header - Tiêu đề in đậm
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  centerText('HOÁ ĐƠN THANH TOÁN', 10);
  
  // Số hóa đơn
  doc.setFontSize(10);
  centerText(`Số: ${selectBill._id}`, 15);
  
  // Thông tin ngày/giờ
  doc.setFont('helvetica', 'normal');
  centerText(`Ngày: ${formattedDate}`, 20);
  doc.setFontSize(9);
  const timeText = `Giờ vào: ${selectBill.created_time.toLocaleString()} Giờ ra: ${selectBill.updated_time.toLocaleString()}`;
  centerText(timeText, 24, 9);

  // Thông tin bàn và khách hàng
  doc.text(`Bàn:${selectedTable.table_name }`, 10, 30);
  doc.text('Khách hàng: Khách lẻ', 10, 35);
  doc.text('Thu ngân:', 10, 40);

  // Vẽ đường kẻ ngang
  doc.setLineWidth(0.1);
  doc.line(10, 45, 70, 45);

  // Header cột
  doc.setFontSize(9);
  doc.text('Tên hàng', 10, 49);
  doc.text('Đ.giá', 45, 49);
  doc.text('SL', 55, 49);
  doc.text('TT', 65, 49);

  // Vẽ đường kẻ dưới header
  doc.line(10, 50, 70, 50);

  // Danh sách sản phẩm
  let y = 54;
  let total = selectBill.total_cost || 0;
  
  if (selectBill && selectBill.product_list && Array.isArray(selectBill.product_list)) {
    selectBill.product_list.forEach((item) => {
      doc.text(item.nameP, 10, y);
      doc.text(item.priceP.toLocaleString(), 45, y);
      doc.text(item.quantityP.toString(), 55, y);
      doc.text(item.total.toLocaleString(), 65, y);
      
      y += 5;
    });
  } else {
    // Mẫu dữ liệu nếu không có product_list
    doc.text('Trà đào cam sả', 10, y);
    doc.text('28,000', 45, y);
    doc.text('1', 55, y);
    doc.text('28,000', 65, y);
    total = 28000;
    y += 5;
  }

  // Vẽ đường kẻ sau danh sách
  doc.line(10, y, 70, y);
  y += 5;

  // Tổng tiền
  doc.text('Tổng thành tiền', 10, y);
  doc.text(total.toLocaleString(), 65, y);
  y += 5;

  // Chiết khấu (nếu có)
  if (discount && discount > 0) {
    doc.text(`Chiết khấu (${discount}%)`, 10, y);
    const discountAmount = (total * discount) / 100;
    doc.text(discountAmount.toLocaleString(), 65, y);
    y += 5;
    
    // Tổng sau chiết khấu
    total = total - discountAmount;
  }

  doc.text('Tổng cộng', 10, y);
  doc.text(total.toLocaleString(), 65, y);
  y += 5;
  
  // Tiền khách trả
  const amountPaid = 100000;
  doc.text('Tiền khách trả', 10, y);
  doc.text(amountPaid.toLocaleString(), 65, y);
  y += 5;

  // Tiền thừa
  const change = amountPaid - total;
  doc.text('Tiền thừa', 10, y);
  doc.text(change.toLocaleString(), 65, y);
  y += 5;

  // Phương thức thanh toán
  doc.text('Thanh toán', 10, y);
  doc.text(paymentMethod || 'Tiền mặt', 65, y);
  y += 5;

  // Vẽ đường kẻ cuối
  doc.line(10, y, 70, y);
  y += 5;

  // Lời cảm ơn
  doc.setFontSize(8);
  centerText('Xin cảm ơn, hẹn gặp lại quý khách!', y, 8);

  // Lưu file PDF
  doc.save(`hoadon_${selectedTable.table_name || '1'}.pdf`);
  
  return doc;
};