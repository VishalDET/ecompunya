import React, { useState } from 'react';

const FAQ = () => {
    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 7-day return policy for most items. The product must be unused and in its original packaging with tags intact."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we only ship within India. We are working on expanding our reach to international customers soon."
        },
        {
            question: "How can I cancel my order?",
            answer: "You can cancel your order within 2 hours of placement by contacting our support team via email or phone."
        },
        {
            question: "Are there any shipping charges?",
            answer: "We offer free shipping on orders above ₹999. For orders below that, a nominal shipping fee of ₹50 is applied."
        }
    ];

    const [openIdx, setOpenIdx] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">Frequently Asked Questions</h1>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-bold text-gray-800">{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className={`px-6 transition-all duration-300 ease-in-out ${openIdx === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-punya-dark rounded-3xl p-10 text-white">
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="text-gray-300 mb-8">Can't find the answer you're looking for? Please chat with our friendly team.</p>
                    <a href="/contact" className="inline-block bg-punya-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
                        Get in Touch
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
