import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:3002/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-6">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product._id}`}
             className="block border rounded-md p-4 hover:bg-gray-100">
              <img src={product.image} alt={product.name} className="w-24 h-24 mx-auto" />
              <h2 className="mt-2 text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-gray-600">Price: ${product.price}</p>
            
          </Link>
        ))}
      </div>
    </div>
  );
}
