import { TIME_PERIODS } from '../utils/helpers'

function Filters({ filters, onFiltersChange, airlines, minPrice, maxPrice }) {
  const toggleTimePeriod = (period) => {
    const current = filters.timePeriods || []
    const next = current.includes(period)
      ? current.filter(p => p !== period)
      : [...current, period]
    onFiltersChange({ ...filters, timePeriods: next })
  }

  const toggleAirline = (code) => {
    const current = filters.airlines || []
    const next = current.includes(code)
      ? current.filter(c => c !== code)
      : [...current, code]
    onFiltersChange({ ...filters, airlines: next })
  }

  const handlePriceChange = (field, value) => {
    const numValue = value === '' ? null : parseInt(value, 10)
    onFiltersChange({
      ...filters,
      priceRange: { ...filters.priceRange, [field]: numValue }
    })
  }

  const toggleDirectOnly = () => {
    onFiltersChange({ ...filters, directOnly: !filters.directOnly })
  }

  const resetFilters = () => {
    onFiltersChange({
      timePeriods: [],
      airlines: [],
      priceRange: {},
      directOnly: false
    })
  }

  const hasActiveFilters =
    (filters.timePeriods && filters.timePeriods.length > 0) ||
    (filters.airlines && filters.airlines.length > 0) ||
    filters.priceRange?.min != null ||
    filters.priceRange?.max != null ||
    filters.directOnly

  return (
    <div className="filters-panel">
      <div className="filters-header">
        <span className="filters-title">筛选条件</span>
        {hasActiveFilters && (
          <button className="reset-btn" onClick={resetFilters}>重置</button>
        )}
      </div>

      <div className="filter-group">
        <div className="filter-label">仅看直飞</div>
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={filters.directOnly || false}
            onChange={toggleDirectOnly}
          />
          <span className="checkbox-custom" />
        </label>
      </div>

      <div className="filter-group">
        <div className="filter-label">出发时段</div>
        <div className="filter-options chip-group">
          {TIME_PERIODS.map(period => (
            <button
              key={period.key}
              type="button"
              className={`filter-chip ${(filters.timePeriods || []).includes(period.key) ? 'active' : ''}`}
              onClick={() => toggleTimePeriod(period.key)}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">航空公司</div>
        <div className="filter-options chip-group">
          {airlines.map(airline => (
            <button
              key={airline.code}
              type="button"
              className={`filter-chip ${(filters.airlines || []).includes(airline.code) ? 'active' : ''}`}
              onClick={() => toggleAirline(airline.code)}
            >
              {airline.logo} {airline.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">价格区间</div>
        <div className="price-range">
          <input
            type="number"
            className="price-input"
            placeholder={`最低 ¥${minPrice}`}
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange?.min ?? ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
          />
          <span className="price-separator">—</span>
          <input
            type="number"
            className="price-input"
            placeholder={`最高 ¥${maxPrice}`}
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange?.max ?? ''}
            onChange={(e) => handlePriceChange('max', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default Filters
