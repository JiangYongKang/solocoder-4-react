import React, { useState } from 'react';
import { validateGuestInfo } from '../utils/validators';

export default function GuestInfoForm({ guestInfo, onGuestInfoChange }) {
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    const newInfo = { ...guestInfo, [field]: value };
    onGuestInfoChange(newInfo);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const validation = validateGuestInfo(guestInfo);

  const getFieldClass = (field) => {
    return `hb-input ${
      touched[field] && validation.errors[field] ? 'error' : ''
    }`;
  };

  const showError = (field) => {
    return touched[field] && validation.errors[field];
  };

  return (
    <div>
      <h3 className="hb-card-title">入住人信息</h3>
      <div className="hb-form-grid">
        <div className="hb-form-group">
          <label className="hb-form-label">入住人姓名 *</label>
          <input
            type="text"
            className={getFieldClass('name')}
            placeholder="请输入真实姓名"
            value={guestInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
          />
          <div className="hb-form-error-text">
            {showError('name') ? validation.errors.name : ''}
          </div>
        </div>

        <div className="hb-form-group">
          <label className="hb-form-label">手机号码 *</label>
          <input
            type="tel"
            className={getFieldClass('phone')}
            placeholder="请输入11位手机号"
            maxLength={11}
            value={guestInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
          />
          <div className="hb-form-error-text">
            {showError('phone') ? validation.errors.phone : ''}
          </div>
        </div>

        <div className="hb-form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="hb-form-label">身份证号码 *</label>
          <input
            type="text"
            className={getFieldClass('idCard')}
            placeholder="请输入15或18位证件号"
            maxLength={18}
            value={guestInfo.idCard}
            onChange={(e) => handleChange('idCard', e.target.value)}
            onBlur={() => handleBlur('idCard')}
          />
          <div className="hb-form-error-text">
            {showError('idCard') ? validation.errors.idCard : ''}
          </div>
        </div>

        <div className="hb-form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="hb-form-label">联系邮箱（选填）</label>
          <input
            type="email"
            className="hb-input"
            placeholder="用于接收订单确认邮件"
            value={guestInfo.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <div className="hb-form-error-text"></div>
        </div>

        <div className="hb-form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="hb-form-label">备注（选填）</label>
          <textarea
            className="hb-input"
            placeholder="如有特殊需求请备注（如：高楼层、无烟房等）"
            rows={3}
            style={{ resize: 'vertical' }}
            value={guestInfo.remark || ''}
            onChange={(e) => handleChange('remark', e.target.value)}
          />
          <div className="hb-form-error-text"></div>
        </div>
      </div>
    </div>
  );
}
