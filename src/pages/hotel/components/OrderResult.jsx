import React from 'react';
import { formatDate } from '../utils/validators';
import { cancellationPolicy } from '../data/mockData';

export default function OrderResult({
  orderData,
  onBackToSearch,
  onViewOrder,
}) {
  const {
    orderNo,
    status,
    searchParams,
    selectedList,
    guestInfo,
    priceDetail,
    createdAt,
  } = orderData;

  const statusMap = {
    success: {
      icon: '✓',
      title: '预订成功！',
      subtitle: '订单已确认，我们会将确认信息发送至您的手机',
      bgClass: 'success',
    },
  };

  const statusInfo = statusMap[status] || statusMap.success;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString('zh-CN')
    : '';

  return (
    <div className="hb-card hb-result-card">
      <div className={`hb-result-icon ${statusInfo.bgClass}`}>
        {statusInfo.icon}
      </div>
      <h3 className="hb-result-title">{statusInfo.title}</h3>
      <p className="hb-result-subtitle">{statusInfo.subtitle}</p>

      <div className="hb-order-info">
        <div className="hb-order-row">
          <span className="hb-order-label">订单号</span>
          <span className="hb-order-value hb-order-no">{orderNo}</span>
        </div>
        <div className="hb-order-row">
          <span className="hb-order-label">下单时间</span>
          <span className="hb-order-value">{formattedDate}</span>
        </div>
        <div className="hb-order-row">
          <span className="hb-order-label">订单状态</span>
          <span
            className="hb-order-value"
            style={{ color: '#52c41a', fontWeight: 600 }}
          >
            ✅ 已确认
          </span>
        </div>
        <div className="hb-order-row">
          <span className="hb-order-label">入住城市</span>
          <span className="hb-order-value">{searchParams.city}</span>
        </div>
        <div className="hb-order-row">
          <span className="hb-order-label">入住日期</span>
          <span className="hb-order-value">
            {formatDate(searchParams.checkIn)}
          </span>
        </div>
        <div className="hb-order-row">
          <span className="hb-order-label">离店日期</span>
          <span className="hb-order-value">
            {formatDate(searchParams.checkOut)}
          </span>
        </div>
        <div className="hb-order-row">
          <span className="hb-order-label">共</span>
          <span className="hb-order-value">{priceDetail.nights}晚</span>
        </div>

        {selectedList.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="hb-order-row">
              <span className="hb-order-label">酒店</span>
              <span className="hb-order-value">{item.hotel.name}</span>
            </div>
            <div className="hb-order-row">
              <span className="hb-order-label">房型</span>
              <span className="hb-order-value">
                {item.room.name} × {item.quantity}间
              </span>
            </div>
          </React.Fragment>
        ))}

        <div className="hb-order-row">
          <span className="hb-order-label">入住人</span>
          <span className="hb-order-value">{guestInfo.name}</span>
        </div>
        <div className="hb-order-row">
          <span className="hb-order-label">联系电话</span>
          <span className="hb-order-value">{guestInfo.phone}</span>
        </div>
        <div className="hb-order-row" style={{ borderBottom: 'none' }}>
          <span className="hb-order-label">应付金额</span>
          <span
            className="hb-order-value"
            style={{ color: '#ff6b35', fontSize: 20, fontWeight: 700 }}
          >
            ¥{priceDetail.finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="hb-policy">
        <h4 className="hb-policy-title">📋 取消及退改规则</h4>
        <div className="hb-policy-item">
          免费取消：{cancellationPolicy.freeCancelBefore}
        </div>
        <div className="hb-policy-item">
          超时取消：{cancellationPolicy.feeAfter}
        </div>
        <div className="hb-policy-item">
          未入住（No-Show）：{cancellationPolicy.noShow}
        </div>
        <div className="hb-policy-item">
          如需取消或修改订单，请致电客服热线：400-888-8888
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 24,
          flexWrap: 'wrap',
        }}
      >
        <button className="hb-btn hb-btn-outline" onClick={onBackToSearch}>
          🔄 继续预订
        </button>
        {onViewOrder && (
          <button className="hb-btn hb-btn-primary" onClick={onViewOrder}>
            📋 查看订单
          </button>
        )}
      </div>
    </div>
  );
}
