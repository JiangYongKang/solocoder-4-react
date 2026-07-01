const OrderRemark = ({ value, onChange }) => {
  return (
    <div className="order-remark">
      <div className="remark-header">
        <span className="remark-label">订单备注</span>
        <span className="remark-count">{value.length}/50</span>
      </div>
      <textarea
        className="remark-input"
        placeholder="请输入备注信息，如：不要辣、少放调料等..."
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 50))}
        maxLength={50}
      />
    </div>
  )
}

export default OrderRemark
