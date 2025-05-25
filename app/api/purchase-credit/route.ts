import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        const { amount, firebaseUid } = await req.json();

        if (!amount || !firebaseUid) {
            return NextResponse.json(
                { error: 'Amount and firebaseUid are required' },
                { status: 400 }
            );
        }

        // Update user credits using atomic operation
        const updatedUser = await prisma.user.update({
            where: { firebaseUid },
            data: {
                credits: {
                    increment: parseFloat(amount)
                }
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