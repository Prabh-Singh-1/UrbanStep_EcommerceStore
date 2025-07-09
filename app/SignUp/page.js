"use client";
import React from 'react'
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { CartContext } from '../cartContext';

const SignUp = () => {

    const { data: session, status } = useSession();
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [phone, setphone] = useState("")
    const [password, setpassword] = useState("")
    const { userCred } = React.useContext(CartContext);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { name, email, password };

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            console.log('Response: ', res);

            if (!res.ok) {
                throw new Error('Failed to create user');
            }

            const response = await res.json();
            toast.success('User Created', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        
            
        } catch (err) {
             toast.error('Failed to Create user, try using another email', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error('Error:', err.message);
        }
    }


    if (((session && session.user) || (userCred && Object.keys(userCred).length > 0)) ) {
        redirect("/");
    }

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <>
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
                theme="light"

            />
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 mb-4">
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-10">
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create an account</h2>


                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => { setname(e.target.value) }}
                                    type="text"
                                    placeholder="Prabhleen Singh"
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => { setemail(e.target.value) }}
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    value={password}
                                    onChange={(e) => { setpassword(e.target.value) }}
                                    type="text"
                                    placeholder="Enter a secure password"
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <button type="submit" className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition">
                                Create account
                            </button>


                        </form>
                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="flex items-center justify-center gap-2 border mt-3 w-full py-2 rounded-md hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Sign in with Google
                        </button>

                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-4 text-gray-500 text-sm">or</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="space-y-1">
                            <a href="/SignIn">
                                <button type="submit" className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition">
                                    Existing User?
                                </button>
                            </a>
                        </div>
                        <p className='mt-6 text-sm text-gray-500'>
                            By signing in, you agree to our <Link href="/Terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/Privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex justify-center items-center w-1/2 bg-blue-50">
                    <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
                        alt="Signup Illustration"
                        className="w-3/4 h-auto"
                    />
                </div>
            </div>
        </>
    )
}

export default SignUp