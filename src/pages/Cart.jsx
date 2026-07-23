import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';

const Cart = () => {
    const { user } = useAuth();
    const {
        cartItems,
        cartSummary: summary,
        loading,
        updateQuantity,
        removeCartItem,
        loadCart
    } = useCart();

    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const formatPrice = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    // Ensure cart is fresh when loading the page
    useEffect(() => {
        loadCart();
    }, [loadCart]);

    if (loading) return <Loader fullScreen message="Loading your cart..." />;

    return (
        <main className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
                    Your Cart {cartItems.length > 0 && <span className="text-gray-400 text-xl font-normal">({cartItems.length} items)</span>}
                </h2>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3">
                        {cartItems.length > 0 ? (
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <article key={item.Id || item.PackageId} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative group transition-shadow hover:shadow-md">

                                        <div className="w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-0">
                                            <img src={item.MainImage} alt={item.ProductTitle} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>

                                        <div className="flex-grow flex flex-col justify-between h-full w-full">
                                            <div className="pr-8">
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                                                    <Link to={`/product/${item.ProductId}`} className="hover:text-punya-orange transition-colors">
                                                        {item.ProductTitle}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">Size: {item.Size}</span>
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">Color: {item.Color}</span>
                                                </p>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-gray-900">₹ {formatPrice(item.SalePrice)}</p>
                                                    {item.Price > item.SalePrice && (
                                                        <>
                                                            <p className="text-xs text-gray-400 line-through">₹ {formatPrice(item.Price)}</p>
                                                            <p className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                                                {Math.round(((item.Price - item.SalePrice) / item.Price) * 100)}% OFF
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 font-normal mb-3">unit price</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-gray-300 rounded-full h-10 px-1 bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.ProductId, item.PackageId, item.SalePrice, item.Quantity, -1)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-punya-orange transition-colors"
                                                    >-</button>
                                                    <input
                                                        type="number"
                                                        value={item.Quantity}
                                                        readOnly
                                                        className="w-10 text-center font-bold text-gray-900 border-none outline-none bg-transparent"
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.ProductId, item.PackageId, item.SalePrice, item.Quantity, 1)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-punya-orange transition-colors"
                                                    >+</button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 mb-1">Total</p>
                                                    <p className="text-lg font-extrabold text-punya-dark">₹ {formatPrice(item.Quantity * item.SalePrice)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedItem({ productId: item.ProductId || item.productId, packageId: item.PackageId || item.packageId, title: item.ProductTitle });
                                                setShowModal(true);
                                            }}
                                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                            title="Remove item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Go ahead & explore top categories.</p>
                                <Link to="/" className="inline-flex items-center justify-center px-8 py-3 1.5 bg-punya-orange hover:bg-orange-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]">
                                    Continue Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    <div className="w-full lg:w-1/3">
                        <aside className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h3>

                            {summary ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="font-medium text-gray-900">₹ {formatPrice(summary.SubTotal || summary.TotalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Estimated Shipping</span>
                                        <span className="font-medium text-gray-900">
                                            {(() => {
                                                const charge = parseFloat(summary.ShippingCharge || summary.ShippingCharges || 0);
                                                return charge > 0 ? `₹ ${formatPrice(charge)}` : 'Free';
                                            })()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 pb-4 border-b border-gray-100">
                                        <span>Estimated Tax (GST)</span>
                                        <span className="font-medium text-gray-900">₹ {formatPrice(summary.GST || summary.GSTAmount || 0)}</span>
                                    </div>

                                    {(summary.DiscountAmount > 0 || summary.DiscountPrice > 0) && (
                                        <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                            <span className="font-medium flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                                Discount
                                            </span>
                                            <span className="font-bold">- ₹ {formatPrice(summary.DiscountAmount || summary.DiscountPrice)}</span>
                                        </div>
                                    )}

                                    <div className="pt-4 flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-punya-orange tracking-tight">₹ {formatPrice(summary.Total || summary.GrandTotal)}</span>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Promo code"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring focus:ring-punya-orange focus:border-punya-orange outline-none transition-shadow pr-24"
                                            />
                                            <button className="absolute right-2 top-2 bottom-2 bg-gray-900 text-white px-4 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                                                Apply
                                            </button>
                                        </div>

                                        <Link
                                            to="/checkout"
                                            className="w-full flex items-center justify-center py-4 px-4 bg-punya-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] mt-4"
                                        >
                                            Proceed to Checkout
                                        </Link>
                                    </div>

                                    <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        Secure Checkout
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <p>Add items to your cart to see the summary.</p>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 transform scale-100 transition-all duration-300">
                        <div className="text-center">
                            <span className="material-icons-outlined text-4xl text-red-500 mb-4 bg-red-50 p-3 rounded-full inline-block">delete_outline</span>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Remove Item?</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Are you sure you want to remove <span className="font-semibold text-slate-800">"{selectedItem.title}"</span> from your cart?
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedItem(null);
                                }}
                                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setShowModal(false);
                                    await removeCartItem(selectedItem.productId, selectedItem.packageId);
                                    setSelectedItem(null);
                                }}
                                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition-colors text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;
