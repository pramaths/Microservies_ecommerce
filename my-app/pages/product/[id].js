import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false); // State to manage loading state of adding to cart
  const router = useRouter();
  const { id } = router.query;
  const {userId} =get.userId
  //const userId = 'yourUserId'; // This should be dynamically set based on user's session or a similar method

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:3003/products/${id}`);
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const addToCart = async () => {
    if (!product || !userId) return;

    setAdding(true);
    try {
      const response = await fetch(`http://localhost:3003/cart/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1 // This can be dynamic based on a user selection if needed
        })
      });

      if (response.ok) {
        alert('Product added to cart!');
      } else {
        // If response is not ok, handle the error
        const errorMessage = await response.text();
        alert(`Failed to add product to cart: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Error adding product to cart.');
    }
    setAdding(false);
  };

  if (!product) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
      <img src={product.image} alt={product.name} className="mx-auto my-4" style={{ maxWidth: '200px' }} />
      <p className="text-gray-600">{product.description}</p>
      <p className="text-xl font-semibold">Price: ${product.price}</p>
      <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Go Back
      </button>
      <button
        onClick={addToCart}
        disabled={adding}
        className={`mt-4 ml-4 px-4 py-2 ${adding ? 'bg-gray-400' : 'bg-green-500'} text-white rounded hover:bg-green-700`}
      >
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
