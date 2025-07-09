
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar/page";
import Footer from "./Footer/page";
import { CartProvider } from "./cartContext";
import SessionWrapper from "../component/SessionWrapper";
import TopLoader from "./Components/TopLoader";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Urban Step",
  description: "Step up With Style",
};



export default function RootLayout({ children }) {

  return (  
    <html lang="en">
      <SessionWrapper>
         
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        >
          <TopLoader />
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </body>
      </SessionWrapper>
    </html>
  );
}
