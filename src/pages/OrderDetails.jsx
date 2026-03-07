import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const OrderDetails = () => {
    const { orderId } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Using assumed endpoint based on pattern
                const response = await api.get(`/GetOrderDetails?OrderId=${orderId}`);

                if (response.data && response.data.status_code === 100) {
                    setOrder(response.data.data);
                } else {
                    setError("Could not find order details.");
                }
            } catch (err) {
                console.error("Failed to fetch order details", err);
                setError("An error occurred while loading order details.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-punya-orange/20 border-t-punya-orange rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading order details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-16">
                <span className="material-icons-outlined text-5xl text-red-100 mb-4 font-bold">error_outline</span>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{error || "Order not found"}</h2>
                <Link to="/account/orders" className="text-punya-orange font-bold hover:underline">Back to My Orders</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <nav className="flex text-xs text-gray-400 gap-2 items-center mb-2">
                        <Link to="/account/orders" className="hover:text-punya-orange transition-colors">Orders</Link>
                        <span className="material-icons-outlined text-[10px]">chevron_right</span>
                        <span className="text-gray-900 font-bold uppercase tracking-wider">Order #{order.OrderNo}</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        Download Invoice
                    </button>
                    <button className="px-4 py-2 bg-punya-orange text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm">
                        Reorder
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="col-span-1 md:col-span-2 space-y-8">
                    {/* Items List */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Items</h3>
                            <span className="text-xs font-bold text-gray-500">{order.Items?.length || 0} Items</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {(order.Items || []).map((item, idx) => (
                                <div key={idx} className="p-6 flex gap-6">
                                    <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-50 flex-shrink-0">
                                        <img src={item.Image || '/assets/img/placeholder.png'} alt={item.ProductTitle} className="w-full h-full object-cover object-top" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 hover:text-punya-orange transition-colors">
                                            <Link to={`/product/${item.ProductId}`}>{item.ProductTitle}</Link>
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">Size: <span className="text-gray-700 font-medium">{item.Size}</span> | Color: <span className="text-gray-700 font-medium">{item.Color}</span></p>
                                        <div className="flex justify-between items-center mt-3">
                                            <p className="text-sm text-gray-500 font-medium">Qty: {item.Quantity}</p>
                                            <p className="font-bold text-gray-900">₹{item.SalePrice * item.Quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-50">Order Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-900">₹{order.TotalPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping Fees</span>
                                <span className="font-semibold text-gray-900">{order.ShippingCharges > 0 ? `₹${order.ShippingCharges}` : 'Free'}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Taxes (GST)</span>
                                <span className="font-semibold text-gray-900">₹{order.GSTAmount}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-900 pt-4 border-t border-gray-100 mt-4">
                                <span>Grand Total</span>
                                <span className="text-punya-orange">₹{order.GrandTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 space-y-8">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Order Status</h3>
                        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100 mb-6">
                            <span className="material-icons-outlined text-punya-orange">local_shipping</span>
                            <div>
                                <p className="text-xs font-bold text-punya-orange uppercase tracking-wider">{order.Status || 'In Transit'}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">Updated: {new Date(order.ModifiedDate || order.OrderDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-6 relative">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                            {[
                                { title: 'Order Placed', date: order.OrderDate, completed: true },
                                { title: 'Order Confirmed', date: order.OrderDate, completed: true },
                                { title: 'Packed & Ready', date: null, completed: false },
                                { title: 'Shipped', date: null, completed: false },
                                { title: 'Delivered', date: null, completed: false },
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4 relative z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step.completed
                                            ? 'bg-punya-orange border-punya-orange text-white'
                                            : 'bg-white border-gray-200 text-gray-300'
                                        }`}>
                                        <span className="material-icons-outlined text-[14px]">{step.completed ? 'check' : 'circle'}</span>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-bold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                                        {step.date && <p className="text-[10px] text-gray-400 mt-0.5">{new Date(step.date).toLocaleDateString()}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm font-bold">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Delivery Address</h3>
                        <div className="text-sm font-bold text-gray-600 space-y-1">
                            <p className="text-gray-900 font-bold">{user.WebUserName}</p>
                            <p>{order.ShippingAddress || user.ShippingAddress}</p>
                            <p>{order.CityName || user.CityName}, {order.StateName || user.StateName}</p>
                            <p>{order.Pincode || user.Pincode}</p>
                            <p className="pt-2 text-gray-900">Phone: {order.MobileNo || user.MobileNo}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm font-bold">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Payment Method</h3>
                        <p className="text-sm text-gray-600 font-bold">{order.PaymentMethod || 'Online Payment'}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Transaction ID: {order.PaymentId || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
