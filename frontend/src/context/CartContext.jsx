import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('surya_stores_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to parse cart storage:', e);
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('surya_stores_cart', JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || (!product._id && !product.id)) return;
    const productId = product._id || product.id;

    if (product.stock <= 0) {
      addToast(`Sorry, "${product.name}" is currently out of stock.`, 'error');
      return;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product === productId);

      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const newQty = existing.quantity + quantity;

        if (newQty > product.stock) {
          addToast(`Cannot add more. Only ${product.stock} units available in stock.`, 'error');
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
        };
        addToast(`Updated "${product.name}" quantity (${newQty}) in your cart.`, 'success');
        return updated;
      } else {
        if (quantity > product.stock) {
          addToast(`Cannot add ${quantity}. Only ${product.stock} units in stock.`, 'error');
          return prevItems;
        }

        addToast(`Added "${product.name}" to cart!`, 'success');
        return [
          ...prevItems,
          {
            product: productId,
            productName: product.name,
            price: Number(product.price),
            stock: product.stock,
            image: product.image || '',
            categoryName: product.category?.name || 'General',
            brand: product.brand || 'General',
            quantity,
          },
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          if (qty > item.stock) {
            addToast(`Maximum available stock is ${item.stock} units.`, 'error');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  // Remove single item
  const removeFromCart = (productId) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.product === productId);
      if (itemToRemove) {
        addToast(`Removed "${itemToRemove.productName}" from cart.`, 'info');
      }
      return prevItems.filter((item) => item.product !== productId);
    });
  };

  // Clear all items
  const clearCart = () => {
    setItems([]);
  };

  // Computed values
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = subtotal;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
