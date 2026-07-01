import React from 'react';
import { formatDate } from '../utils/validators';
import PriceDetail from './PriceDetail';
import { cancellationPolicy } from '../data/mockData';

export default function OrderConfirmation({
  searchParams,
  selections,
  guestInfo,
  priceDetail,
  hotelsData,
}) {
  const selectedList = Object.entries(selections).map(([key, sel]) => {
    const [hotelId, roomId] = key.split('_');
    const hotel = hotelsData.find((h) => h.id === hotelId);
    const room = hotel?.rooms.find((r) => r.id === roomId);
    return { hotel, room, quantity: sel.quantity };
  });

  return (
    <div>
      <div className="hb-card">
        <h3 className="hb-card-title">📝 订单信息确认</h3>

        <div className="hb-summary">
          <div className="hb-summary-row">
            <span className="hb-summary-label">入住城市</span>
            <span className="hb-summary-value">{searchParams.city}</span>
          </div>
          <div className="hb-summary-row">
            <span className="hb-summary-label">入住日期</span>
            <span className="hb-summary-value">
              {formatDate(searchParams.checkIn)}
            </span>
          </div>
          <div className="hb-summary-row">
            <span className="hb-summary-label">离店日期</span>
            <span className="hb-summary-value">
              {formatDate(searchParams.checkOut)}
            </span>
          </div>
          <div className="hb-summary-row">
            <span className="hb-summary-label">共</span>
            <span className="hb-summary-value">{priceDetail.nights}晚</span>
          </div>
        </div>
      </div>

      {selectedList.map((item, idx) => (
        <div key={idx} className="hb-card">
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>
            🏨 {item.hotel.name}
          </h4>
          <div style={{ background: '#fafafa', padding: 12, borderRadius: 8 }}>
            <div className="hb-summary-row">
              <span className="hb-summary-label">房型</span>
              <span className="hb-summary-value">{item.room.name}</span>
            </div>
            <div className="hb-summary-row">
              <span className="hb-summary-label">床型</span>
              <span className="hb-summary-value">{item.room.bedDesc}</span>
            </div>
            <div className="hb-summary-row">
              <span className="hb-summary-label">间数</span>
              <span className="hb-summary-value">{item.quantity}间</span>
            </div>
            <div className="hb-summary-row">
              <span className="hb-summary-label">单价</span>
              <span className="hb-summary-value">¥{item.room.price}/晚</span>
            </div>
            <div className="hb-summary-row">
              <span className="hb-summary-label">早餐</span>
              <span className="hb-summary-value">{item.room.breakfastDesc}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="hb-card">
        <h3 className="hb-card-title">👤 入住人信息</h3>
        <div className="hb-summary">
          <div className="hb-summary-row">
            <span className="hb-summary-label">姓名</span>
            <span className="hb-summary-value">{guestInfo.name}</span>
          </div>
          <div className="hb-summary-row">
            <span className="hb-summary-label">手机号</span>
            <span className="hb-summary-value">{guestInfo.phone}</span>
          </div>
          <div className="hb-summary-row">
            <span className="hb-summary-label">证件号</span>
            <span className="hb-summary-value">
              {guestInfo.idCard.replace(/^(.{4})(.+)(.{4})$/, '$1********$3')}
            </span>
          </div>
          {guestInfo.email && (
            <div className="hb-summary-row">
              <span className="hb-summary-label">邮箱</span>
              <span className="hb-summary-value">{guestInfo.email}</span>
            </div>
          )}
          {guestInfo.remark && (
            <div className="hb-summary-row">
              <span className="hb-summary-label">备注</span>
              <span className="hb-summary-value">{guestInfo.remark}</span>
            </div>
          )}
        </div>
      </div>

      <div className="hb-card">
        <h3 className="hb-card-title">💰 费用明细</h3>
        <PriceDetail priceDetail={priceDetail} />
      </div>

      <div className="hb-card">
        <div className="hb-policy">
          <h4 className="hb-policy-title">⚠️ 取消规则</h4>
          <div className="hb-policy-item">
            免费取消：{cancellationPolicy.freeCancelBefore}
          </div>
          <div className="hb-policy-item">
            超时取消：{cancellationPolicy.feeAfter}
          </div>
          <div className="hb-policy-item">
            未入住（No-Show）：{cancellationPolicy.noShow}
          </div>
        </div>
      </div>
    </div>
  );
}
