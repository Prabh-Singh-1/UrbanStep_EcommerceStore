import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const SelectedTitle = searchParams.get('title');

  try {
    const products = await prisma.product.findMany({
      where: SelectedTitle ? { title: SelectedTitle } : {},
      
    });

    const shoes = {}

    for (const item of products) {
      const key = item.title;

      if (!shoes[key]) {
        shoes[key] = {
          ...item,
          color: item.availableQty > 0 ? [item.color] : [],
          size: item.availableQty > 0 ? [item.size] : [],
        };
      } else {
        if (item.availableQty > 0) {
          if (!shoes[key].color.includes(item.color)) {
            shoes[key].color.push(item.color);
          }
          if (!shoes[key].size.includes(item.size)) {
            shoes[key].size.push(item.size);
          }
        }
      }
    }

    return NextResponse.json(shoes, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
