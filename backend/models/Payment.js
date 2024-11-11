const paymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    transactionAmount: {
        type: Number,
        required: true,
        min: 0 // Ensures amount cannot be negative
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'upi'], // Example methods; customize as needed
        required: true
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paidFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } // Automates creation and update timestamps
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
