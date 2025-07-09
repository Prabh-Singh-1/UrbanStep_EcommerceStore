"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';

const Order = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setorder] = useState([])
    console.log('Order ID:', orderId);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`/api/getOrderDetails?orderId=${orderId}`); // Adjust the endpoint as needed
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data[0]);
                setorder(data[0]);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        }
        fetchOrderDetails();
    }, [orderId]);


    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">URBANSTEP.COM</h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-3">Order Id: {order.orderId}</h1>
                            <p className="leading-relaxed mb-3 font-semibold">Your Order has been placed successfully!</p>
                            <div>
                                <div className="flex justify-center items-center border-t border-gray-200 py-2 ">
                                    <a className="max-w-sm break-words px-1 py-2 text-lg flex-grow">Item Discription</a>
                                    <a className="px-1 py-2 text-lg w-16 text-center">Quantity</a>
                                    <a className="px-1 py-2 text-lg w-24 text-right">Price</a>
                                </div>

                                {order?.products && Object.values(order.products).map((item, idx) => (
                                    <Link key={idx} href={`/Products/${encodeURIComponent(item.name)}`} className='text-blue-700 hover:text-blue-900'>
                                        <div className="flex justify-center items-center border-t border-gray-200 py-2 ">
                                            <span className="max-w-sm break-words px-1 py-2 text-lg flex-grow">
                                                {item.name} / {item.size} / {item.variant}
                                            </span>
                                            <span className="px-1 py-2 text-lg w-16 text-center">
                                                {item.qty}
                                            </span>
                                            <span className="px-1 py-2 text-lg w-24 text-right">
                                                ₹{item.price}
                                            </span>
                                        </div>
                                    </Link>
                                ))}


                            </div>
                            <div className="flex justify-around items-center">
                                <div>
                                    <span className='title-font font-medium text-2xl text-gray-900'>Subtotal: </span>
                                    <span className="title-font font-medium text-2xl text-gray-900 pl-0.5">₹2697</span>
                                </div>
                                <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Track Order</button>

                            </div>
                        </div>
                        <video autoPlay loop muted alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src='/OrderPlaced.mp4' />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Order