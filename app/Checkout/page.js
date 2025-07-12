'use client'
import { useEffect, useContext, useState } from 'react'
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { FaShoppingBag } from "react-icons/fa";
import { CartContext } from '../cartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';


const Checkout = () => {

  const { data: session } = useSession();
  const { userCred } = useContext(CartContext);
  const { cart, setcart } = useContext(CartContext);
  const { cartDot, setcartDot } = useContext(CartContext);
  const { subtotal, setsubtotal, setcartClick } = useContext(CartContext);
  const [isDeliveryBtnClicked, setisDeliveryBtnClicked] = useState(false)
  const [orderPhone, setorderPhone] = useState("")
  const router = useRouter();
  const [fullAddress, setfullAddress] = useState("")

  useEffect(() => {
    try {
      if (localStorage.getItem('cart')) {
        setcart(JSON.parse(localStorage.getItem('cart')));
      }
    } catch (e) {
      console.log(e);
    }

    // Inject Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [setcart]);

  const saveCart = (mycart, cartDot, subtot) => {
    localStorage.setItem('cart', JSON.stringify(mycart));
    localStorage.setItem('cartDot', JSON.stringify(cartDot));
    localStorage.setItem("subTotal", JSON.stringify(subtot))
  };

  const addTocart = (itemCode, qty, price, name, size, variant) => {
    let myCart = { ...cart };

    const numericQty = parseInt(qty);
    const numericPrice = parseFloat(price);

    if (
      itemCode in myCart &&
      myCart[itemCode].size === size &&
      myCart[itemCode].variant === variant &&
      myCart[itemCode].name === name &&
      myCart[itemCode].unitPrice === numericPrice
    ) {
      myCart[itemCode].qty += numericQty;
      myCart[itemCode].price = myCart[itemCode].unitPrice * myCart[itemCode].qty;
    } else {
      const newItemCode = uuidv4(); 
      myCart[newItemCode] = {
        qty: numericQty,
        unitPrice: numericPrice,
        price: numericPrice * numericQty,
        name,
        size,
        variant,
      };
    }

    const updatedSubtotal = subtotal + numericPrice * numericQty;
    const updatedCartDot = cartDot + numericQty;

    setsubtotal(updatedSubtotal);
    setcartDot(updatedCartDot);
    setcart(myCart);
    saveCart(myCart, updatedCartDot, updatedSubtotal);
    setcartClick(true);
  };


  const removeFromCart = (itemCode, qty) => {
    let myCart = { ...cart };
    const numericQty = parseInt(qty);

    if (itemCode in myCart) {
      const unitPrice = myCart[itemCode].unitPrice;

      myCart[itemCode].qty -= numericQty;
      const updatedQty = myCart[itemCode].qty;

      if (updatedQty <= 0) {
        delete myCart[itemCode];
      } else {
        myCart[itemCode].price = unitPrice * updatedQty;
      }

      const newCartDot = cartDot - numericQty;
      setcartDot(newCartDot >= 0 ? newCartDot : 0);

      let newSubtotal = 0;
      Object.keys(myCart).forEach(key => {
        newSubtotal += myCart[key].unitPrice * myCart[key].qty;
      });
      setsubtotal(newSubtotal);

      setcart(myCart);
      saveCart(myCart);
    }
  };

  const clearCart = () => {
    setcart({});
    setcartDot(0);
    setsubtotal(0);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartDot');
    localStorage.removeItem('subTotal');

  }

  const handleSaveDeliveryDetails = (event) => {
    event.preventDefault();
    const houseAddress = document.getElementById('houseAddress').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const pincode = document.getElementById('pincode').value.trim();

    const fulladdress = `${houseAddress}, ${city}, ${state} - ${pincode}`;
    setfullAddress(fulladdress);
    console.log("Full Address:", fullAddress);
    localStorage.setItem("deliveryAddress", fullAddress);
    toast.success('Delivery details saved!', {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setisDeliveryBtnClicked(true);
    setorderPhone(document.getElementById('phone').value.trim());
  };

  const initiatePayment = async () => {
    if (subtotal <= 0) {
      toast.warn('Your Cart is empty or subtotal is 0! so easy!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",

      });
      return;
    }

    if (!isDeliveryBtnClicked) {
      toast.warn('Please save your delivery details first!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const orderId = Math.floor(Math.random() * 1000000000).toString();
    const response = await fetch("/api/razorpay/Payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: subtotal,
        order_id: orderId,
        allProducts: cart,
      }),
    });

    const data = await response.json();
    
    if(response.status === 409) {
      toast.error('Ordered Product is currently out of Stock!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",

      });
    }

    if (!data.id) {
      toast.error('Unable to create Razorpay order. Try again!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",

      });

      return;
    }
    console.log('Razorpay order data: ', data);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      name: "Urban Step",
      description: "Test Transaction",
      order_id: data.id,
      products: data.notes.products,

      handler: async function (response) {

        //Confirming Payments
        try {
          const verifyRes = await fetch("/api/razorpay/Verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: subtotal,
              currency: "INR",
              shopName: "Urban Step",
              description: "Test Transaction",
              order_id: orderId,
              products: cart,
              name: session ? session.user.name : userCred.name,
              email: session ? session.user.email : userCred.email,
              phone: orderPhone,
              address: fullAddress,
            }),
          });

          const data = await verifyRes.json();
          if (verifyRes.status === 409) {
            toast.error(`${data.error}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",

            });
            return
          }
          if (data.success) {
            toast.success('Payment Successful!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",

            });
            clearCart();
            setTimeout(() => {
              router.push('/Order?orderId=' + orderId);
            }, 1000);
          } else {
            clearCart();
            toast.error('❌ Payment verification failed!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",

            });
            redirect('/')
          }
        } catch (err) {
          console.error("Verification error:", err);
          toast.error('❌ Something went wrong during verification!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

          });
        }
      },
      prefill: {
        name: document.getElementById("name")?.value || "",
        email: document.getElementById("email")?.value || "",
        contact: document.getElementById("phone")?.value || "",
      },
      theme: {
        color: "#1f5ec6",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  if (!((session && session.user) || (userCred && Object.keys(userCred).length > 0))) {
    return (
      <div className='mx-5 my-8 min-h-screen'>
        <h1 className='text-2xl font-bold text-center my-5'>Checkout</h1>
        <div className='text-center text-lg font-semibold'>Please login to continue with the checkout process.</div>

        <div className='flex justify-center mt-5'>
          <button
            onClick={() => router.push('/SignIn')}
            className="bg-[#1f5ec6] text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-5 my-8'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className='text-2xl font-bold text-center my-5'>Checkout</h1>

      <span className='text-lg font-semibold my-8'>1. Delivery Details</span>

      <form onSubmit={handleSaveDeliveryDetails} className='flex flex-col gap-4'>
        <div className='flex flex-row gap-2'>
          <div className='flex flex-col gap-1 w-1/2 mb-0.5 mt-4'>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" className="w-full bg-gray-200 border rounded px-3 py-1" value={session ? session.user.name : userCred.name} disabled onChange={(e) => setorderName(e.target.value)} />
          </div>
          <div className='flex flex-col gap-1 w-1/2 mb-0.5 mt-4'>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" className="w-full bg-gray-200 border rounded px-3 py-1" value={session ? session.user.email : userCred.email} disabled onChange={(e) => setorderEmail(e.target.value)} />
          </div>
        </div>
        <div className='flex flex-col gap-1 w-full mb-0.5'>
          <label htmlFor="houseAddress">House Address</label>
          <textarea id="houseAddress" className="w-full bg-white border rounded px-3 py-1 h-24 resize-none" required />
        </div>
        <div className='flex flex-row gap-2 '>
          <div className='flex flex-col gap-1 w-1/2 mb-0.5'>
            <label htmlFor="phone">Phone</label>
            <input type="number" id="phone" className="w-full bg-white border rounded px-3 py-1" value={orderPhone} onChange={(e) => setorderPhone(e.target.value)} required />
          </div>
          <div className='flex flex-col gap-1 w-1/2 mb-0.5'>
            <label htmlFor="city">City</label>
            <input type="text" id="city" className="w-full bg-white border rounded px-3 py-1" required />
          </div>
        </div>
        <div className='flex flex-row gap-2 '>
          <div className='flex flex-col gap-1 w-1/2 mb-0.5'>
            <label htmlFor="state">State</label>
            <input type="text" id="state" className="w-full bg-white border rounded px-3 py-1" required />
          </div>
          <div className='flex flex-col gap-1 w-1/2 mb-0.5'>
            <label htmlFor="pincode">Pincode</label>
            <input type="number" id="pincode" className="w-full bg-white border rounded px-3 py-1" required />
          </div>
        </div>

        <button
          type="sumbit"
          className="bg-[#1f5ec6] lg:w-sm w-auto text-white px-6 py-3 rounded-lg cursor-pointer"
        >
          Save Delivery Details
        </button>
      </form>


      <div className='my-4'>
        <span className='text-lg font-semibold'>2. Review Cart Items</span>
        <div>
          <ol className='flex flex-col gap-3 mt-4 p-4 bg-slate-200'>
            {Object.keys(cart).length === 0 && <div className='text-center text-lg font-semibold'>Your Cart is Empty!</div>}
            {Object.keys(cart).map(itemCode => (
              <li key={itemCode} className='flex justify-between items-center'>
                <div className='flex gap-4'>
                  <div>{cart[itemCode].name}</div>
                  <div className='flex items-center gap-2'>
                    <button onClick={() => removeFromCart(itemCode, 1)}><AiFillMinusCircle /></button>
                    {cart[itemCode].qty}
                    <button onClick={() => addTocart(itemCode, 1, cart[itemCode].unitPrice, cart[itemCode].name, cart[itemCode].size, cart[itemCode].variant)}><AiFillPlusCircle /></button>
                  </div>
                  <div>₹{cart[itemCode].price}</div>
                  <div>{cart[itemCode].variant}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <button
        type="button"
        onClick={initiatePayment}
        className="bg-[#1f5ec6] text-white px-6 py-3 mt-5 rounded-lg flex items-center gap-2 cursor-pointer"
      >
        <FaShoppingBag /> Pay ₹{subtotal}
      </button>
    </div>
  );
};

export default Checkout;
