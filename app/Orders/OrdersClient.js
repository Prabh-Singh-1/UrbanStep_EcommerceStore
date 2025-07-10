"use client"
import { useState, useEffect } from 'react';
import { Package, Calendar, Eye, Download, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useSession, signIn } from "next-auth/react"


const Orders = () => {
    const searchParams = useSearchParams();
    const orderMail = searchParams.get('email');
    const [allOrders, setallOrders] = useState([])
    const [selectedFilter, setSelectedFilter] = useState('all');
    

    useEffect(() => {
     const fetchOrders = async () => {
        if (orderMail) {
            try {
                const response = await fetch(`/api/getOrdersByEmail?email=${orderMail}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const orders = await response.json();
                setallOrders(orders);
                console.log(orders); 
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
     }
     fetchOrders();
    }, [orderMail])
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
            case 'processing': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Package className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filters = [
        { key: 'all', label: 'All Orders' },
        { key: 'delivered', label: 'Delivered' },
        { key: 'shipped', label: 'Shipped' },
        { key: 'processing', label: 'Processing' },
        { key: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your recent purchases</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setSelectedFilter(filter.key)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedFilter === filter.key
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Order Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* Sample row structure - replace with actual data */}
                                {allOrders.map((order) => (
                                    <tr key={order.orderid} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <Package className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{order.orderid}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(order.createdat).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{order.products
                                            ? `${Object.keys(order.products).length} items `
                                            : '0 items'}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-lg font-semibold text-gray-900">
                                                ${order.amount ? order.amount.toFixed(2) : '0.00'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                                    <a href={`/Order?orderId=${order.orderid}`}>
                                                    <Eye className="w-4 h-4" />
                                                    </a>
                                                </button>
                                               
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                

                                {/* Empty state when no orders */}
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <Package className="w-16 h-16 text-gray-300 mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                                            <p className="text-gray-500">Your orders will appear here once you make a purchase.</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-blue-500 text-white rounded-lg">1</span>
                        <span className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">2</span>
                        <span className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">3</span>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;