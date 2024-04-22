import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3003/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product._id}`}
            className="border-2 border-sky-500 rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition duration-300">
              <div>
                <img src={product.image} alt={product.name} className="w-full h-20 object-cover mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-2">Price: ${product.price.toFixed(2)}</p>
              </div>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600 transition duration-300">
                View Details
              </button>
            
          </Link>
        ))}
      </div>
    </div>
  );
}
