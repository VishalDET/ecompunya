import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axiosConfig';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);

    const loadWishlist = useCallback(async () => {
        if (user) {
            try {
                const response = await api.post(`GetWishlistProduct?UserId=${user.Id || user.id}`);
                if (response.data?.status_code === 100 && response.data.data) {
                    setWishlistItems(response.data.data);
                } else {
                    setWishlistItems([]);
                }
            } catch (error) {
                console.error("Failed to load wishlist", error);
            }
        } else {
            const stored = localStorage.getItem('kkds_guest_wishlist');
            if (stored) {
                setWishlistItems(JSON.parse(stored));
            } else {
                setWishlistItems([]);
            }
        }
    }, [user]);

    // Load wishlist on mount or user change
    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);

    // Sync guest wishlist to user wishlist on login
    useEffect(() => {
        const syncGuestWishlist = async () => {
            if (user) {
                const guestWishlist = JSON.parse(localStorage.getItem('kkds_guest_wishlist')) || [];
                if (guestWishlist.length > 0) {
                    for (const item of guestWishlist) {
                        try {
                            await api.post('AddToWishlist', {
                                isApp: 0,
                                userId: user.Id || user.id || 0,
                                productId: item.ProductId,
                                quantity: 1,
                                packageId: item.PackageId || 0,
                                price: item.Price || 0,
                                salePrice: item.SalePrice || 0,
                                color: item.Color || '',
                                size: item.Size || ''
                            });
                        } catch (err) {
                            console.error("Failed to sync guest wishlist item", err);
                        }
                    }
                    localStorage.removeItem('kkds_guest_wishlist');
                    loadWishlist();
                }
            }
        };
        syncGuestWishlist();
    }, [user, loadWishlist]);

    const toggleWishlist = async (product) => {
        const prodId = product.ProductId || product.productId;
        const pkgId = product.PackageId || product.packageId || 0;

        if (user) {
            const exists = wishlistItems.some(item => Number(item.ProductId || item.productId) === Number(prodId));
            if (exists) {
                await api.post('RemoveWishlistProduct', {
                    userId: user.Id || user.id || 0,
                    productId: prodId,
                    packageId: pkgId
                });
            } else {
                await api.post('AddToWishlist', {
                    isApp: 0,
                    userId: user.Id || user.id || 0,
                    productId: prodId,
                    quantity: 1,
                    packageId: pkgId,
                    price: product.Price || product.price || 0,
                    salePrice: product.SalePrice || product.salePrice || 0,
                    color: product.Color || product.color || '',
                    size: product.Size || product.size || ''
                });
            }
            await loadWishlist();
            return !exists;
        } else {
            const guestWishlist = JSON.parse(localStorage.getItem('kkds_guest_wishlist')) || [];
            const existingIndex = guestWishlist.findIndex(item => Number(item.ProductId) === Number(prodId));
            let updated = [...guestWishlist];

            if (existingIndex > -1) {
                updated.splice(existingIndex, 1);
            } else {
                updated.push({
                    ProductId: prodId,
                    ProductTitle: product.ProductTitle || product.productTitle,
                    MainImage: product.MainImage || product.mainImage,
                    Price: product.Price || product.price || 0,
                    SalePrice: product.SalePrice || product.salePrice || 0,
                    DiscountPercent: product.Price > 0 ? Math.round(((product.Price - product.SalePrice) / product.Price) * 100) : 0,
                    Color: product.Color || product.color || '',
                    Size: product.Size || product.size || '',
                    PackageId: pkgId
                });
            }

            localStorage.setItem('kkds_guest_wishlist', JSON.stringify(updated));
            setWishlistItems(updated);
            return existingIndex === -1;
        }
    };

    const removeFromWishlist = async (productId, packageId = 0) => {
        if (user) {
            await api.post('RemoveWishlistProduct', {
                userId: user.Id || user.id || 0,
                productId: productId,
                packageId: packageId
            });
            await loadWishlist();
        } else {
            const guestWishlist = JSON.parse(localStorage.getItem('kkds_guest_wishlist')) || [];
            const filtered = guestWishlist.filter(item => Number(item.ProductId) !== Number(productId));
            localStorage.setItem('kkds_guest_wishlist', JSON.stringify(filtered));
            setWishlistItems(filtered);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => Number(item.ProductId || item.productId) === Number(productId));
    };

    const value = {
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        loadWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
