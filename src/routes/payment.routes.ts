import { Router } from 'express';
import {authorizeRoles} from "../middleware/auth.middleware";
import {getAllPayments,createPaymentIntent} from "../controller/payment.controller";

const paymentRouter: Router = Router();

paymentRouter.get("/all", authorizeRoles("admin"), getAllPayments); // Get all payments, accessible by admin
paymentRouter.post("/create-payment-intent", authorizeRoles('customer'),createPaymentIntent;

export default paymentRouter// Create a payment intent