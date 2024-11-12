const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    InvoiceID: { type: Number, required: true },
    OrderRef: { type: Number, default: null },
    QuotationRef: { type: Number, default: null },
    Number: { type: Number, required: true },
    Date: { type: Date, required: true },
    CustomerRef: { type: Number, required: true },
    CurrencyRef: { type: Number, required: true },
    Rate: { type: Number, required: true },
    SaleTypeRef: { type: Number, required: true },
    AddressRef: { type: Number, default: null },
    Price: { type: Number, required: true },
    Tax: { type: Number, required: true },
    Duty: { type: Number, default: 0 },
    Discount: { type: Number, default: 0 },
    Addition: { type: Number, default: 0 },
    NetPrice: { type: Number, required: true },
    Agreements: { type: String, default: null },
    InvoiceItems: { type: Array, default: [] },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
