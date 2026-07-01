import React from 'react';

export default function PriceDetail({ priceDetail }) {
  const {
    roomTotal,
    nights,
    quantity,
    tax,
    serviceFee,
    subtotal,
    discount,
    finalTotal,
  } = priceDetail;

  return (
    <div className="hb-price-detail">
      <div className="hb-price-row">
        <span>房价小计</span>
        <span className="hb-price-value">¥{roomTotal.toFixed(2)}</span>
      </div>
      <div className="hb-price-row">
        <span>
          {nights}晚 × {quantity}间
        </span>
        <span className="hb-price-value"></span>
      </div>
      <div className="hb-price-row">
        <span>税费（6%）</span>
        <span className="hb-price-value">¥{tax.toFixed(2)}</span>
      </div>
      <div className="hb-price-row">
        <span>服务费（4%）</span>
        <span className="hb-price-value">¥{serviceFee.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="hb-price-row discount">
          <span>连住优惠（满3晚9折）</span>
          <span className="hb-price-value discount">−¥{discount.toFixed(2)}</span>
        </div>
      )}
      <div className="hb-price-row total">
        <span>合计</span>
        <span className="hb-price-value">¥{subtotal.toFixed(2)}</span>
      </div>
      <div className="hb-price-row final">
        <span>应付金额</span>
        <span className="hb-price-value">¥{finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
