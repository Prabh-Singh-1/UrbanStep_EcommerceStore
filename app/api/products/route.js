
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  const products = await prisma.product.findMany({
    where: category ? { category } : {},
  })

  const shoes = {}

  for (const item of products) {
    if (!shoes[item.title]) {
      // Initialize new product entry
      shoes[item.title] = {
        ...item,
        color: item.availableQty > 0 ? [item.color] : [],
        size: item.availableQty > 0 ? [item.size] : [],
      }
    } else {
      // Add unique color/size if available
      if (item.availableQty > 0) {
        if (!shoes[item.title].color.includes(item.color)) {
          shoes[item.title].color.push(item.color)
        }
        if (!shoes[item.title].size.includes(item.size)) {
          shoes[item.title].size.push(item.size)
        }
      }
    }
  }




  return NextResponse.json(shoes, { status: 200 })

}

export async function POST(req) {
  const body = await req.json()
  try {
    if (Array.isArray(body)) {
      const created = await prisma.product.createMany({
        data: body,
        skipDuplicates: true,
      })
      return NextResponse.json(
        { message: `${created.count} products created.` },
        { status: 201 }
      )
    }
    const newProduct = await prisma.product.create({

      data: {
        title: body.title,
        slug: body.slug,
        desc: body.desc,
        img: body.img,
        category: body.category,
        size: body.size,
        color: body.color,
        price: body.price,
        availableQty: body.availableQty,
      },
    })
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json()


    if (!Array.isArray(body)) {
      const { id, ...data } = body

      if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
      }

      const updated = await prisma.product.update({
        where: { id: parseInt(id) },
        data,
      })

      return NextResponse.json(updated, { status: 200 })
    }

    for (let i = 0; i < body.length; i++) {
      const product = body[i]

      if (!product.id) {
        return NextResponse.json(
          { error: 'Each product must have an ID' },
          { status: 400 }
        )
      }

      await prisma.product.update({
        where: { id: Number(product.id) },
        data: {
          ...(product.title && { title: product.title }),
          ...(product.slug && { slug: product.slug }),
          ...(product.desc && { desc: product.desc }),
          ...(product.img && { img: product.img }),
          ...(product.category && { category: product.category }),
          ...(product.size && { size: product.size }),
          ...(product.color && { color: product.color }),
          ...(product.price && { price: product.price }),
          ...(product.availableQty && { availableQty: product.availableQty }),
        },
      })
    }

    return NextResponse.json(
      { message: 'Products updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating product(s):', error)
    return NextResponse.json(
      { error: 'Failed to update product(s)' },
      { status: 500 }
    )
  }
}
