"use client"
import React from 'react'
import { useContext } from 'react'
import { CartContext } from '../../cartContext.js'

const Page = () => {
  const { cartDot } = useContext(CartContext)

  return (

    <div className="absolute -top-2 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
      <span className="text-white text-xs">{cartDot}</span>
    </div>
  )
}

export default Page