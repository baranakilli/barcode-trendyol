import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [apiKey, setApiKey] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('apiKey', apiKey);
    sessionStorage.setItem('supplierId', supplierId);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Satıcı ID&apos;nizi ve API Anahtarınızı Girin
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="merchant-id" className="sr-only">
                Satıcı ID
              </label>
              <input
                id="merchant-id"
                name="merchantId"
                type="text"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Satıcı ID'nizi Girin"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="api-key" className="sr-only">
                API Anahtarı
              </label>
              <input
                id="api-key"
                name="apiKey"
                type="password"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="API Anahtarınızı Girin"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={handleSubmit}
            >
              Onayla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
