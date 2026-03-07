import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);

    // We'll primarily use localStorage for the wishlist since the .NET API endpoints
    // for wishlist weren't fully identified in the previous implementation,
    // but this structure allows easy swapping to API calls later if defined.

    const storageKey = user ? `kkds_wishlist_${user.Id}` : 'kkds_guest_wishlist';

    // Load wishlist
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setWishlistItems(JSON.parse(stored));
        } else {
            setWishlistItems([]);
        }
    }, [storageKey]);

    // Sync guest wishlist to user wishlist on login
    useEffect(() => {
        if (user) {
            const guestWishlist = JSON.parse(localStorage.getItem('kkds_guest_wishlist')) || [];
            if (guestWishlist.length > 0) {
                const userKey = `kkds_wishlist_${user.Id}`;
                const userWishlist = JSON.parse(localStorage.getItem(userKey)) || [];

                // Merge avoiding duplicates
                const merged = [...userWishlist];
                guestWishlist.forEach(item => {
                    if (!merged.some(m => m.ProductId === item.ProductId)) {
                        merged.push(item);
                    }
                });

                localStorage.setItem(userKey, JSON.stringify(merged));
                setWishlistItems(merged);
                localStorage.removeItem('kkds_guest_wishlist');
            }
        }
    }, [user]);

    const toggleWishlist = (product) => {
        let current = [...wishlistItems];
        const existingIndex = current.findIndex(item => item.ProductId === product.ProductId);

        if (existingIndex > -1) {
            current.splice(existingIndex, 1);
        } else {
            current.push({
                ProductId: product.ProductId,
                ProductTitle: product.ProductTitle,
                MainImage: product.MainImage,
                Price: product.Price,
                SalePrice: product.SalePrice,
                DiscountPercent: product.Price > 0 ? Math.round(((product.Price - product.SalePrice) / product.Price) * 100) : 0,
                // store default package/size info if needed later
            });
        }

        setWishlistItems(current);
        localStorage.setItem(storageKey, JSON.stringify(current));
        return existingIndex === -1; // returns true if added, false if removed
    };

    const removeFromWishlist = (productId) => {
        const current = wishlistItems.filter(item => item.ProductId !== productId);
        setWishlistItems(current);
        localStorage.setItem(storageKey, JSON.stringify(current));
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.ProductId === productId);
    };

    const value = {
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
