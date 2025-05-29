import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        const { amount, firebaseUid } = await req.json();

        // Validate inputs
        if (!amount || !firebaseUid) {
            return NextResponse.json(
                { error: 'Amount and firebaseUid are required' },
                { status: 400 }
            );
        }

        // Convert and validate amount
        const creditAmount = Number(amount);
        if (isNaN(creditAmount)) {
            return NextResponse.json(
                { error: 'Invalid amount value' },
                { status: 400 }
            );
        }

        // Get current credits first
        const currentUser = await prisma.user.findUnique({
            where: { firebaseUid },
            select: { credits: true }
        });

        if (!currentUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate new balance
        const newBalance = currentUser.credits + creditAmount;
        if (newBalance < 0) {
            return NextResponse.json(
                { error: 'Insufficient credits' },
                { status: 400 }
            );
        }

        // Update user credits using exact value
        const updatedUser = await prisma.user.update({
            where: { firebaseUid },
            data: {
                credits: newBalance
            },
            select: {
                credits: true,
                email: true
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedUser
        });

    } catch (error) {
        console.error('Failed to update credits:', error);
        return NextResponse.json(
            { error: 'Failed to update credits' },
            { status: 500 }
        );
    }
}