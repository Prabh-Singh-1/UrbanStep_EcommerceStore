import { NextResponse } from "next/server";
import  prisma  from '@/lib/prisma'

export async function GET() {
  const orders = await prisma.order.findMany()
  return NextResponse.json(orders)
}

export async function POST(req) {
    const body = await req.json();
    const newOrder = await prisma.order.create({
        data: {
            userId: body.userId,
            products: body.products,
            address: body.address,
            amount: body.amount,
            status: body.status || 'pending',
        },
    });
    return NextResponse.json(newOrder);
}