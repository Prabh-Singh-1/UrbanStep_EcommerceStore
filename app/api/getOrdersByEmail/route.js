import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderMail = searchParams.get('email');

  try {
    const Order = await prisma.order.findMany({
      where: { email: orderMail },
    });

    return NextResponse.json(Order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}