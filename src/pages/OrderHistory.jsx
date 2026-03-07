import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = user?.Id || user?.id || 0;
                // Using assumed endpoint based on pattern
                const response = await api.get(`/GetOrderHistory?UserId=${userId}`);

                if (response.data && response.data.status_code === 100) {
                    setOrders(response.data.data || []);
                } else {
                    // Placeholder for now if API returns different structure
                    setOrders([]);
                }
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setError("Could not load your order history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('delivered')) return 'bg-green-50 text-green-700 border-green-100';
        if (s.includes('pending') || s.includes('processing')) return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        if (s.includes('cancelled')) return 'bg-red-50 text-red-700 border-red-100';
        return 'bg-blue-50 text-blue-700 border-blue-100';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-punya-orange/20 border-t-punya-orange rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="text-sm text-gray-500 mt-1">Check the status of your recent orders and manage returns.</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm flex items-center gap-3">
                    <span className="material-icons-outlined text-lg">error_outline</span>
                    {error}
                </div>
            )}

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.OrderId} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Placed</p>
                                        <p className="text-sm font-bold text-gray-700 mt-0.5">
                                            {new Date(order.OrderDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                                        <p className="text-sm font-bold text-gray-900 mt-0.5">₹{order.GrandTotal}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ship To</p>
                                        <p className="text-sm font-bold text-gray-700 mt-0.5 truncate max-w-[150px]">{user.WebUserName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Order # {order.OrderNo}</p>
                                    <Link to={`/account/orders/${order.OrderId}`} className="text-xs font-bold text-punya-orange hover:underline block mt-0.5">
                                        View Order Details
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-1 flex gap-6">
                                    <div className="w-20 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                                        {/* Assuming there's a primary image for the order, or we take from first item */}
                                        <img src={order.Items?.[0]?.Image || '/assets/img/placeholder.png'} alt="Order item" className="w-full h-full object-cover object-top" />
                                    </div>
                                    <div className="flex-1">
                                        <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.Status)} mb-3`}>
                                            {order.Status || 'Processing'}
                                        </div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{order.Items?.[0]?.ProductTitle || 'Multiple Items'}</h3>
                                        <p className="text-xs text-gray-500 mt-1">And {Math.max(0, (order.ItemsCount || 1) - 1)} other items</p>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                    <button className="md:w-full px-6 py-2.5 bg-punya-dark text-white text-xs font-bold rounded-xl hover:bg-black transition-colors shadow-sm whitespace-nowrap">
                                        Track Package
                                    </button>
                                    <button className="md:w-full px-6 py-2.5 bg-white text-gray-700 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap">
                                        Buy it Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <span className="material-icons-outlined text-4xl text-gray-300">shopping_bag</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">You haven't placed any orders yet.</h2>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8 text-sm">When you do, your order history will appear here. Start shopping our latest collection!</p>
                    <Link to="/" className="inline-block px-8 py-3 bg-punya-orange text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all active:scale-[0.98]">
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
