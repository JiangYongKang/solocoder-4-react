import React from 'react';
import { bedTypeOptions } from '../data/mockData';

export default function RoomFilter({ filters, onFilterChange }) {
  const handleMinPriceChange = (e) => {
    const val = e.target.value === '' ? undefined : Number(e.target.value);
    onFilterChange({ ...filters, minPrice: val });
  };

  const handleMaxPriceChange = (e) => {
    const val = e.target.value === '' ? undefined : Number(e.target.value);
    onFilterChange({ ...filters, maxPrice: val });
  };

  const toggleBedType = (type) => {
    const current = filters.bedTypes || [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFilterChange({ ...filters, bedTypes: next });
  };

  const toggleBreakfast = () => {
    onFilterChange({ ...filters, hasBreakfast: !filters.hasBreakfast });
  };

  return (
    <div className="hb-filter-section">
      <h4 className="hb-filter-title">🎯 房型筛选</h4>

      <div className="hb-filter-group">
        <span className="hb-filter-label">价格区间（元/晚）</span>
        <div className="hb-price-inputs">
          <input
            type="number"
            className="hb-input"
            placeholder="最低"
            min={0}
            value={filters.minPrice ?? ''}
            onChange={handleMinPriceChange}
          />
          <span className="hb-price-sep">—</span>
          <input
            type="number"
            className="hb-input"
            placeholder="最高"
            min={0}
            value={filters.maxPrice ?? ''}
            onChange={handleMaxPriceChange}
          />
        </div>
      </div>

      <div className="hb-filter-group">
        <span className="hb-filter-label">床型选择</span>
        <div className="hb-checkbox-group">
          {bedTypeOptions.map((opt) => {
            const isChecked = (filters.bedTypes || []).includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`hb-checkbox ${isChecked ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleBedType(opt.value)}
                  style={{ display: 'none' }}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="hb-filter-group">
        <span className="hb-filter-label">其他条件</span>
        <div className="hb-checkbox-group">
          <label
            className={`hb-checkbox ${filters.hasBreakfast ? 'checked' : ''}`}
          >
            <input
              type="checkbox"
              checked={filters.hasBreakfast || false}
              onChange={toggleBreakfast}
              style={{ display: 'none' }}
            />
            🍳 含早餐
          </label>
        </div>
      </div>
    </div>
  );
}
