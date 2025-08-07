import * as paymentService  from '../services/payment.service';
import {Request, Response} from "express";
import Stripe from 'stripe';
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import {sendEmail} from "../utils/email.util";

const stripe = new Stripe("sk_test_4eC39HqLyjWDarjtT1zdp7dc", {apiVersion: '2020-08-27'});

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, currency,paymentMethod, status , userId, createdAt, email } = req.body;

        // Validate amount and currency
        if (!amount || !currency || !paymentMethod || !status || !userId || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            payment_method_types: [paymentMethod],
        });

        const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
        const paymentId = charges.data.length > 0 ? charges.data[0].id : uuidv4();
        const paymentData = {
            amount,
            currency,
            paymentMethod,
            status,
            transactionId: paymentIntent.id,
            paymentId,
            userId: new mongoose.Types.ObjectId(userId),
            createdAt: createdAt ? new Date(createdAt) : new Date(),
            paymentIntentId: paymentIntent.id,
            email
        };
        await paymentService.savePayment(paymentData);

        await sendEmail(
            email,
            "Payment Confirmation",
            `Your payment of ${amount} ${currency} has been successfully processed. Your transaction ID is ${paymentIntent.id}. Thank you for your business!`
            `<p>Dear Customer,</p><p>Your payment of <strong>${amount} ${currency}</strong>was  successful. Thank you for your ourchase!</p>`
        );

        res.status(200).json({
            message:"Payment saved successfully",
            clientSecret: paymentIntent.client_secret,
            transactionId: paymentIntent.id,
            paymentId,
        });

    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: 'Failed to create payment intent', details: error.message });
    }

};

export const getAllPayments = async (req: Request, res: Response) => {
    try{
        const payments = await paymentService.getAllPayments();
        console.log("Retrieved payments:", payments);
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error retrieving payments:", error);
        res.status(500).json({ error: 'Failed to retrieve payments', details: error.message });
    }
}