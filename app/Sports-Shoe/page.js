import React from 'react'
import Link from 'next/link'

const Sports = async () => {
  const res = await fetch('http://localhost:3000/api/products?category=', {
    cache: 'no-store',
  })
  const products = await res.json()


  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto ">

          <div className="flex flex-wrap -m-4">
            {Object.keys(products).map(product => (
              <div key={products[product].id} className="lg:w-1/4 md:w-1/2 p-4 w-full shadow-xl">
                <Link href={`/Products/${products[product].title}`} className="relative h-48 flex justify-center items-center rounded overflow-hidden bg-white">
                  <img
                    alt="ecommerce"
                    src={products[product].img}
                    className="w-full h-full object-contain p-4"
                  />
                </Link>
                <div className="mt-4">
                  <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Sports Shoes</h3>
                  <h2 className="text-gray-900 title-font text-lg font-medium">{products[product].title}</h2>
                  <p className="mt-1">₹{products[product].price}</p>
                  <div className='text-gray-500 mt-1.5'>
                    {products[product].size.includes('6') && <span className='border border-gray-500 px-1 mx-1'>6</span>}
                    {products[product].size.includes('7') && <span className='border border-gray-500 px-1 mx-1'>7</span>}
                    {products[product].size.includes('8') && <span className='border border-gray-500 px-1 mx-1'>8</span>}
                    {products[product].size.includes('9') && <span className='border border-gray-500 px-1 mx-1'>9</span>}
                    {products[product].size.includes('10') && <span className='border border-gray-500 px-1 mx-1'>10</span>}
                  </div>
                  <div className='text-gray-500 mt-1.5 flex flex-row gap-1'>
                   {products[product].color.includes('White') &&  <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:ring-2 focus:ring-gray-300 focus:outline-none cursor-pointer" value={"White"} ></button>}
                    {products[product].color.includes('blue') && <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:ring-2 focus:ring-gray-300 bg-blue-600 focus:outline-none cursor-pointer" value={"White"} ></button>}
                    {products[product].color.includes('red') && <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:ring-2 focus:ring-gray-300 bg-red-500 focus:outline-none cursor-pointer" value={"White"} ></button>}
                    {products[product].color.includes('black') && <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:ring-2 focus:ring-gray-300 bg-black focus:outline-none cursor-pointer" value={"White"} ></button>}
                  </div>
                </div>
              </div>
            ))}



          </div>
        </div>
      </section>
    </div>
  )
}


export default Sports