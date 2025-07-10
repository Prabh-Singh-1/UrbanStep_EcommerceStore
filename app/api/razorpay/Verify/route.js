import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      order_id,
      products,
      name,
      email,
      phone,
      address
    } = body;
    console.log('products: ', products);
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !order_id ||
      !products ||
      !name ||
      !email ||
      !address ||
      !amount
    ) {
      console.log('Missing required fields');


      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
    }

    const secret = process.env.KEY_SECRET;

    if (!secret) {
      return new Response(JSON.stringify({ success: false, error: 'Server config error: Missing KEY_SECRET' }), { status: 500 });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {

      return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), { status: 400 });
    }

    console.log("Creating order with data:", {
      name,
      email,
      phone,
      orderid: order_id,
      products,
      address,
      amount,
      status: 'paid',
    });

    const newOrder = await prisma.order.create({
      data: {
        name,
        email,
        phone: phone,
        orderid: order_id,
        products,
        address,
        amount,
        status: 'paid',
      },
    });



    // update AvalaibleQty of products
    for (const itemCode in products) {
      const { qty } = products[itemCode];

      const product = await prisma.product.findUnique({
        where: { slug: itemCode },
      });

      if (!product) {
        console.log('Product not found:', itemCode);
        return new Response(JSON.stringify({
          success: false,
          error: `Product with slug ${itemCode} not found`
        }), { status: 404 });
      }

      if (product.availableQty < qty) {
        console.log(`Insufficient stock for ${product.name} (${product.size}, ${product.variant})`);
        return new Response(JSON.stringify({
          success: false,
          error: `Insufficient stock for ${product.name} (${product.size}, ${product.variant}), Only ${product.availableQty} available`
        }), { status: 409 });
      }

      await prisma.product.update({
        where: { slug: itemCode },
        data: {
          availableqty: {
            decrement: qty,
          },
        },
      });
    }

    return new Response(JSON.stringify({ success: true, order: newOrder }), { status: 200 });
  } catch (error) {
    console.error('[RAZORPAY VERIFY ERROR]', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
  }
}
