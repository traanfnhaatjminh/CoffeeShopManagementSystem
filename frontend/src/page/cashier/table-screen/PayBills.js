import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../../fonts/Roboto-Regular-normal';
import { getPaymentMethod, formatDiscount } from '../bill-screen/billUtils';

export const generatePDF = (updatedBill, cashReal) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 150],
  });

  const FONT_REGULAR = 'Roboto-Regular';

  const centerText = (text, y, size = 10) => {
    doc.setFontSize(size);
    const textWidth = (doc.getStringUnitWidth(text) * size) / doc.internal.scaleFactor;
    const x = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(text, x, y);
  };

  const dateNow = new Date(updatedBill.created_time).toLocaleDateString();

  doc.setFontSize(12);
  doc.setFont(FONT_REGULAR);
  centerText('HOÁ ĐƠN THANH TOÁN', 10);

  doc.setFontSize(10);
  centerText(`Số hóa đơn: ${updatedBill._id}`, 15);

  doc.setFont(FONT_REGULAR);
  centerText(`Ngày: ${dateNow}`, 20);
  doc.setFontSize(9);
  const createdTime = new Date(updatedBill.created_time).toLocaleTimeString();
  const updatedTime = new Date(updatedBill.updated_time).toLocaleTimeString();
  centerText(`Giờ vào: ${createdTime}  Giờ ra: ${updatedTime}`, 24, 9);

  doc.text(`Bàn: ${updatedBill.table_id}`, 10, 30);
  doc.text('Khách hàng: Khách lẻ', 10, 35);
  doc.text('Thu ngân:', 10, 40);

  doc.setLineWidth(0.1);
  doc.line(10, 45, 70, 45);

  doc.setFontSize(9);
  doc.setFont(FONT_REGULAR);
  doc.text('Tên hàng', 10, 49);
  doc.text('Đ.giá', 40, 49);
  doc.text('SL', 55, 49);
  doc.text('TT', 65, 49);

  doc.line(10, 50, 70, 50);

  let y = 54;
  let total = updatedBill.total_cost || 0;

  if (updatedBill?.product_list?.length) {
    updatedBill.product_list.forEach((item) => {
      const maxWidth = 28;
      const splitName = doc.splitTextToSize(item.nameP, maxWidth);

      splitName.forEach((line, index) => {
        doc.text(line, 10, y + index * 5);
      });

      doc.text(item.priceP.toLocaleString(), 40, y);
      doc.text(item.quantityP.toString(), 55, y);
      doc.text(item.total.toLocaleString(), 65, y);

      y += splitName.length * 5;
    });
  } else {
    doc.text('Lỗi hóa đơn!', 20, y);
  }

  doc.line(10, y, 70, y);
  y += 5;

  doc.text('Tổng thành tiền:', 10, y);
  doc.text(total.toLocaleString(), 40, y);
  y += 5;

  // ✅ Tính chiết khấu nếu > 0
  const discountAmount = updatedBill.discount > 0 ? (total * updatedBill.discount) / 100 : 0;
  if (updatedBill.discount > 0) {
    doc.text(`Chiết khấu (${updatedBill.discount}%)`, 10, y);
    doc.text(`-${discountAmount.toLocaleString()}`, 40, y);
    y += 5;
  }
  doc.text(`Chiết khấu (${updatedBill.discount || 0}%)`, 10, y);
  doc.text(`(${updatedBill.discount || 0})`, 40, y);
  // ✅ Tính tổng cộng sau khi giảm giá
  const finalTotal = total - discountAmount;
  doc.text('Tổng cộng:', 10, y);
  doc.text(finalTotal.toLocaleString(), 40, y);
  y += 5;

  if (updatedBill.payment === 'cash') {
    doc.text('Tiền khách trả:', 10, y);
    doc.text(cashReal.toLocaleString(), 40, y);
    y += 5;

    const change = cashReal - finalTotal;
    doc.text('Tiền thừa:', 10, y);
    doc.text(change.toLocaleString(), 40, y);
    y += 5;
  }

  doc.text('Thanh toán:', 10, y);
  doc.text(getPaymentMethod(updatedBill.payment), 40, y);
  y += 5;

  doc.line(10, y, 70, y);
  y += 5;

  doc.setFontSize(8);
  centerText('Xin cảm ơn, hẹn gặp lại quý khách!', y, 8);

  doc.save(`Hóa Đơn ${updatedBill.table_id || '1'}`);

  return doc;
};
