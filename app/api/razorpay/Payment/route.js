import Razorpay from 'razorpay';


export async function POST(request) {
  const body = await request.json();

  const { allProducts } = body;

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  const options = {
    amount: body.amount * 100, // amount in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
    notes: {
    products: JSON.stringify(body.allProducts), 
    customOrderId: body.order_id,             
   }
  };

  try {

    const order = await razorpay.orders.create(options);
    console.log('Order created:', order);
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Razorpay error' }), { status: 500 });
  }
}
