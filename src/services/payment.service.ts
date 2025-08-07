import paymentModel from '../models/payment.model';
import mongoose from 'mongoose';

export const savePayment = async (paymentData: any)=> {
    try{
        console.log("Saving payment data:", paymentData);

        if (mongoose.Types.ObjectId.isValid(paymentData.userId)) {
             paymentData.userId = new mongoose.Types.ObjectId(paymentData.userId);
        } else if (typeof paymentData.userId === 'string' && paymentData.userId.length === 24) {
            paymentData.userId = new mongoose.Types.ObjectId(paymentData.userId);
        } else {
            throw new Error(`Invalid userId format: ${paymentData.userId}`);
        }
        const payment = new paymentModel(paymentData);
        return await payment.save();

    } catch (error) {
        console.error("Error saving payment:", error);
        throw error;
    }
};
export const getAllPayments = async () => {
    try {
        const payments = await paymentModel.find().populate('userId', 'name email').lean();
        return payments.map(payment => ({
            ...payment,
            createdAt: payment.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
        }
    }
}