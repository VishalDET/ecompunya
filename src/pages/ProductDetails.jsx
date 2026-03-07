import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCarousel from '../components/home/ProductCarousel';
import Loader from '../components/common/Loader';

const ProductDetails = () => {
    const { productId } = useParams();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cartError, setCartError] = useState('');
    const [cartSuccess, setCartSuccess] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // Fetch product details
                const userId = user?.Id || 0;
                const userType = user?.UserType || 0;

                // GetProductsAndPackagesByProductId equivalent
                const response = await api.post(`GetProductsAndPackagesByProductId?ProductId=${productId}&UserId=${userId}&UserType=${userType}`, {
                    ProductId: parseInt(productId),
                    UserId: userId,
                    UserType: userType
                });

                if (response.data?.data && response.data.data.length > 0) {
                    const pData = response.data.data[0];
                    console.log('[ProductDetails] API data:', pData); // debug
                    setProduct(pData);
                    setMainImage(pData.MainImage || pData.mainImage);

                    // Auto-select first size if available
                    const packages = getFranchisePackages(pData);
                    if (packages.length > 0 && packages[0].Packages?.length > 0) {
                        setSelectedSize(packages[0].Packages[0]);
                        setSelectedColor(packages[0].ColorCode || packages[0].colorCode);
                    } else if (packages.length > 0 && packages[0].packages?.length > 0) {
                        setSelectedSize(packages[0].packages[0]);
                        setSelectedColor(packages[0].ColorCode || packages[0].colorCode);
                    }
                }

                // Related products fetch mock - since it's not super clear from .cshtml we'll just fetch a few bestsellers as related
                const relatedRes = await api.get('GetBestseller?Id=1');
                if (relatedRes.data?.data) {
                    setRelatedProducts(relatedRes.data.data);
                }

            } catch (error) {
                console.error("Error fetching product details", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductData();
        }
    }, [productId, user]);

    // Handle both camelCase (ASP.NET default) and PascalCase field names
    const getFranchisePackages = (p) => {
        return p?.FranchisePackage || p?.franchisePackage || [];
    };

    const getPkgList = (franchise) => {
        return franchise?.Packages || franchise?.packages || [];
    };

    const getField = (obj, pascalKey, camelKey) => obj?.[pascalKey] ?? obj?.[camelKey];

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setCartError('Please select a size to continue.');
            return;
        }
        setCartError('');
        try {
            const success = await addToCart(product, selectedSize, quantity);
            if (success) {
                setCartSuccess(true);
                setTimeout(() => setCartSuccess(false), 3000);
            } else {
                setCartError('Failed to add to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to cart', error);
            setCartError('Failed to add to cart. Please try again.');
        }
    };

    if (loading) return <Loader fullScreen message="Loading product details..." />;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-slate-500">Product not found</div>;

    const franchisePackages = getFranchisePackages(product);
    const images = [
        getField(product, 'MainImage', 'mainImage'),
        getField(product, 'OtherImage1', 'otherImage1'),
        getField(product, 'OtherImage2', 'otherImage2'),
        getField(product, 'OtherImage3', 'otherImage3')
    ].filter(Boolean);
    const price = getField(product, 'Price', 'price') || 0;
    const salePrice = getField(product, 'SalePrice', 'salePrice') || 0;
    const discountPercent = price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">

                {/* Product Area */}
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">

                    {/* Left: Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24">
                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-hide py-1 px-1">
                            {images.map((imgUrl, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMainImage(imgUrl)}
                                    className={`relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 outline-none
                                        ${mainImage === imgUrl ? 'border-punya-orange shadow-md' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={imgUrl} alt={`Thumbnail ${i}`} className="w-full h-full object-cover object-top" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-none rounded-2xl overflow-hidden flex items-center justify-center relative shadow-none border border-gray-100 group">
                            <img
                                src={mainImage}
                                alt={product.ProductTitle}
                                className="w-full h-auto max-h-[500px] object-contain object-center group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            {discountPercent > 0 && (
                                <div className="absolute top-6 left-6 bg-punya-orange text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                    {discountPercent}% OFF
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2 tracking-tight font-display">
                                {getField(product, 'ProductTitle', 'productTitle')}
                            </h1>
                            <p className="text-gray-500 text-sm">Product Code: <span className="font-medium text-gray-700">{getField(product, 'ProductCode', 'productCode') || 'N/A'}</span></p>
                        </div>

                        {/* Price Area */}
                        <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
                            <span className="text-3xl font-bold text-primary tracking-tight">₹{salePrice.toLocaleString('en-IN')}</span>
                            {price > salePrice && (
                                <span className="text-lg text-gray-400 line-through mb-1">₹{price.toLocaleString('en-IN')}</span>
                            )}
                            {discountPercent > 0 && (
                                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{discountPercent}% OFF</span>
                            )}
                        </div>

                        {/* Attributes: Colors & Sizes */}
                        {franchisePackages.length > 0 ? (
                            franchisePackages.map((franchise, idx) => {
                                const pkgList = getPkgList(franchise);
                                const colorCode = getField(franchise, 'ColorCode', 'colorCode');
                                const colorText = getField(franchise, 'ColorText', 'colorText');
                                return (
                                    <div key={idx} className="mb-6">
                                        {/* Color Selection */}
                                        {colorCode && (
                                            <div className="mb-5">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                                    Color: <span className="text-gray-900 ml-1">{colorText || colorCode}</span>
                                                </h4>
                                                <div className="flex flex-wrap gap-3">
                                                    <button
                                                        onClick={() => setSelectedColor(colorCode)}
                                                        className={`w-6 h-6 rounded-full transition-all duration-200 outline-none ${selectedColor === colorCode
                                                            ? 'ring-2 ring-offset-2 ring-primary shadow-md scale-110'
                                                            : 'ring-1 ring-gray-200 hover:ring-gray-400'
                                                            }`}
                                                        style={{ backgroundColor: colorCode }}
                                                        title={colorText || colorCode}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Size Selection */}
                                        {pkgList.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex justify-between items-center">
                                                    <span>Size</span>
                                                    <button className="text-primary text-xs normal-case tracking-normal hover:underline">Size Chart</button>
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {pkgList.map((pkg) => {
                                                        const pkgId = getField(pkg, 'Id', 'id');
                                                        const sizeLabel = getField(pkg, 'SizeText', 'sizeText') || getField(pkg, 'PackageName', 'packageName') || `#${pkgId}`;
                                                        const isSelected = selectedSize && (getField(selectedSize, 'Id', 'id') === pkgId);
                                                        return (
                                                            <button
                                                                key={pkgId}
                                                                onClick={() => { setSelectedSize(pkg); setCartError(''); }}
                                                                className={`min-w-[2.5rem] px-2 py-1 rounded-lg font-semibold text-sm transition-all duration-200 border ${isSelected
                                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-slate-700 hover:text-slate-900'
                                                                    }`}
                                                            >
                                                                {sizeLabel}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-slate-400 italic mb-6">No size/color options available for this product.</p>
                        )}

                        {/* Add to Cart Area */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
                            {/* Quantity */}
                            <div className="flex items-center justify-between border border-gray-300 rounded-full bg-white h-14 px-2 w-full sm:w-36 flex-shrink-0">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-full transition-colors text-xl font-medium outline-none">−</button>
                                <span className="w-10 text-center font-bold text-gray-800 select-none">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-full transition-colors text-xl font-medium outline-none">+</button>
                            </div>

                            {/* Wishlist Button */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 outline-none flex-shrink-0 ${isInWishlist(product.ProductId)
                                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 shadow-sm'
                                    : 'bg-white border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                                    }`}
                                title={isInWishlist(product.ProductId) ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                <span className={`material-icons-outlined text-2xl ${isInWishlist(product.ProductId) ? 'material-icons' : ''}`}>
                                    {isInWishlist(product.ProductId) ? 'favorite' : 'favorite_border'}
                                </span>
                            </button>

                            {/* Add Button */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-primary hover:bg-orange-600 text-white h-14 rounded-full font-bold text-base shadow-md hover:shadow-lg transition-all duration-300 outline-none active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined text-xl">shopping_bag</span>
                                Add To Cart
                            </button>
                        </div>

                        {/* Success / Error messages */}
                        {cartSuccess && (
                            <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm font-medium">
                                <span className="material-icons-outlined text-base">check_circle</span>
                                Added to cart successfully!
                            </div>
                        )}
                        {cartError && (
                            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium">
                                <span className="material-icons-outlined text-base">error_outline</span>
                                {cartError}
                            </div>
                        )}

                        {/* Description */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h4 className="text-lg font-bold text-gray-900 mb-4">Product Details</h4>
                            <div
                                className="prose prose-sm md:prose-base prose-gray max-w-none text-gray-600 space-y-4"
                                dangerouslySetInnerHTML={{ __html: product.Description }}
                            />
                        </div>

                        {/* Features List Optional */}
                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>100% Authentic</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 pt-12 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-center text-punya-dark mb-8">You May Also Like</h2>
                        <ProductCarousel products={relatedProducts} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
