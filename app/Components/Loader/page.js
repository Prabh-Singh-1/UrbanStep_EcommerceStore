"use client"
import React from 'react'

const Loader = () => {
    return (
        <>
            <div className="min-h-screen text-center my-20">
                <div role="status">
                    <div className=" flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </>
    )
}

export default Loader