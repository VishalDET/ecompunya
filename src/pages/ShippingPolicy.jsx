import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-6">Shipping Policy</h1>

                <div className="prose prose-orange max-w-none text-gray-600 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Methods</h2>
                        <p>We ship through reliable courier partners to ensure your products reach you safely and on time. Standard delivery takes 5-7 business days across India.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Charges</h2>
                        <p>Free shipping is provided on orders above ₹999. For orders below this amount, flat ₹50 shipping is charged at checkout.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
