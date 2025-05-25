import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { amount, userId } = await req.json();
        
        const transaction = await prisma.transaction.create({
            data: {
                amount: parseFloat(amount),
                status: 'pending',
                userId,
            },
        });

        return NextResponse.json({ success: true, transaction });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        );
    }
}