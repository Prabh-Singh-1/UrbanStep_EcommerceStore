"use client"
import React, { useContext, useState } from 'react'
import Link from "next/link";
import { useSession, signIn } from "next-auth/react"
import Loader from '../Components/Loader/page';
import { redirect } from 'next/navigation'
import { CartContext } from '../cartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

const SignIn = () => {

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const { data: session, status } = useSession();

  const { userCred, setUserCred } = useContext(CartContext);


  const fetchUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/fetchUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      const decoded = jwtDecode(data);
      setUserCred(decoded);

      Cookies.set('token', data, { expires: 1 });
      Cookies.set('userCred', JSON.stringify(decoded), { expires: 1 });

      toast.success("Login successful!");


    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong");
    }
  };


  if (((session && session.user) || (userCred && Object.keys(userCred).length > 0))) {
    setTimeout(() => {
      redirect("/");
    }, 1000);
  }


  if (status === "loading") {
    return <Loader />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 mb-4">
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
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-10">
        <h1 className="text-3xl font-bold text-gray-800 pb-7">Login</h1>
        <div className="w-full max-w-md">
          <form onSubmit={fetchUser} className="space-y-4" >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter your Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="enter your email"
                  className="w-1/3 px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter your password"
                  className="w-2/3 px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 border w-full py-2 rounded-md hover:bg-gray-100 transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 border w-full py-2 rounded-md hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>

            <p className="text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/Terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/Privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Do not have an account?{" "}
            <Link href="/SignUp" className="text-blue-600 font-medium">
              Sign up
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="hidden md:flex justify-center items-center w-1/2 bg-blue-50">
        <img
          src="/images/LoginDoodle.svg"
          alt="Login Illustration"
          className="w-3/4 h-auto"
        />
      </div>

      {/* Recaptcha Placeholder */}
      <div id="recaptcha-container"></div>
    </div>
  )
}

export default SignIn