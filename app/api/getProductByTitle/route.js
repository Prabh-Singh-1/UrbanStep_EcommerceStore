import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title'); 

  try {
    const productVariants = await prisma.product.findMany({
      where: { title },
    });

    return NextResponse.json(productVariants, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}