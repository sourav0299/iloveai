import { NextResponse } from 'next/server';
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

interface OrderRequest {
    amount: number;
}

export async function POST(request: Request){
    try{
        const { amount } = await request.json() as OrderRequest;

        const amountInPaise = Math.round(Number(amount));

        const order = await razorpay.orders.create({
            amount: amountInPaise*100,
            currency: 'INR',
            receipt: `ORDER_${Date.now()}`
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    }catch(error){
        console.error('Razorpay order creation failed', error);
        return NextResponse.json(
            {error: 'Failed to create payment order'},
            { status: 500}
        )
    }
}