import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateRentalPdf = (rental: any, filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(25).text('Rental Agreement', { align: 'center' });
      doc.moveDown();
      
      // Info
      doc.fontSize(14).text(`Order ID: R-${rental.id.toString().padStart(4, '0')}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Customer
      doc.font('Helvetica-Bold').fontSize(16).text('Customer Details', { underline: true });
      doc.font('Helvetica').fontSize(12).text(`Name: ${rental.user.name}`);
      if (rental.user.phone) doc.text(`Phone: ${rental.user.phone}`);
      doc.moveDown();

      // Item
      doc.font('Helvetica-Bold').fontSize(16).text('Rental Details', { underline: true });
      doc.font('Helvetica').fontSize(12).text(`Item: ${rental.item.name}`);
      doc.text(`Period: ${new Date(rental.startDate).toLocaleDateString()} to ${new Date(rental.endDate).toLocaleDateString()}`);
      doc.text(`Delivery Type: ${rental.deliveryType === 'PICKUP' ? 'Pickup' : 'Delivery'}`);
      if (rental.deliveryAddress) doc.text(`Address: ${rental.deliveryAddress}`);
      doc.moveDown();

      // Financials
      doc.font('Helvetica-Bold').fontSize(16).text('Financials', { underline: true });
      doc.font('Helvetica').fontSize(12).text(`Base Price: $${rental.item.pricePerDay} / day`);
      if (rental.deliveryFee > 0) doc.text(`Delivery Fee: $${rental.deliveryFee}`);
      doc.text(`Deposit: $${rental.item.deposit}`);
      doc.font('Helvetica-Bold').fontSize(14).text(`Total Paid (excl. deposit): $${rental.totalPrice}`);
      doc.font('Helvetica'); // reset to normal font
      doc.moveDown();

      // Signatures
      doc.moveDown(2);
      doc.fontSize(12).text('Manager Signature: __________________     Client Signature: __________________');

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};
