import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-500 mb-8 text-lg">Thank you for your purchase. We've received your order and are getting it ready for shipment.</p>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="w-full flex items-center justify-center px-8 py-3.5 bg-punya-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
                    >
                        Back to Shopping
                    </Link>

                    <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all"
                    >
                        View Order History
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-400">
                    <p>A confirmation email has been sent to your registered email address.</p>
                    <p className="mt-2">Have questions? <Link to="/contact" className="text-punya-orange hover:underline font-medium">Contact Support</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
