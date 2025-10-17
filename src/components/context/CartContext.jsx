// src/context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storefrontClient } from '../lib/shopifyConfig';
import { CREATE_CART_MUTATION, ADD_TO_CART_MUTATION, REMOVE_FROM_CART_MUTATION, GET_CART_QUERY , UPDATE_CART_LINES_MUTATION } from '../lib/shopifyQueries';

// Create context
const CartContext = createContext();

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { 
        ...state, 
        cart: action.payload,
        loading: false 
      };
    case 'ADD_ITEM':
      return { ...state, loading: true };
    case 'REMOVE_ITEM':
      return { ...state, loading: true };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

// Helper function to get cart items from Shopify cart
const getCartItems = (cart) => {
  if (!cart?.lines?.edges) return [];
  
  return cart.lines.edges.map(({ node: line }) => ({
    id: line.id,
    variantId: line.merchandise.id,
    product: {
      title: line.merchandise.product.title,
      featuredImage: line.merchandise.product.featuredImage,
    },
    price: line.merchandise.price.amount,
    quantity: line.quantity,
    total: parseFloat(line.merchandise.price.amount) * line.quantity
  }));
};

// Helper function to get cart total
const getCartTotal = (cart) => {
  if (!cart?.cost?.totalAmount?.amount) return 0;
  return parseFloat(cart.cost.totalAmount.amount);
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('shopify_cart_id');
    if (savedCartId) {
      fetchCart(savedCartId);
    }
  }, []);

  // Fetch cart from Shopify
  const fetchCart = async (cartId) => {
    try {
      const { data } = await storefrontClient.query(GET_CART_QUERY, { cartId });
      if (data.cart) {
        dispatch({ type: 'SET_CART', payload: data.cart });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If cart doesn't exist, clear the saved cart ID
      localStorage.removeItem('shopify_cart_id');
    }
  };

  // Create a new cart
  const createCart = async () => {
    try {
      const { data } = await storefrontClient.query(CREATE_CART_MUTATION);
      const cart = data.cartCreate.cart;
      
      if (cart) {
        localStorage.setItem('shopify_cart_id', cart.id);
        dispatch({ type: 'SET_CART', payload: cart });
        return cart;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.error('Error creating cart:', error);
    }
  };

  const updateCartQuantity = async (lineId, newQuantity, maxStock) => {
  // Prevent going below 1 or above stock
  if (newQuantity < 1) newQuantity = 1;
  if (newQuantity > maxStock) newQuantity = maxStock;

  dispatch({ type: 'SET_LOADING', payload: true });

  try {
    const cartId = state.cart?.id || localStorage.getItem('shopify_cart_id');
    if (!cartId) throw new Error('No cart found');

    const { data } = await storefrontClient.query(UPDATE_CART_LINES_MUTATION, {
      cartId,
      lines: [{ id: lineId, quantity: newQuantity }],
    });

    if (data.cartLinesUpdate.userErrors?.length) {
      throw new Error(data.cartLinesUpdate.userErrors[0].message);
    }

    if (data.cartLinesUpdate.cart) {
      dispatch({ type: 'SET_CART', payload: data.cartLinesUpdate.cart });
    }
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.message });
    console.error('Error updating quantity:', error);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};


  // Add item to cart
  const addToCart = async (variantId, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM' });
    
    try {
      let cartId = state.cart?.id || localStorage.getItem('shopify_cart_id');
      
      // If no cart exists, create one first
      if (!cartId) {
        const newCart = await createCart();
        cartId = newCart.id;
      }

      // Add item to cart
      const { data } = await storefrontClient.query(ADD_TO_CART_MUTATION, {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }]
      });

      if (data.cartLinesAdd.cart) {
        dispatch({ type: 'SET_CART', payload: data.cartLinesAdd.cart });
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.error('Error adding to cart:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (lineId) => {
    dispatch({ type: 'REMOVE_ITEM' });
    
    try {
      const cartId = state.cart?.id || localStorage.getItem('shopify_cart_id');
      
      if (!cartId) {
        throw new Error('No cart found');
      }

      const { data } = await storefrontClient.query(REMOVE_FROM_CART_MUTATION, {
        cartId,
        lineIds: [lineId]
      });

      if (data.cartLinesRemove.cart) {
        dispatch({ type: 'SET_CART', payload: data.cartLinesRemove.cart });
        
        // If cart is empty after removal, clear it
        if (data.cartLinesRemove.cart.lines.edges.length === 0) {
          localStorage.removeItem('shopify_cart_id');
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.error('Error removing from cart:', error);
    }
  };

  // Proceed to checkout - FIXED VERSION
  const proceedToCheckout = () => {
    if (state.cart?.checkoutUrl) {
      // Open checkout in new tab to avoid authentication issues
      window.open(state.cart.checkoutUrl, '_blank', 'noopener,noreferrer');
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'No checkout URL available' });
    }
  };

  // Get cart items and total
  const cartItems = state.cart ? getCartItems(state.cart) : [];
  const cartTotal = state.cart ? getCartTotal(state.cart) : 0;

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    ...state,
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    createCart,
    getCartCount,
    updateCartQuantity,
    getCartTotal: () => cartTotal,
    proceedToCheckout, // Add the new checkout function
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;