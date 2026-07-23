import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

const ProductCarousel = ({ products }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const autoScrollTimer = useRef(null);

    const checkScrollability = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScrollability();
        el.addEventListener('scroll', checkScrollability, { passive: true });
        window.addEventListener('resize', checkScrollability);
        return () => {
            el.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
        };
    }, [products, checkScrollability]);

    const CARD_WIDTH = 280; // approx card width + gap

    const scrollBy = useCallback((direction) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: direction * CARD_WIDTH * 2, behavior: 'smooth' });
    }, []);

    // Auto-scroll every 4s
    useEffect(() => {
        if (!products || products.length <= 4) return;

        const startAutoScroll = () => {
            autoScrollTimer.current = setInterval(() => {
                const el = scrollRef.current;
                if (!el) return;
                const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
                if (atEnd) {
                    el.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    el.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
                }
            }, 4000);
        };

        startAutoScroll();
        return () => clearInterval(autoScrollTimer.current);
    }, [products]);

    const pauseAutoScroll = () => clearInterval(autoScrollTimer.current);

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <span className="material-icons-outlined text-5xl mb-3 block">inventory_2</span>
                <p className="text-sm">No products available.</p>
            </div>
        );
    }

    return (
        <div className="relative group/carousel"
            onMouseEnter={pauseAutoScroll}
        >
            {/* Left Arrow */}
            <button
                onClick={() => scrollBy(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous products"
                className={`
                    absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                    h-11 w-11 rounded-full bg-white shadow-xl border border-slate-100
                    flex items-center justify-center text-slate-700
                    hover:bg-primary hover:text-white hover:border-primary
                    transition-all duration-200
                    disabled:opacity-0 disabled:pointer-events-none
                    opacity-0 group-hover/carousel:opacity-100
                `}
            >
                <span className="material-icons-outlined text-xl">chevron_left</span>
            </button>

            {/* Scrollable Track */}
            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 pt-2 px-1 snap-x snap-mandatory scroll-smooth"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {products.map((item) => {
                    const originalPrice = item.Price || 0;
                    const salePrice = item.SalePrice || 0;
                    const discountPercent = originalPrice > 0
                        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
                        : 0;

                    return (
                        <div
                            key={item.ProductId}
                            className="product-card group flex-shrink-0 w-52 md:w-64 snap-start relative"
                        >
                            {/* Image area */}
                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                                <Link to={`/product/${item.ProductId}`}>
                                    <img
                                        src={item.MainImage}
                                        alt={item.ProductTitle}
                                        className="h-full w-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                </Link>

                                {discountPercent > 0 && (
                                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wider">
                                        {discountPercent}% OFF
                                    </div>
                                )}

                                <button
                                    onClick={() => toggleWishlist(item)}
                                    className={`absolute top-3 right-3 h-9 w-9 flex items-center justify-center rounded-full transition-colors shadow-sm outline-none
                                        ${isInWishlist(item.ProductId || item.productId)
                                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                            : 'bg-white/90 text-slate-700 hover:text-red-500'
                                        }`}
                                    title={isInWishlist(item.ProductId || item.productId) ? "Remove from Wishlist" : "Add to Wishlist"}
                                >
                                    <span className={`material-icons-outlined text-base ${isInWishlist(item.ProductId || item.productId) ? 'material-icons' : ''}`}>
                                        {isInWishlist(item.ProductId || item.productId) ? 'favorite' : 'favorite_border'}
                                    </span>
                                </button>

                                {/* Quick view overlay */}
                                <div className="quick-add absolute inset-x-3 bottom-6 opacity-0 transform translate-y-3 transition-all duration-300">
                                    <Link
                                        to={`/product/${item.ProductId}`}
                                        className="block w-full text-center bg-primary text-white py-2.5 rounded-lg text-xs font-bold shadow-xl hover:bg-orange-600 transition-colors uppercase tracking-widest"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-3 px-1">
                                <Link
                                    to={`/product/${item.ProductId}`}
                                    className="block text-sm font-semibold text-slate-800 line-clamp-1 hover:text-primary transition-colors font-display"
                                >
                                    {item.ProductTitle}
                                </Link>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="font-bold text-primary">₹{salePrice.toLocaleString('en-IN')}</span>
                                    {discountPercent > 0 && (
                                        <span className="text-xs text-slate-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <button
                onClick={() => scrollBy(1)}
                disabled={!canScrollRight}
                aria-label="Next products"
                className={`
                    absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
                    h-11 w-11 rounded-full bg-white shadow-xl border border-slate-100
                    flex items-center justify-center text-slate-700
                    hover:bg-primary hover:text-white hover:border-primary
                    transition-all duration-200
                    disabled:opacity-0 disabled:pointer-events-none
                    opacity-0 group-hover/carousel:opacity-100
                `}
            >
                <span className="material-icons-outlined text-xl">chevron_right</span>
            </button>

            {/* Hide scrollbar via style tag */}
            <style>{`.product-card:hover .quick-add { opacity:1; transform:translateY(0); }`}</style>
        </div>
    );
};

export default ProductCarousel;
