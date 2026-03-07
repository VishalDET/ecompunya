import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 py-24 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-punya-orange/20 to-black/60 mix-blend-multiply" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">About Punya</h1>
                    <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-300">
                        Crafting premium fashion with a blend of tradition and modernity. Discover the story behind our brand.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">Our Vision</h2>
                            <p className="text-lg leading-8 text-gray-600 mb-6">
                                At Punya, we believe that fashion is more than just clothing; it's an expression of identity and culture. Our mission is to provide high-quality, stylish apparel that empowers individuals to look and feel their best.
                            </p>
                            <p className="text-lg leading-8 text-gray-600">
                                Founded with a passion for excellence, we meticulously select fabrics and designs that resonate with the modern consumer while staying true to our heritage. Every piece in our collection is a testament to our commitment to craftsmanship.
                            </p>
                        </div>
                        <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-2xl h-96 flex items-center justify-center">
                            {/* Placeholder for brand image */}
                            <div className="text-gray-400 text-center p-8">
                                <svg className="w-24 h-24 mx-auto mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <p className="font-bold">Our Heritage & Craftsmanship</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Quality First', desc: 'We never compromise on the quality of our fabrics and construction.' },
                            { title: 'Customer Centric', desc: 'Our customers are at the heart of everything we do.' },
                            { title: 'Innovation', desc: 'We continuously explore new designs and technologies in fashion.' }
                        ].map((val, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                                <p className="text-gray-600">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
