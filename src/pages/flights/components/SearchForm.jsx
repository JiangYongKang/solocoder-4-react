import { useState } from 'react'
import { CITIES } from '../data/mockData'
import { getDateStr } from '../utils/helpers'
import { validateSearchForm } from '../utils/validation'

function SearchForm({ onSearch, initialForm }) {
  const [formData, setFormData] = useState(initialForm || {
    tripType: 'oneWay',
    departure: '',
    arrival: '',
    departureDate: '',
    returnDate: ''
  })
  const [errors, setErrors] = useState({})
  const [showCityDropdown, setShowCityDropdown] = useState({ field: null, keyword: '' })

  const handleTripTypeChange = (type) => {
    setFormData(prev => ({ ...prev, tripType: type }))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.returnDate
      delete newErrors.dateOrder
      return newErrors
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      delete newErrors.sameCity
      delete newErrors.dateOrder
      return newErrors
    })
    if (field === 'departure' || field === 'arrival') {
      setShowCityDropdown({ field, keyword: value })
    }
  }

  const selectCity = (field, city) => {
    setFormData(prev => ({ ...prev, [field]: city.code }))
    setShowCityDropdown({ field: null, keyword: '' })
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      delete newErrors.sameCity
      return newErrors
    })
  }

  const swapCities = () => {
    setFormData(prev => ({
      ...prev,
      departure: prev.arrival,
      arrival: prev.departure
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = validateSearchForm(formData)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }
    onSearch(formData)
  }

  const filterCities = (keyword) => {
    if (!keyword) return CITIES
    const kw = keyword.toLowerCase()
    return CITIES.filter(c =>
      c.name.includes(kw) ||
      c.code.toLowerCase().includes(kw) ||
      c.airport.includes(kw)
    )
  }

  const renderCityDropdown = (field) => {
    if (showCityDropdown.field !== field) return null
    const cities = filterCities(showCityDropdown.keyword)
    if (cities.length === 0) return null
    return (
      <div className="city-dropdown">
        {cities.map(city => (
          <div
            key={city.code}
            className="city-option"
            onClick={() => selectCity(field, city)}
          >
            <span className="city-name">{city.name}</span>
            <span className="city-code">{city.code}</span>
            <span className="city-airport">{city.airport}</span>
          </div>
        ))}
      </div>
    )
  }

  const getCityName = (code) => {
    const city = CITIES.find(c => c.code === code)
    return city ? `${city.name}(${city.code})` : ''
  }

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="trip-type-tabs">
          <button
            type="button"
            className={`tab-btn ${formData.tripType === 'oneWay' ? 'active' : ''}`}
            onClick={() => handleTripTypeChange('oneWay')}
          >
            单程
          </button>
          <button
            type="button"
            className={`tab-btn ${formData.tripType === 'roundTrip' ? 'active' : ''}`}
            onClick={() => handleTripTypeChange('roundTrip')}
          >
            往返
          </button>
        </div>

        <div className="form-row city-row">
          <div className="form-group city-group">
            <label className="form-label">出发城市</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="输入城市或机场代码"
                value={formData.departure && getCityName(formData.departure) || ''}
                onChange={(e) => handleInputChange('departure', e.target.value)}
                onFocus={(e) => setShowCityDropdown({ field: 'departure', keyword: e.target.value })}
                onBlur={() => setTimeout(() => setShowCityDropdown({ field: null, keyword: '' }), 200)}
              />
              {renderCityDropdown('departure')}
            </div>
            {errors.departure && <span className="error-text">{errors.departure}</span>}
          </div>

          <button type="button" className="swap-btn" onClick={swapCities}>
            ⇄
          </button>

          <div className="form-group city-group">
            <label className="form-label">到达城市</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="输入城市或机场代码"
                value={formData.arrival && getCityName(formData.arrival) || ''}
                onChange={(e) => handleInputChange('arrival', e.target.value)}
                onFocus={(e) => setShowCityDropdown({ field: 'arrival', keyword: e.target.value })}
                onBlur={() => setTimeout(() => setShowCityDropdown({ field: null, keyword: '' }), 200)}
              />
              {renderCityDropdown('arrival')}
            </div>
            {errors.arrival && <span className="error-text">{errors.arrival}</span>}
          </div>
        </div>

        {errors.sameCity && <div className="form-error-banner">{errors.sameCity}</div>}

        <div className={`form-row date-row ${formData.tripType === 'roundTrip' ? 'round' : ''}`}>
          <div className="form-group date-group">
            <label className="form-label">出发日期</label>
            <input
              type="date"
              className="form-input"
              value={formData.departureDate}
              min={getDateStr(0)}
              onChange={(e) => handleInputChange('departureDate', e.target.value)}
            />
            {errors.departureDate && <span className="error-text">{errors.departureDate}</span>}
          </div>

          {formData.tripType === 'roundTrip' && (
            <div className="form-group date-group">
              <label className="form-label">返程日期</label>
              <input
                type="date"
                className="form-input"
                value={formData.returnDate}
                min={formData.departureDate || getDateStr(0)}
                onChange={(e) => handleInputChange('returnDate', e.target.value)}
              />
              {errors.returnDate && <span className="error-text">{errors.returnDate}</span>}
            </div>
          )}
        </div>

        {errors.dateOrder && <div className="form-error-banner">{errors.dateOrder}</div>}

        <button type="submit" className="search-btn">搜索航班</button>
      </form>
    </div>
  )
}

export default SearchForm
