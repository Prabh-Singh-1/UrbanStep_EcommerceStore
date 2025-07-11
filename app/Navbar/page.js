"use client"
import Image from 'next/image'
import { IoCartOutline } from "react-icons/io5";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { FaShoppingBag } from "react-icons/fa";
import { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import { CartContext } from '../cartContext';
import DotNotify from '../Components/DotNotify/page.js';
import { v4 as uuidv4 } from 'uuid';
import { useSession, signOut } from "next-auth/react"
import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';

const Navbar = () => {

    const timeoutRef = useRef(null);
    const { data: session } = useSession();
    const { userCred, setUserCred } = useContext(CartContext);
    const { cart, setcart } = useContext(CartContext);
    const { cartClick, setcartClick } = useContext(CartContext);
    const { cartDot, setcartDot } = useContext(CartContext);
    const { subtotal, setsubtotal } = useContext(CartContext);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(Cookies.get("userCred"));
            if (storedUser) {
                setUserCred(storedUser);
            }
        } catch (err) {
            console.log('Error: ', err);
        }
    }, []);


    useEffect(() => {

        //localStorage.clear()
        try {
            if (localStorage.getItem('cart')) {
                setcart(JSON.parse(localStorage.getItem('cart')))
            }
        }
        catch (e) {
            console.log(e)
        }
    }, [])




    const saveCart = (mycart, cartDot, subtot) => {
        localStorage.setItem('cart', JSON.stringify(mycart))
        localStorage.setItem('cartDot', JSON.stringify(cartDot))
        localStorage.setItem("subTotal", JSON.stringify(subtot))
    }

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
            const newItemCode = uuidv4(); // avoid shadowing `itemCode`
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
    }

    const clearCart = () => {
        setcart({})
        setcartDot(null)
        setsubtotal(0)
        localStorage.setItem('cartDot', 0)
        saveCart({})
    }

    // const [cartClick, setcartClick] = useState(false)
    const [accountClick, setAccountClick] = useState(false)
    const [menuClick, setMenuClick] = useState(false)

    const handleMenuClick = () => {

        setMenuClick(!menuClick)
    }

    const handleCartClick = () => {
        setcartClick(!cartClick)
    }

    const handleAccountClick = () => {
        setAccountClick(!accountClick)
    }
    const handleLogout = async () => {
        try {
            setUserCred(undefined);
            Cookies.remove('token');
            Cookies.remove('userCred');
            redirect('/')
        } catch (err) {
            console.error('Logout error:', err);
        }
    }
    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setcartClick(false)
            setMenuClick(false)
        }, 1000);
    };
    return (
        <>

            <nav className="bg-white antialiased border-b border-gray-200 shadow-xl sticky top-0 z-50">
                <div className="max-w-screen-xl px-2 lg:px-4 mx-auto 2xl:px-0 py-2 lg:py-3">
                    <div className="flex items-center justify-between">

                        <div className="flex items-center space-x-8">
                            <div className="shrink-0">
                                <Link href="/">
                                    <Image width={100} height={60} className="block w-auto h-10 lg:h-14" src="/LogoHome.png" alt="Logo" />
                                </Link>
                            </div>
                            <ul onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave} className="hidden lg:flex items-center gap-8 py-3">
                                <li><Link href="/" className="text-sm lg:text-lg font-medium text-gray-900 hover:text-gray-700">Home</Link></li>
                                <Link href="/Sports-Shoe" className="text-sm lg:text-lg font-medium text-gray-900 hover:text-gray-700"><li>Sports Shoes</li></Link>
                                <li><Link href="/Loafers" className="text-sm lg:text-lg font-medium text-gray-900 hover:text-gray-700">Loafers</Link></li>
                                <li><Link href="/Snickers" className="text-sm lg:text-lg font-medium text-gray-900 hover:text-gray-700">Sneaker</Link></li>
                                <li><Link href="/Boots" className="text-sm lg:text-lg font-medium text-gray-900 hover:text-gray-700">Boots</Link></li>
                            </ul>
                        </div>


                        <div className="flex items-center space-x-4">
                            <button onClick={handleCartClick} className="inline-flex items-center p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg">
                                <span className='text-2xl relative'><IoCartOutline />{cartDot > 0 && <DotNotify />}</span>
                                <span className="hidden sm:inline ">My Cart</span>
                            </button>
                            {session || userCred ? <>
                                <button onClick={handleAccountClick} className="inline-flex items-center p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg">
                                    <span className='text-2xl'>{(session?.user?.image) ? (<Image className='rounded-4xl mr-1' src={session.user.image} width={30} height={30} alt="User's Image" />) : (<RiAccountCircleLine />)}</span>
                                    Account
                                </button>
                            </> :
                                <>
                                    <button onClick={() => { redirect("/SignIn") }} type="button" className="cursor-pointer text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3.5 lg:px-5 py-1.5 lg:py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                                        Login
                                    </button>
                                </>}

                            {session && <>


                                <div
                                    className={`absolute top-12 right-12  z-40 ${accountClick ? 'block' : 'hidden'} my-4 text-base list-none  bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-lg`}
                                    id="user-dropdown"
                                >
                                    <div className="px-4 py-3">
                                        <span className="block text-sm text-gray-900">{session.user.name}</span>
                                        <span className="block text-sm text-gray-500 truncate">{session.user?.email}</span>
                                    </div>
                                    <ul className="py-2" aria-labelledby="user-menu-button">
                                        <li>
                                            <a href={`/MyAccount?email=${encodeURIComponent(session? session.user.email: userCred.email)}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</a>
                                        </li>
                                        <li>
                                            {session && <a href={`/Orders?email=${encodeURIComponent(session.user?.email)}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</a>}
                                        </li>
                                        <li>
                                            <a className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><button onClick={() => { setcartClick(true) }} >My Cart</button></a>
                                        </li>
                                        <a className="cursor-pointer w-full float-start block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><button onClick={() => { signOut() }}>

                                            <li>Sign out </li></button>

                                        </a>
                                    </ul>

                                </div>
                            </>}
                            {userCred && <>


                                <div
                                    className={`absolute top-12 right-12 w-40 z-40 ${accountClick ? 'block' : 'hidden'} my-4 text-base list-none  bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-lg`}
                                    id="user-dropdown"
                                >
                                    <div className="px-4 py-2">
                                        <span className="block text-sm text-gray-900">Hi, {userCred.name}</span>
                                    </div>
                                    <ul className="py-2" aria-labelledby="user-menu-button">
                                        <li>
                                            <a href={`/MyAccount?email=${encodeURIComponent(userCred.email)}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</a>
                                        </li>
                                        <li>
                                            <a href={`/Orders?email=${encodeURIComponent(userCred.email)}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</a>
                                        </li>
                                        <li>
                                            <a className="cursor-pointer block px-4 py-2  text-sm text-gray-700 hover:bg-gray-100"><button onClick={() => { setcartClick(true) }} >My Cart</button></a>
                                        </li>
                                        <a className="cursor-pointer w-full float-start block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><button onClick={handleLogout}>

                                            <li>Sign out </li></button>

                                        </a>
                                    </ul>

                                </div>
                            </>}


                            <button onClick={handleMenuClick} className="inline-flex lg:hidden items-center  text-gray-900 hover:bg-gray-100 rounded-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" strokeWidth="2" />
                                </svg>
                            </button>


                            <div onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave} className={`overflow-y-auto fixed top-0 right-0 w-4/5 sm:w-3/5 md:w-full md:max-w-md h-full bg-[#2874f0] text-white z-50 transform transition-transform duration-300 ease-in-out ${cartClick ? 'translate-x-0' : 'translate-x-full'} py-4 px-4 md:py-5 md:px-6`}>
                                <div className='flex justify-between items-center mb-4'>
                                    <span className='font-bold text-lg md:text-xl'>Shopping Cart</span>
                                    <button className='text-xl md:text-2xl cursor-pointer p-1' onClick={handleCartClick}>
                                        <IoMdCloseCircleOutline />
                                    </button>
                                </div>

                                <ol className='flex text-sm md:text-base flex-col gap-2 md:gap-4 px-2 md:px-6 py-4 md:py-7 font-normal'>
                                    {Object.keys(cart).length === 0 && (
                                        <div className='text-center text-white text-base md:text-lg font-semibold'>Your Cart is Empty!</div>
                                    )}

                                    {Object.keys(cart).map((itemCode) => (
                                        <li key={itemCode} className='flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 border-b border-blue-400/30'>
                                            {/* Mobile Layout - Stack items vertically */}
                                            <div className='flex flex-col sm:hidden w-full gap-2'>
                                                <div className='text-sm font-medium'>{cart[itemCode].name}/ {cart[itemCode].size}/{cart[itemCode].variant}</div>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center gap-2'>
                                                        <button className='cursor-pointer text-sm' onClick={() => removeFromCart(itemCode, 1)}>
                                                            <AiFillMinusCircle />
                                                        </button>
                                                        <span className='text-sm font-semibold min-w-[20px] text-center'>{cart[itemCode].qty}</span>
                                                        <span className='cursor-pointer text-sm' onClick={() => addTocart(itemCode, 1, cart[itemCode].unitPrice, cart[itemCode].name, cart[itemCode].size, cart[itemCode].variant)}>
                                                            <AiFillPlusCircle />
                                                        </span>
                                                    </div>
                                                    <div className='text-sm font-semibold'>₹{cart[itemCode].price}</div>
                                                </div>
                                                <div className='text-xs text-blue-200'>{cart[itemCode].variant}</div>
                                            </div>

                                            {/* Desktop Layout - Horizontal */}
                                            <div className='hidden sm:flex items-center gap-3 md:gap-6 w-full'>
                                                <div className='text-sm md:text-base flex-1 min-w-0'>{cart[itemCode].name}/ {cart[itemCode].size}/{cart[itemCode].variant}</div>
                                                <div className='font-semibold flex items-center gap-1.5'>
                                                    <button className='cursor-pointer text-sm md:text-base' onClick={() => removeFromCart(itemCode, 1)}>
                                                        <AiFillMinusCircle />
                                                    </button>
                                                    <span className='text-sm md:text-base min-w-[20px] text-center'>{cart[itemCode].qty}</span>
                                                    <span className='cursor-pointer text-sm md:text-base' onClick={() => addTocart(itemCode, 1, cart[itemCode].unitPrice, cart[itemCode].name, cart[itemCode].size, cart[itemCode].variant)}>
                                                        <AiFillPlusCircle />
                                                    </span>
                                                </div>
                                                <div className='text-sm md:text-base font-semibold'>₹{cart[itemCode].price}</div>
                                                <div className='text-xs md:text-sm text-blue-200 min-w-0'>{cart[itemCode].variant}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>

                                <div className='mt-4 md:mt-6 flex flex-col justify-between items-stretch gap-3 border-t pt-4'>
                                    <div className='text-base md:text-lg font-semibold text-center'>Total: ₹{subtotal}</div>
                                    <div className='flex flex-col sm:flex-row gap-2 justify-stretch sm:justify-center'>
                                        <Link href="/Checkout" className="flex-1 sm:flex-none">
                                            <button className="w-full text-[#2874f0] bg-white hover:bg-[#1f5ec6] hover:text-white focus:ring-4 focus:ring-[#b3d4fc] font-medium rounded-lg text-sm px-4 py-2 focus:outline-none transition-colors">
                                                Checkout
                                            </button>
                                        </Link>

                                        <button
                                            onClick={clearCart}
                                            className="w-full sm:w-auto text-[#2874f0] bg-white hover:bg-[#1f5ec6] hover:text-white focus:ring-4 focus:ring-[#b3d4fc] flex items-center justify-center gap-2 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none transition-colors"
                                        >
                                            <FaShoppingBag />
                                            <span>Clear Cart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave} className={`bg-gray-50 border border-gray-200 rounded-lg py-3 ${menuClick ? 'block' : 'hidden'} px-4 mt-4`}>
                        <ul className="text-gray-900 text-sm font-medium space-y-3">
                            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
                            <li><Link href="/Sports-Shoe" className="hover:text-gray-700">Sports Shoes</Link></li>
                            <li><Link href="/Snickers" className="hover:text-gray-700">Sneaker</Link></li>
                            <li><Link href="/Loafers" className="hover:text-gray-700">Loafers</Link></li>
                            <li><Link href="/Boots" className="hover:text-gray-700">Boots</Link></li>
                        </ul>
                    </div>
                </div>
            </nav >


        </>
    )
}

export default Navbar