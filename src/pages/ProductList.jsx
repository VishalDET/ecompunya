import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const ProductList = () => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();

    // Data states
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('All Products');
    const [categoryDescription, setCategoryDescription] = useState('Explore our curated collection of premium ethnic wear.');

    // Filter states
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(10000);
    const [sortBy, setSortBy] = useState('1'); // 1=newness/popularity based on old logic

    const fetchProducts = useCallback(async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const userType = user?.UserType || 0;
            const colorStr = selectedColors.join(',');
            const sizeStr = selectedSizes.join(',');
            // The old code sends categoryId, colors, sizes, priceMin, priceMax, UserType
            const url = `GetFilterProducts?categoryId=${categoryId}&colors=${colorStr}&sizes=${sizeStr}&priceMin=${priceMin}&priceMax=${priceMax}&productTitle=&UserType=${userType}`;

            const response = await api.get(url);
            if (response.data && response.data.status_code === 100) {
                setProducts(response.data.data.products || []);

                // Update filters if they aren't set yet
                if (colors.length === 0) setColors(response.data.data.colors || []);
                if (sizes.length === 0) setSizes(response.data.data.sizes || []);

                if (response.data.data.products?.length > 0) {
                    const firstProduct = response.data.data.products[0];
                    setCategoryName(firstProduct.CategoryName || 'Products');

                    // Dynamic description mapping
                    const descriptions = {
                        'SAREE': 'Drape yourself in centuries of tradition and elegance.',
                        'KURTA': 'Classic silhouettes meeting modern craft for the contemporary man.',
                        'MEN': 'Refined ethnic wear for the modern gentleman.',
                        'WOMEN': 'Timeless elegance for every special occasion.',
                        'LEHENGA': 'Celebratory ensembles that capture the essence of tradition.',
                        'ACCESSORIES': 'The perfect finishing touches for your ethnic look.'
                    };
                    const upperCat = (firstProduct.CategoryName || '').toUpperCase();
                    setCategoryDescription(descriptions[upperCat] || 'Premium collection designed for timeless style.');
                }

                // Simple frontend calculation for pages assuming pageSize=12
                const totalItems = (response.data.data.products || []).length;
                setTotalPages(Math.ceil(totalItems / 12) || 1);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching filtered products", error);
            setProducts([]);
        } finally {
            setLoading(false); // Set loading to false after fetching (success or error)
        }
    }, [categoryId, user, selectedColors, selectedSizes, priceMin, priceMax, sortBy, colors.length, sizes.length]); // Added sortBy but currently sorting happens on frontend or backend depending on API details. Old API accepted it as query param or applied purely frontend in .cs

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, currentPage]);

    const handleColorToggle = (colorId) => {
        setSelectedColors(prev =>
            prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]
        );
    };

    const handleSizeToggle = (sizeId) => {
        setSelectedSizes(prev =>
            prev.includes(sizeId) ? prev.filter(s => s !== sizeId) : [...prev, sizeId]
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSearchParams({ page });
    };

    // Apply front-end pagination since the API returns all products and old .cs did Skip/Take
    const pageSize = 12;
    const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (loading && products.length === 0) {
        return <Loader fullScreen message="Loading products..." />;
    }

    return (
        <div className="bg-white min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex text-sm text-slate-500 mb-8 items-center space-x-2">
                    <Link className="hover:text-primary" to="/">Home</Link>
                    <span className="material-icons-outlined text-xs">chevron_right</span>
                    <Link className="hover:text-primary" to="/product-list/all">Collections</Link>
                    <span className="material-icons-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 font-medium uppercase">{categoryName}</span>
                </nav>

                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 text-slate-900 uppercase">{categoryName}</h1>
                        <p className="text-slate-600 italic">{categoryDescription}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500">{products.length} items</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 text-slate-900 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-primary focus:border-primary outline-none transition-colors"
                            >
                                <option value="1">Sort by: Popularity</option>
                                <option value="2">New Arrivals</option>
                                <option value="4">Price: Low to High</option>
                                <option value="5">Price: High to Low</option>
                            </select>
                            <span className="material-icons-outlined absolute right-3 top-2.5 text-sm pointer-events-none text-slate-500">expand_more</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
                        {/* Price Filter (Adapted to look like the design, while keeping manual input functional based on original logic, but visually using the design's radio style if possible. The design used radios, we will use the existing min/max but style it cleanly) */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 text-slate-900">Price Range</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <input type="number" value={priceMin} onChange={e => setPriceMin(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 bg-white text-slate-900 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors" placeholder="Min" />
                                <span className="text-slate-400">-</span>
                                <input type="number" value={priceMax} onChange={e => setPriceMax(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 bg-white text-slate-900 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors" placeholder="Max" />
                            </div>
                            <button onClick={fetchProducts} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-2 rounded-lg text-xs font-bold transition-colors">Apply Price</button>
                        </div>

                        {/* Color Filter */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 text-slate-900">Color</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                {colors.map(color => (
                                    <label key={color.ProductId} className="flex items-center group cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded text-primary focus:ring-primary h-4 w-4 border-slate-300 bg-white transition-colors"
                                            checked={selectedColors.includes(color.ProductId)}
                                            onChange={() => handleColorToggle(color.ProductId)}
                                        />
                                        <span className={`ml-3 text-sm group-hover:text-primary transition-colors ${selectedColors.includes(color.ProductId) ? 'text-primary font-medium' : 'text-slate-600'} `}>
                                            {color.Color}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 text-slate-900">Sizes</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                {sizes.map(size => (
                                    <label key={size.Id} className="flex items-center group cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded text-primary focus:ring-primary h-4 w-4 border-slate-300 bg-white transition-colors"
                                            checked={selectedSizes.includes(size.Id)}
                                            onChange={() => handleSizeToggle(size.Id)}
                                        />
                                        <span className={`ml-3 text-sm group-hover:text-primary transition-colors ${selectedSizes.includes(size.Id) ? 'text-primary font-medium' : 'text-slate-600'} `}>
                                            {size.Size}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => { setPriceMin(0); setPriceMax(10000); setSelectedColors([]); setSelectedSizes([]); }}
                                className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                            >
                                CLEAR ALL
                            </button>
                        </div>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-1">
                        {paginatedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                                {paginatedProducts.map(product => {
                                    const origPrice = product.Price || 0;
                                    const salePrice = product.SalePrice || 0;
                                    const discount = Math.round(((origPrice - salePrice) / origPrice) * 100);

                                    return (
                                        <div key={product.ProductId} className="product-card group relative">
                                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                                                <Link to={`/product/${product.ProductId} `}>
                                                    <img
                                                        src={product.MainImage}
                                                        alt={product.ProductTitle}
                                                        className="h-full w-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </Link>

                                                {discount > 0 && (
                                                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold tracking-widest rounded-full shadow-sm">
                                                        {discount}% OFF
                                                    </div>
                                                )}

                                                <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-slate-900 hover:text-red-500 transition-colors shadow-sm">
                                                    <span className="material-icons-outlined text-lg">favorite_border</span>
                                                </button>

                                                <div className="quick-add absolute inset-x-4 bottom-6 opacity-0 transform translate-y-4 transition-all duration-300">
                                                    <Link to={`/product/${product.ProductId} `} className="block w-full text-center bg-primary text-white py-1 md:py-3 rounded-lg text-xs font-bold shadow-xl hover:bg-orange-600 transition-colors uppercase tracking-widest">
                                                        VIEW DETAILS
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">{product.CategoryName || 'Saree'}</h3>
                                                    <Link to={`/product/${product.ProductId} `}>
                                                        <p className="text-base font-display font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1">{product.ProductTitle}</p>
                                                    </Link>
                                                </div>
                                                <div className="text-right pl-4 shrink-0">
                                                    <p className="text-base font-bold text-primary">₹{salePrice}</p>
                                                    {discount > 0 && (
                                                        <p className="text-[10px] text-slate-400 line-through">₹{origPrice}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Dummy color swatches for design fidelity, would be dynamic in full implementation */}
                                            <div className="mt-2 flex space-x-2">
                                                <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-200"></span>
                                                <span className="w-3 h-3 rounded-full bg-red-700 border border-slate-200"></span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                                <span className="material-icons-outlined text-6xl text-slate-300 mb-4">search_off</span>
                                <h3 className="text-xl font-display font-bold text-slate-700 mb-2">No products found</h3>
                                <p className="text-slate-500 max-w-sm">We couldn't find any products matching your current filter selection. Try adjusting your filters.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50"
                                >
                                    <span className="material-icons-outlined">chevron_left</span>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`h-10 w-10 flex items-center justify-center rounded-lg transition-colors font-bold ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            } `}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50"
                                >
                                    <span className="material-icons-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductList;
