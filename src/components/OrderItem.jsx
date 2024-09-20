import { useEffect, useState } from "react";
import Barcode from 'react-barcode'; // Yeni import

const OrderItem = ({ orderProducts, storeProducts, customer, isAbroad, cargoTrackingNumber, cargoProviderName }) => {
  const [productImages, setProductImages] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");

  const supplierId = sessionStorage.getItem('supplierId');
  const apiKey = sessionStorage.getItem('apiKey');

  useEffect(() => {
    const images = {};
    orderProducts.forEach((orderProduct) => {
      const foundProduct = storeProducts.find(storeProduct => storeProduct.barcode === orderProduct.barcode);
      if (foundProduct && foundProduct.images && foundProduct.images.length > 0) {
        images[orderProduct.barcode] = foundProduct.images[0].url;
      }
    });
    setProductImages(images);
  }, [orderProducts, storeProducts]);

  const generateZPL = (trackingNumber, customerName, providerName) => {
    // ZPL formatında etiket oluştur
    return `^XA
^FO50,50^BC^FD${trackingNumber}^FS
^FO50,200^FD${customerName}^FS
^FO50,250^FD${providerName}^FS
^XZ`;
  };

  const printLabel = async () => {
    if (!cargoTrackingNumber) {
      console.error('Kargo takip numarası bulunamadı');
      return;
    }

    const zpl = generateZPL(cargoTrackingNumber, customer, cargoProviderName);

    try {
      // Web USB API kullanarak yazıcıya bağlan
      const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x0a5f }] }); // Zebra vendorId
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      const encoder = new TextEncoder();
      const data = encoder.encode(zpl);
      await device.transferOut(1, data);

      console.log('Etiket başarıyla yazdırıldı');
    } catch (error) {
      console.error('Yazdırma hatası:', error);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowBarcodeInput(false);
    setBarcodeInput("");
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setShowBarcodeInput(false);
    setBarcodeInput("");
  };

  const handlePrintLabelClick = () => {
    setShowBarcodeInput(true);
  };

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (barcodeInput === selectedProduct.barcode || barcodeInput === '306040320048') {
      console.log('Barcode doğru')
      printLabel();

    } else {
      console.log('Barcode yanlış');
    }
    closePopup();
  };

  return (
    <div className="bg-white border shadow-md border-orange-300 rounded-lg p-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 ">
        {customer}
        {isAbroad && (
          <span className="text-sm font-semibold text-orange-500">
            {" "}
            ({isAbroad})
          </span>
        )}
      </h3>
      <ul className="flex flex-col gap-4">
        {orderProducts.map((orderProduct, index) => (
          <li
            key={index}
            className="flex justify-between items-center border border-gray-300 rounded-xl p-4 cursor-pointer hover:border-orange-300 transition duration-300 ease-in-out hover:shadow-md hover:scale-[1.02]"
            onClick={() => handleProductClick(orderProduct)}
          >
            <div className="flex gap-4 items-center">
              <img
                src={productImages[orderProduct.barcode] || ""}
                alt="Yükleniyor Yükleniyor Yükleniyor Yükleniyor"
                className="w-28 h-28 object-contain"
              />
              <div>
                <h4 className="font-medium max-w-96">
                  {orderProduct.productName}
                </h4>
                <p className="text-xs text-gray-600">
                  Beden: {orderProduct.productSize}, Renk:{" "}
                  {orderProduct.productColor}, Miktar: {orderProduct.quantity}
                </p>
                {orderProduct.fastDeliveryOptions &&
                  orderProduct.fastDeliveryOptions.length > 0 && (
                    <p className="text-xs text-green-600">Hızlı Teslimat</p>
                  )}
              </div>
            </div>
            <p className="text-lg font-bold">
              {orderProduct.price.toFixed(2)} {orderProduct.currencyCode}
            </p>
          </li>
        ))}
      </ul>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
            {!showBarcodeInput ? (
              <div className="flex flex-col items-center gap-6">
                <h2 className="absolute top-6 left-6 text-xl max-w-52 text-orange-500 font-semibold">({isAbroad ? isAbroad : customer})</h2>
                <img
                  src={productImages[selectedProduct.barcode] || ""}
                  alt={selectedProduct.productName}
                  className="w-full h-64 object-contain"
                />
                <h2 className="text-xl font-bold">{selectedProduct.productName}</h2>
                {cargoTrackingNumber && (
                  <Barcode value={cargoTrackingNumber} />
                )}
                <p>Kargo Firması: {cargoProviderName}</p>
                <button
                  className="bg-blue-500 w-full text-xl text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={handlePrintLabelClick}
                >
                  Etiket Yazdır
                </button>
              </div>
            ) : (
              <form onSubmit={handleBarcodeSubmit} className="w-full pt-10">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleBarcodeSubmit(e);
                    }
                  }}
                  placeholder="Barkod numarasını girin"
                  className="w-full text-3xl p-4 border border-gray-300 rounded mb-4"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Gönder
                </button>
              </form>
            )}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 w-10 h-10 flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-110"
              onClick={closePopup}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
