import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:3003/cart/yourUserId'); // Ensure the correct API endpoint
            setCartItems(response.data.items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            alert('Failed to load cart items.');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:3003/cart/yourUserId/items/${itemId}`);
            fetchCartItems(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error removing cart item:', error);
            alert('Failed to remove item.');
        }
    };

    const handleChangeQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            alert('Quantity must be at least 1');
            return;
        }
        try {
            await axios.post(`http://localhost:3003/cart/yourUserId`, { itemId, quantity }); // Adjust the API as needed for updating quantity
            fetchCartItems();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity.');
        }
    };

    return (
        <div className="cart-container">
            <h2>Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item._id}>
                            {item.productDetails.name} - ${item.productDetails.price} x {item.quantity}
                            <button onClick={() => handleChangeQuantity(item._id, item.quantity + 1)}>+</button>
                            <button onClick={() => handleChangeQuantity(item._id, item.quantity - 1)}>-</button>
                            <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => alert('Proceed to payment')}>Checkout</button>
        </div>
    );
}

export default Cart;
