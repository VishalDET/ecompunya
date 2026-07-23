import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const formatPrice = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    const handleMoveToCart = async (item) => {
        // Move requires a default size - in this case since wishlist might save just product level, 
        // we'll attempt to send it to the details page if size is needed, or just add if we had a default package.
        // For simplicity, let's link them to the product details to select size.
    };

    return (
        <main className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-xl font-normal text-gray-900 mb-8 border-b border-gray-200 pb-2">
                    Your Wishlist {wishlistItems.length > 0 && <span className="text-gray-500 text-md font-normal">({wishlistItems.length} items)</span>}
                </h2>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems.map(item => {
                            const productId = item.ProductId || item.productId;
                            const title = item.ProductTitle || item.productTitle;
                            const mainImage = item.MainImage || item.mainImage;
                            const price = item.Price || item.price || 0;
                            const salePrice = item.SalePrice || item.salePrice || 0;
                            const discountPercent = item.DiscountPercent || item.discountPercent || 0;
                            const packageId = item.PackageId || item.packageId || 0;

                            return (
                                <div key={productId} className="bg-none rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                                    <div className="relative aspect-[3/4] bg-gray-50 flex items-center justify-center p-4">
                                        <Link to={`/product/${productId}`} className="block w-full h-full">
                                            <img src={mainImage} alt={title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                                        </Link>
                                        <button
                                            onClick={() => removeFromWishlist(productId, packageId)}
                                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                                            title="Remove from wishlist"
                                        >
                                            <span className="material-icons-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">
                                            <Link to={`/product/${productId}`} className="hover:text-primary transition-colors">
                                                {title}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-lg font-bold text-primary">₹{formatPrice(salePrice)}</span>
                                            {price > salePrice && (
                                                <span className="text-xs text-gray-400 line-through">₹{formatPrice(price)}</span>
                                            )}
                                            {discountPercent > 0 && (
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{discountPercent}% OFF</span>
                                            )}
                                        </div>
                                        <Link
                                            to={`/product/${productId}`}
                                            className="w-full block text-center border border-primary text-primary hover:bg-primary hover:text-white py-2 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            SELECT SIZE
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <span className="material-icons-outlined text-4xl text-red-300">favorite_border</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Save your favorite items here to easily find and purchase them later.</p>
                        <Link to="/" className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]">
                            Discover Fashion
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Wishlist;
