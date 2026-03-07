import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-6">Privacy Policy</h1>

                <div className="prose prose-orange max-w-none text-gray-600 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Collection</h2>
                        <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email, phone number, and shipping address.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
                        <p>Your information is used to process orders, improve our services, and send you updates about your purchases or promotional offers (with your consent).</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
