import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import OrderList from '../components/OrderList';

const Home = () => {
  const navigate = useNavigate();
  const [orderProducts, setOrderProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const supplierId = sessionStorage.getItem('supplierId');
  const apiKey = sessionStorage.getItem('apiKey');

  useEffect(() => {
    if (!supplierId || !apiKey) {
      navigate('/login');
    }
  }, [supplierId, apiKey, navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://fetchorders-zdy4xue3eq-uc.a.run.app?supplierId=${supplierId}&apiKey=${apiKey}`);
      const data = await response.json();
      setOrderProducts(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setIsLoading(false);
    }
  };

  const fetchStoreProducts = async () => {
    try {
      const response = await fetch(`https://fetchstoreproducts-zdy4xue3eq-uc.a.run.app?supplierId=${supplierId}&apiKey=${apiKey}`);
      const data = await response.json();
      setStoreProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    fetchOrders();
    fetchStoreProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 relative">
      <h1 className="relative text-4xl font-bold py-12 text-center">
        Sipariş Listesi{" "}
        <button
          onClick={handleSignOut}
          className="absolute right-0 bg-red-500 hover:bg-red-600 text-base text-white font-bold py-2 px-8 rounded-xl"
        >
          Çıkış Yap
        </button>
      </h1>
      {isLoading ? (
        <p className="text-center">Siparişler yükleniyor...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <OrderList
          orderProducts={orderProducts}
          storeProducts={storeProducts}
        />
      )}
    </div>
  );
}

export default Home