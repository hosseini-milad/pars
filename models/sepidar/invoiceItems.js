const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
    InvoiceID: { type: Number, required: true, unique: true },
    OrderRef: { type: String },
    QuotationRef: { type: String },
    Number: { type: Number },
    Date: { type: Date },
    CustomerRef: { type: Number },
    CurrencyRef: { type: Number },
    Rate: { type: Number },
    SaleTypeRef: { type: Number },
    AddressRef: { type: String },
    Price: { type: Number },
    Tax: { type: Number },
    Duty: { type: Number },
    Discount: { type: Number },
    Addition: { type: Number },
    NetPrice: { type: Number },
    Agreements: { type: String },
    InvoiceItems: [
        {
            InvoiceItemID: { type: Number, required: true },
            ItemRef: { type: Number, required: true },
            TracingRef: { type: String },
            TracingTitle: { type: String },
            Quantity: { type: Number },
            SecondaryQuantity: { type: Number },
            Fee: { type: Number },
            Price: { type: Number },
            Discount: { type: Number },
            Tax: { type: Number },
            Duty: { type: Number },
            Addition: { type: Number },
            NetPrice: { type: Number },
            DiscountInvoiceItemRef: { type: String },
            ProductPackRef: { type: String },
            ProductPackQuantity: { type: Number },
            Description: { type: String },
            IsAggregateDiscountInvoiceItem: { type: Boolean },
            SaleGroupRef: { type: Number },
            PurchaseGroupRef: { type: Number },
            // InvoiceID: { type: Number, required: true }
        }
    ]
});


const InvoiceItem = mongoose.model('InvoiceItem', InvoiceItemSchema);

module.exports = InvoiceItem;
