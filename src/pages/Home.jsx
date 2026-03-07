import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import BannerSlider from '../components/home/BannerSlider';
import ProductCarousel from '../components/home/ProductCarousel';
import Loader from '../components/common/Loader';

// ─── Section Heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ title, subtitle, light = false }) => (
    <div className="text-center mb-10">
        <h2 className={`font-display text-3xl md:text-4xl font-bold mb-2 ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
        {subtitle && <p className={`text-sm md:text-base italic ${light ? 'text-white/70' : 'text-slate-500'}`}>{subtitle}</p>}
        <div className={`mt-3 w-16 h-1 rounded-full mx-auto ${light ? 'bg-white/50' : 'bg-primary'}`} />
    </div>
);

// ─── Tab Buttons ─────────────────────────────────────────────────────────────
const TabBtn = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-7 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${active
            ? 'bg-slate-900 text-white shadow-md'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'
            }`}
    >
        {children}
    </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Home = () => {
    const [newArrivals, setNewArrivals] = useState({ 1: [], 2: [] });
    const [bestSellers, setBestSellers] = useState({ 1: [], 2: [] });
    const [categories, setCategories] = useState([]);
    const [activeNewArrivalTab, setActiveNewArrivalTab] = useState(2); // Women first
    const [activeBestsellerTab, setActiveBestsellerTab] = useState(2);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                const [naMen, naWomen, bsMen, bsWomen, catRes] = await Promise.all([
                    api.get('GetNewArrival?Id=1'),
                    api.get('GetNewArrival?Id=2'),
                    api.get('GetBestseller?Id=1'),
                    api.get('GetBestseller?Id=2'),
                    api.post('GetCategoryView'),
                ]);
                setNewArrivals({ 1: naMen.data?.data || [], 2: naWomen.data?.data || [] });
                setBestSellers({ 1: bsMen.data?.data || [], 2: bsWomen.data?.data || [] });
                setCategories(catRes.data?.data || []);
            } catch (error) {
                console.error('Error fetching homepage data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 pb-0">

            {/* ── Banner ────────────────────────────────────────────────────── */}
            <section className="mb-14">
                <BannerSlider />
            </section>

            {/* ── Shop by Main Category (Men / Women hero cards) ─────────────── */}
            {categories.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <SectionHeading title="Shop by Category" subtitle="Discover our curated collections, crafted for every occasion." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categories.map(cat => (
                            <Link
                                key={cat.main_category_id}
                                to={`/collections/${cat.main_category_id}`}
                                className="group relative overflow-hidden rounded-2xl h-72 md:h-96 block"
                            >
                                <img
                                    src={cat.main_category_image_url}
                                    alt={cat.main_category_name}
                                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                                    <div>
                                        <p className="text-white/70 text-xs uppercase tracking-widest mb-1 font-medium">Explore</p>
                                        <h3 className="font-display text-3xl font-bold text-white leading-tight">{cat.main_category_name}</h3>
                                    </div>
                                    <span className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                                        <span className="material-icons-outlined text-xl">arrow_forward</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── New Arrivals ────────────────────────────────────────────────── */}
            <section className="bg-white">
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white py-8'>


                    <SectionHeading title="New Arrivals" subtitle="Fresh styles added just for you." />
                    <div className="flex justify-center gap-3 mb-8">
                        <TabBtn active={activeNewArrivalTab === 2} onClick={() => setActiveNewArrivalTab(2)}>Women</TabBtn>
                        <TabBtn active={activeNewArrivalTab === 1} onClick={() => setActiveNewArrivalTab(1)}>Men</TabBtn>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-none">
                        {loading ? <Loader message="Loading New Arrivals..." /> : <ProductCarousel products={newArrivals[activeNewArrivalTab]} />}
                    </div>
                </div>
            </section>

            {/* ── Sub-Category Grids (one per main category) ─────────────────── */}
            {categories.map((cat, i) => (
                <section
                    key={cat.main_category_id}
                    className={`mb-20 py-16 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionHeading title={cat.main_category_name} />
                        <div className="space-y-14">
                            {cat.sub_categories.map(sub => (
                                <div key={sub.sub_category_id}>
                                    {/* Sub-category header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <h3 className="font-display text-xl font-bold text-slate-900 whitespace-nowrap">
                                            {sub.sub_category_name.replace(/-MEN|-WOMEN/i, '').trim()}
                                        </h3>
                                        <div className="flex-1 h-px bg-slate-100" />
                                        <Link
                                            to={`/collections/${sub.sub_category_id}`}
                                            className="text-xs font-bold text-primary hover:underline whitespace-nowrap flex items-center gap-1"
                                        >
                                            View All <span className="material-icons-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    </div>

                                    {/* Child category cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {sub.child_category.map(child => {
                                            const imgSrc = child.child_category_image_url || sub.sub_category_image_url || cat.main_category_image_url;
                                            return (
                                                <Link
                                                    key={child.child_category_id}
                                                    to={`/collections/${child.child_category_id}`}
                                                    className="group flex flex-col items-center"
                                                >
                                                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                                                        <img
                                                            src={imgSrc}
                                                            alt={child.child_category_name}
                                                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-700 text-center uppercase tracking-wider group-hover:text-primary transition-colors">
                                                        {child.child_category_name}
                                                    </p>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* ── Bestsellers ─────────────────────────────────────────────────── */}
            <section className="bg-white">
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>


                    <SectionHeading title="Best Sellers" subtitle="Styles our customers love the most." />
                    <div className="flex justify-center gap-3 mb-8">
                        <TabBtn active={activeBestsellerTab === 2} onClick={() => setActiveBestsellerTab(2)}>Women</TabBtn>
                        <TabBtn active={activeBestsellerTab === 1} onClick={() => setActiveBestsellerTab(1)}>Men</TabBtn>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                        {loading ? <Loader message="Loading Best Sellers..." /> : <ProductCarousel products={bestSellers[activeBestsellerTab]} />}
                    </div>
                </div>
            </section>

            {/* ── Brand Promise Strip ──────────────────────────────────────────── */}
            <section className="bg-slate-900 py-14 mb-0 border-b border-primary rounded-t-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: 'local_shipping', title: 'Free Shipping', sub: 'On orders above ₹999' },
                            { icon: 'verified', title: '100% Authentic', sub: 'Genuine ethnic wear' },
                            { icon: 'replay', title: 'Easy Returns', sub: '7-day hassle-free returns' },
                            { icon: 'support_agent', title: '24/7 Support', sub: 'Always here to help' },
                        ].map(item => (
                            <div key={item.title} className="flex flex-col items-center gap-3">
                                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <span className="material-icons-outlined text-2xl">{item.icon}</span>
                                </div>
                                <p className="font-normal text-white text-sm">{item.title}</p>
                                <p className="text-slate-400 text-xs">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Home;
