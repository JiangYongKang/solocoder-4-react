import React, { useState } from 'react';
import { validateSearchParams, calculateNights } from '../utils/validators';
import { citySuggestions } from '../data/mockData';

export default function SearchSection({ onSearch, initialParams }) {
  const [city, setCity] = useState(initialParams?.city || '');
  const [checkIn, setCheckIn] = useState(initialParams?.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialParams?.checkOut || '');
  const [errors, setErrors] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = city
    ? citySuggestions.filter((c) => c.includes(city))
    : citySuggestions;

  const handleSearch = () => {
    const result = validateSearchParams({ city, checkIn, checkOut });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    onSearch({ city: city.trim(), checkIn, checkOut });
  };

  const handleCitySelect = (value) => {
    setCity(value);
    setShowSuggestions(false);
  };

  const nights = calculateNights(checkIn, checkOut);

  return (
    <div className="hb-card">
      <h3 className="hb-card-title">搜索酒店</h3>
      <div className="hb-search-form">
        <div className="hb-form-group" style={{ position: 'relative' }}>
          <label className="hb-form-label">目的地城市</label>
          <input
            type="text"
            className={`hb-input ${errors.some((e) => e.includes('城市')) ? 'error' : ''}`}
            placeholder="如：北京、上海"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                marginTop: 4,
                zIndex: 100,
                maxHeight: 200,
                overflow: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {filteredSuggestions.map((c) => (
                <div
                  key={c}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontSize: 14,
                    borderBottom: '1px solid #f5f5f5',
                  }}
                  onMouseDown={() => handleCitySelect(c)}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="hb-form-group">
          <label className="hb-form-label">入住日期</label>
          <input
            type="date"
            className={`hb-input ${errors.some((e) => e.includes('入住')) ? 'error' : ''}`}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="hb-form-group">
          <label className="hb-form-label">离店日期 {nights > 0 && `(共${nights}晚)`}</label>
          <input
            type="date"
            className={`hb-input ${errors.some((e) => e.includes('离店') || e.includes('顺序')) ? 'error' : ''}`}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div className="hb-form-group">
          <button className="hb-btn hb-btn-primary" onClick={handleSearch}>
            🔍 搜索
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="hb-errors">
          {errors.map((err, idx) => (
            <div key={idx} className="hb-error-item">
              {err}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
