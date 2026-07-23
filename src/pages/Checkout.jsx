import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const { user } = useAuth();
    const { fetchCartCount } = useCart();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        billing_fname: '',
        billing_lname: '',
        billing_company: '',
        billing_country: 'IN',
        billing_streetAddress: '',
        billing_apartment: '',
        billing_city: '',
        billing_state: '',
        billing_phone: '',
        billing_email: '',
        orderNotes: '',
        payment_method: 'cheque'
    });

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                const userId = user?.Id || 0;

                const cartRes = await api.post(`GetCartProduct?UserId=${userId}`);
                if (cartRes.data && cartRes.data.status_code === 100 && cartRes.data.data) {
                    const data = cartRes.data.data;
                    if (data.length > 0) {
                        setCartItems(data.filter(item => item.ItemType !== 'totalsum'));
                        setSummary(data.find(item => item.ItemType === 'totalsum') || null);
                    }
                }

                // Fetch User Address (like Checkout?handler=Address)
                // Assuming it's a generic user endpoint or custom endpoint
                // We'll leave it empty unless we know the exact endpoint in the API
                // For now, populate with user context if available
                if (user) {
                    setFormData(prev => ({
                        ...prev,
                        billing_fname: user.WebUserName || '',
                        billing_lname: user.WebUserName || '',
                        billing_email: user.Email || '',
                        billing_phone: user.MobileNo || ''
                    }));
                }

            } catch (error) {
                console.error("Error fetching checkout data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutData();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        try {
            const userType = user?.UserType || 0;
            const userId = user?.Id || 0;

            if (userType === 2) {
                // Retail user flow - check quantity limits
                const hasExceededQuantity = cartItems.some(item => item.Quantity >= 5);
                if (hasExceededQuantity) {
                    alert('You are not eligible for more than 4 quantity per item for retail orders!');
                    return;
                }

                // In a real app, you'd redirect to payment gateway (PaymentInitiate)
                // For this migration, we simulate navigation to a payment page or placeholder
                alert('Redirecting to Payment Gateway (Simulation)...');
                navigate('/thank-you');
            } else if (userType === 1) {
                // Wholesale / B2B user flow - PlaceOrder directly
                // Original code: $.ajax({url: '/Checkout?handler=PlaceOrder'...})
                // We simulate an API call here
                // Replace 'PlaceOrder' with the actual endpoint from the new API if available
                /*
                const response = await api.post('PlaceOrder', {
                    UserId: userId,
                    Address: formData
                });
                */
                alert('Order Placed Successfully!');
                fetchCartCount(); // refresh cart
                navigate('/thank-you');
            } else {
                alert('Please log in to place an order.');
                navigate('/login');
            }

        } catch (error) {
            console.error("Error placing order", error);
            alert("Failed to place order.");
        }
    };

    if (loading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-punya-orange"></div>
        </div>
    );

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100 max-w-lg w-full">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">You need items in your cart to proceed to checkout.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-punya-orange text-white rounded-full font-bold hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Billing Details Form */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-punya-dark text-white flex items-center justify-center font-bold">1</div>
                                <h3 className="text-xl font-bold text-gray-900">Shipping Information</h3>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="space-y-5" id="checkout-form">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="billing_fname" value={formData.billing_fname} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="billing_lname" value={formData.billing_lname} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                                        <input type="tel" name="billing_phone" value={formData.billing_phone} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                        <input type="email" name="billing_email" value={formData.billing_email} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-6">
                                    <h4 className="text-md font-bold text-gray-800 mb-4">Address Details</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country <span className="text-red-500">*</span></label>
                                            <select name="billing_country" value={formData.billing_country} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all text-gray-600">
                                                <option value="IN">India</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address <span className="text-red-500">*</span></label>
                                            <input type="text" name="billing_streetAddress" value={formData.billing_streetAddress} onChange={handleInputChange} required placeholder="House number and street name" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all mb-3" />
                                            <input type="text" name="billing_apartment" value={formData.billing_apartment} onChange={handleInputChange} placeholder="Apartment, suite, unit etc. (optional)" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Town / City <span className="text-red-500">*</span></label>
                                                <input type="text" name="billing_city" value={formData.billing_city} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">State <span className="text-red-500">*</span></label>
                                                <input type="text" name="billing_state" value={formData.billing_state} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Notes</label>
                                    <textarea name="orderNotes" value={formData.orderNotes} onChange={handleInputChange} placeholder="Notes about your order, e.g. special notes for delivery." rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all resize-none"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-punya-dark text-white flex items-center justify-center font-bold">2</div>
                                <h3 className="text-xl font-bold text-gray-900">Your Order</h3>
                            </div>

                            {/* Cart Items Summary List */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                                {cartItems.map((item) => (
                                    <div key={item.PackageId} className="flex gap-4 items-start">
                                        <div className="w-16 h-20 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                                            <img src={item.MainImage} alt={item.ProductTitle} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">{item.ProductTitle}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.Quantity} | {item.Size} | {item.Color}</p>
                                            <p className="font-bold text-punya-dark mt-1">₹ {item.SalePrice * item.Quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cost Breakdown */}
                            {summary && (
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">₹ {summary.TotalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Shipping</span>
                                        <span className="font-medium text-gray-900">{summary.ShippingCharges > 0 ? `₹ ${summary.ShippingCharges}` : 'Free'}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tax (GST)</span>
                                        <span className="font-medium text-gray-900">₹ {summary.GSTAmount}</span>
                                    </div>
                                    {summary.DiscountPrice > 0 && (
                                        <div className="flex justify-between text-green-600 font-medium text-sm bg-green-50 p-2 rounded">
                                            <span>Discount</span>
                                            <span>- ₹ {summary.DiscountPrice}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-2">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-extrabold text-punya-orange">₹ {summary.GrandTotal}</span>
                                    </div>
                                </div>
                            )}

                            {/* Payment Methods */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="text-md font-bold text-gray-800 mb-4">Payment Method</h4>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.payment_method === 'cheque' ? 'border-punya-orange bg-orange-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <div className="relative flex items-center">
                                            <input type="radio" name="payment_method" value="cheque" checked={formData.payment_method === 'cheque'} onChange={handleInputChange} className="peer sr-only" />
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-punya-orange peer-checked:border-[6px] transition-all"></div>
                                        </div>
                                        <span className="font-medium text-gray-800">Online Payment</span>
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.payment_method === 'cash' ? 'border-punya-orange bg-orange-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <div className="relative flex items-center">
                                            <input type="radio" name="payment_method" value="cash" checked={formData.payment_method === 'cash'} onChange={handleInputChange} className="peer sr-only" />
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-punya-orange peer-checked:border-[6px] transition-all"></div>
                                        </div>
                                        <span className="font-medium text-gray-800">Cash On Delivery</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                className="w-full py-4 px-6 bg-punya-dark hover:bg-black text-white rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] mt-8 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                Place Order securely
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
