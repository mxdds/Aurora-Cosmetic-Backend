export interface PaymentDto{
    id:string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    transactionId: string | null | undefined;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}