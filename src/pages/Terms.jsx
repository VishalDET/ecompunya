import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-6">Terms & Conditions</h1>

                <div className="prose prose-orange max-w-none text-gray-600 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                        <p>Welcome to Punya. By accessing our website and using our services, you agree to be bound by the following terms and conditions. Please read them carefully before making a purchase.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use of Website</h2>
                        <p>This website is intended for personal, non-commercial use. You may not use the content for any illegal or unauthorized purpose. Browsing our site implies acceptance of our privacy policy and cookie usage.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Product Information</h2>
                        <p>We strive to provide accurate descriptions and images of our products. However, we do not warrant that product descriptions or other content are error-free. Colors may vary slightly due to screen resolutions.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Shipping & Delivery</h2>
                        <p>Delivery times are estimates and may vary based on location and logistics. Punya is not responsible for delays caused by third-party delivery services or unforeseen circumstances.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Limitation of Liability</h2>
                        <p>In no event shall Punya be liable for any direct, indirect, incidental, or consequential damages arising out of your use of our products or website.</p>
                    </section>

                    <section className="bg-gray-50 p-6 rounded-2xl border-l-4 border-punya-orange">
                        <p className="italic">These terms are subject to change without prior notice. Last updated: March 2026.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
