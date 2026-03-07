import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import axios from '../../api/axiosConfig';

const Header = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const [categories, setCategories] = useState([]);
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
    const collectionsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Get hierarchical categories
                const response = await axios.post('/GetCategoryView');
                if (response.data && response.data.status_code === 100 && response.data.data) {
                    setCategories(response.data.data);
                } else if (Array.isArray(response.data)) {
                    // Fallback for flat array if API is old/different
                    setCategories(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
                // Fallback categories if API fails
                setCategories([
                    { CategoryId: 1, CategoryName: 'Men' },
                    { CategoryId: 2, CategoryName: 'Women' }
                ]);
            }
        };
        fetchCategories();
    }, []);

    // Close collections menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (collectionsRef.current && !collectionsRef.current.contains(e.target)) {
                setCollectionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCategoryClick = (categoryId) => {
        setCollectionsOpen(false);
        navigate(`/collections/${categoryId}`);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Mobile Menu Button - Premium Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 -ml-2 md:hidden group flex flex-col gap-1.5 justify-center items-center w-10 h-10 rounded-full hover:bg-slate-50 transition-colors"
                        aria-label="Menu"
                    >
                        <span className="w-5 h-0.5 bg-slate-600 rounded-full transition-all group-hover:bg-primary"></span>
                        <span className="w-5 h-0.5 bg-slate-600 rounded-full transition-all group-hover:bg-primary"></span>
                        <span className="w-5 h-0.5 bg-slate-600 rounded-full transition-all group-hover:bg-primary"></span>
                    </button>

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img
                                src="/assets/img/logo/punya_logo.png"
                                alt="Punya Logo"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        {/* Collections Mega Menu */}
                        <Link to="/" onClick={() => setCollectionsOpen(false)} className="text-sm font-medium hover:text-primary transition-colors py-8 text-slate-900">HOME</Link>

                        <div
                            className="relative"
                            ref={collectionsRef}
                            onMouseEnter={() => setCollectionsOpen(true)}
                            onMouseLeave={() => setCollectionsOpen(false)}
                        >
                            <button
                                onClick={() => setCollectionsOpen(o => !o)}
                                className={`flex items-center text-sm font-medium transition-colors py-8 uppercase ${collectionsOpen ? 'text-primary' : 'text-slate-900 hover:text-primary'}`}
                            >
                                COLLECTIONS
                                <span className={`material-icons-outlined text-sm ml-1 transition-transform duration-200 ${collectionsOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>

                            {/* Mega Menu Dropdown */}
                            {collectionsOpen && categories.length > 0 && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-[950px] bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden flex transition-all duration-300">
                                    <div className="flex-1 p-8 grid grid-cols-2 gap-10">
                                        {categories.map((mainCat) => (
                                            <div key={mainCat.main_category_id} className="space-y-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {mainCat.main_category_image_url && (
                                                        <img
                                                            src={mainCat.main_category_image_url}
                                                            alt=""
                                                            className="w-10 h-10 rounded-full object-cover bg-slate-50 border border-slate-100 shadow-sm"
                                                        />
                                                    )}
                                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">
                                                        {mainCat.main_category_name}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 gap-8">
                                                    {mainCat.sub_categories?.map((subCat) => (
                                                        <div key={subCat.sub_category_id}>
                                                            <h4 className="text-xs font-black font-bold text-primary uppercase tracking-[0.15em] my-2 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                                                {subCat.sub_category_name}
                                                            </h4>
                                                            <ul className="space-y-2.5">
                                                                {subCat.child_category?.map((child) => (
                                                                    <li key={child.child_category_id}>
                                                                        <button
                                                                            onClick={() => handleCategoryClick(child.child_category_id)}
                                                                            className="group flex items-center text-[13px] font-medium text-slate-500 hover:text-primary transition-all duration-200"
                                                                        >
                                                                            <span className="w-0 group-hover:w-2 h-[1.5px] bg-primary transition-all duration-300 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100"></span>
                                                                            {child.child_category_name}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Sidebar Promo Area */}
                                    <div className="w-64 bg-slate-50 p-6 flex flex-col justify-between border-l border-slate-100">
                                        <div>
                                            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Trending Now</h5>
                                            <div className="space-y-4">
                                                <div className="group cursor-pointer">
                                                    <div className="aspect-square rounded-lg bg-orange-100 mb-2 overflow-hidden">
                                                        <img src="https://admin.synfo.shop/kkds_img/assets/img/products/MAN.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Promo" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-800">New Festive Arrival</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                                            <p className="text-[10px] font-bold text-primary uppercase mb-1">Limited Offer</p>
                                            <p className="text-xs font-medium text-slate-600">Flat 20% OFF on first order</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/about" onClick={() => setCollectionsOpen(false)} className="text-sm font-medium hover:text-primary transition-colors py-8 text-slate-900 uppercase">OUR STORY</Link>

                    </nav>
                    {/* Right Icons */}
                    <div className="flex items-center space-x-2">
                        <div className="relative hidden sm:block">
                            <input
                                className="w-48 lg:w-64 pl-10 pr-4 py-2 text-sm rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-primary focus:outline-none transition-all text-slate-900 placeholder-slate-400"
                                placeholder="Search..."
                                type="text"
                            />
                            <span className="material-icons-outlined absolute left-3 top-2 text-slate-400 text-lg pointer-events-none">search</span>
                        </div>



                        {/* User Account/Login */}
                        <div className="relative group cursor-pointer inline-flex">
                            <button className="p-2 hover:text-primary rounded-full transition-colors text-slate-700">
                                <span className="material-icons-outlined text-xl">{user ? 'person' : 'perm_identity'}</span>
                            </button>

                            {/* Account Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                {user ? (
                                    <div className="p-2 border-t border-slate-100">
                                        <div className="px-4 py-2 text-sm text-slate-900 font-semibold border-b border-slate-100 mb-2">
                                            Hi, {user.WebUserName}
                                        </div>
                                        <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-primary transition-colors">
                                            <span className="material-icons-outlined text-sm">manage_accounts</span> My Dashboard
                                        </Link>
                                        <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-primary transition-colors">
                                            <span className="material-icons-outlined text-sm">shopping_bag</span> My Orders
                                        </Link>
                                        <Link to="/account/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-primary transition-colors">
                                            <span className="material-icons-outlined text-sm">person</span> My Profile
                                        </Link>
                                        <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1">
                                            <span className="material-icons-outlined text-sm">logout</span> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-primary transition-colors">
                                            <span className="material-icons-outlined text-sm">login</span> Login / Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Link to="/wishlist" className="p-2 hover:text-primary rounded-full transition-colors relative text-slate-700 hidden sm:inline-flex">
                            <span className="material-icons-outlined text-xl">favorite_border</span>
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="p-2 hover:text-primary rounded-full transition-colors relative text-slate-700">
                            <span className="material-icons-outlined text-xl">shopping_bag</span>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="absolute inset-y-0 left-0 w-[300px] bg-white shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <img src="/assets/img/logo/punya_logo.png" className="h-8" alt="Logo" />
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-primary transition-colors">
                                <span className="material-icons-outlined text-xl">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4">
                            <nav className="px-4 space-y-1 mb-8">
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
                                    <span className="material-icons-outlined text-sm">home</span> HOME
                                </Link>
                                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
                                    <span className="material-icons-outlined text-sm">history_edu</span> OUR STORY
                                </Link>
                            </nav>

                            <div className="px-4">
                                <h4 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Collections</h4>
                                <div className="space-y-2">
                                    {categories.map((mainCat) => (
                                        <div key={mainCat.main_category_id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                            <button
                                                onClick={() => setMobileExpandedCat(mobileExpandedCat === mainCat.main_category_id ? null : mainCat.main_category_id)}
                                                className="w-full flex items-center justify-between p-4 text-sm font-bold text-slate-900"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {mainCat.main_category_image_url && <img src={mainCat.main_category_image_url} className="w-6 h-6 rounded-full object-cover" alt="" />}
                                                    {mainCat.main_category_name}
                                                </div>
                                                <span className={`material-icons-outlined text-sm transition-transform duration-300 ${mobileExpandedCat === mainCat.main_category_id ? 'rotate-180' : ''}`}>expand_more</span>
                                            </button>

                                            {mobileExpandedCat === mainCat.main_category_id && (
                                                <div className="px-4 pb-4 space-y-4">
                                                    {mainCat.sub_categories?.map((subCat) => (
                                                        <div key={subCat.sub_category_id}>
                                                            <h5 className="text-[10px] font-black text-primary uppercase tracking-wider mb-2 px-2">{subCat.sub_category_name}</h5>
                                                            <ul className="space-y-1">
                                                                {subCat.child_category?.map((child) => (
                                                                    <li key={child.child_category_id}>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleCategoryClick(child.child_category_id);
                                                                                setMobileMenuOpen(false);
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                                                                        >
                                                                            {child.child_category_name}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100">
                            {user ? (
                                <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold transition-colors">
                                    <span className="material-icons-outlined text-sm">logout</span> Logout
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                                    <span className="material-icons-outlined text-sm">login</span> Login / Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
