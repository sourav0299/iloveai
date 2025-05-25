import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const firebaseUid = searchParams.get('firebaseUid')

  if (!firebaseUid) {
    return NextResponse.json({ error: 'Firebase UID is required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid }
  })

  return NextResponse.json(user)
}

export async function POST(request: Request) {
  const data = await request.json()

  const user = await prisma.user.create({
    data: {
      ...data,
      credits: 25
    }
  })

  return NextResponse.json(user)
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url)
  const firebaseUid = searchParams.get('firebaseUid')

  if (!firebaseUid) {
    return NextResponse.json({ error: 'Firebase UID is required' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { firebaseUid },
    data: { lastLoginAt: new Date() }
  })

  return NextResponse.json(user)
}