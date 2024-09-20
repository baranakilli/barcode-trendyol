import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";

const ProductList = ({ orderProducts, storeProducts }) => {


  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {orderProducts.map((orderProduct, index) => (
        console.log(orderProduct),
        <OrderItem
          key={index}
          orderProducts={orderProduct.lines}
          storeProducts={storeProducts}
          customer={orderProduct.customerFirstName + " " + orderProduct.customerLastName}
          isAbroad={
            orderProduct.invoiceAddress.countryCode !== "TR"
            ? orderProduct.shipmentAddress.fullName
            : null
          }
          cargoTrackingNumber={orderProduct.cargoTrackingNumber}
          cargoProviderName={orderProduct.cargoProviderName}
        />
      ))}
    </ul>
  );
};

export default ProductList;
