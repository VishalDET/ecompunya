import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartSummary, setCartSummary] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadCart = useCallback(async () => {
        setLoading(true);
        try {
            if (user) {
                // Fetch from API
                const response = await api.get(`CartProduct?UserId=${user.Id}`);
                if (response.data?.status_code === 100 && response.data.data) {
                    const data = response.data.data;
                    if (data.length > 0) {
                        const items = data.slice(0, data.length - 1);
                        const summary = data[data.length - 1];
                        setCartItems(items);
                        setCartSummary(summary);

                        // Count unique packages/products to match typical cart numbers, or sum of quantities
                        const count = items.reduce((sum, item) => sum + (item.Quantity || 1), 0);
                        setCartCount(count);
                    } else {
                        setCartItems([]);
                        setCartSummary(null);
                        setCartCount(0);
                    }
                } else {
                    setCartItems([]);
                    setCartSummary(null);
                    setCartCount(0);
                }
            } else {
                // Fetch from localStorage
                const localCart = JSON.parse(localStorage.getItem('kkds_guest_cart')) || [];
                setCartItems(localCart);
                const count = localCart.reduce((sum, item) => sum + (item.Quantity || 1), 0);
                setCartCount(count);

                // Calculate local summary
                const subTotal = localCart.reduce((sum, item) => sum + (item.SalePrice * (item.Quantity || 1)), 0);
                setCartSummary({
                    SubTotal: subTotal,
                    ShippingCharge: subTotal > 0 && subTotal < 999 ? 50 : 0,
                    Total: subTotal + (subTotal > 0 && subTotal < 999 ? 50 : 0),
                    TotalDiscountPercent: 0,
                    DiscountAmount: localCart.reduce((sum, i) => sum + ((i.Price - i.SalePrice) * (i.Quantity || 1)), 0),
                    GST: 0
                });
            }
        } catch (error) {
            console.error('Failed to load cart', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initialize cart whenever user changes
    useEffect(() => {
        loadCart();
    }, [loadCart]);

    // Sync guest cart to API when a user logs in
    useEffect(() => {
        const syncGuestCart = async () => {
            if (user) {
                const localCart = JSON.parse(localStorage.getItem('kkds_guest_cart')) || [];
                if (localCart.length > 0) {
                    for (const item of localCart) {
                        try {
                            await api.post('AddToCart', {
                                IsApp: 0,
                                UserId: user.Id,
                                ProductId: item.ProductId,
                                Quantity: item.Quantity,
                                PackageId: item.PackageId,
                                Price: item.Price,
                                SalePrice: item.SalePrice
                            });
                        } catch (err) {
                            console.error("Failed to sync local cart item", err);
                        }
                    }
                    localStorage.removeItem('kkds_guest_cart');
                    loadCart(); // Reload API cart to get fresh unified state
                }
            }
        };
        syncGuestCart();
    }, [user, loadCart]);

    const addToCart = async (productData, selectedSize, quantity) => {
        const packageId = selectedSize.Id || selectedSize.id;
        const salePrice = selectedSize.SalePrice || selectedSize.salePrice;
        const price = selectedSize.Price || selectedSize.price;

        if (user) {
            const requestData = {
                IsApp: 0,
                UserId: user.Id,
                ProductId: productData.ProductId || productData.productId,
                Quantity: quantity,
                PackageId: packageId,
                Price: price,
                SalePrice: salePrice
            };
            const response = await api.post('AddToCart', requestData);
            if (response.status === 200) {
                await loadCart();
                return true;
            }
            return false;
        } else {
            // Add to localStorage for guests
            const localCart = JSON.parse(localStorage.getItem('kkds_guest_cart')) || [];
            const existingItemIndex = localCart.findIndex(i => i.ProductId === (productData.ProductId || productData.productId) && i.PackageId === packageId);

            if (existingItemIndex > -1) {
                localCart[existingItemIndex].Quantity += quantity;
            } else {
                localCart.push({
                    ProductId: productData.ProductId || productData.productId,
                    PackageId: packageId,
                    ProductTitle: productData.ProductTitle || productData.productTitle,
                    MainImage: productData.MainImage || productData.mainImage,
                    Price: price,
                    SalePrice: salePrice,
                    Quantity: quantity,
                    Size: selectedSize.SizeText || selectedSize.sizeText || '',
                    Color: selectedSize.ColorText || selectedSize.colorText || selectedSize.ColorCode || selectedSize.colorCode || '',
                });
            }
            localStorage.setItem('kkds_guest_cart', JSON.stringify(localCart));
            loadCart();
            return true;
        }
    };

    const updateQuantity = async (productId, packageId, salePrice, currentQty, change) => {
        const newQty = Math.max(1, currentQty + change);
        if (user) {
            const requestData = {
                IsApp: 0,
                UserId: user.Id,
                ProductId: productId,
                Quantity: newQty,
                PackageId: packageId,
                Price: salePrice,
                SalePrice: salePrice
            };
            await api.post('AddToCart', requestData);
            await loadCart();
        } else {
            const localCart = JSON.parse(localStorage.getItem('kkds_guest_cart')) || [];
            const idx = localCart.findIndex(i => i.ProductId === productId && i.PackageId === packageId);
            if (idx > -1) {
                localCart[idx].Quantity = newQty;
                localStorage.setItem('kkds_guest_cart', JSON.stringify(localCart));
                loadCart();
            }
        }
    };

    const removeCartItem = async (productId, packageId) => {
        if (user) {
            await api.post('RemoveProduct', {
                UserId: user.Id,
                ProductId: productId,
                PackageId: packageId
            });
            await loadCart();
        } else {
            const localCart = JSON.parse(localStorage.getItem('kkds_guest_cart')) || [];
            const filtered = localCart.filter(i => !(i.ProductId === productId && i.PackageId === packageId));
            localStorage.setItem('kkds_guest_cart', JSON.stringify(filtered));
            loadCart();
        }
    };

    const value = {
        cartItems,
        cartSummary,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeCartItem,
        loadCart,
        fetchCartCount: loadCart, // Legacy mapping
        incrementCart: loadCart  // Legacy mapping
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
