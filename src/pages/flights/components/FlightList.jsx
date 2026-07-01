import { useState } from 'react'
import FlightCard from './FlightCard'
import Filters from './Filters'
import { SORT_OPTIONS, sortFlights, filterFlights } from '../utils/helpers'
import { AIRLINES } from '../data/mockData'

function FlightList({
  title,
  flights,
  type,
  selectedFlight,
  onSelectFlight,
  onClose
}) {
  const [filters, setFilters] = useState({
    timePeriods: [],
    airlines: [],
    priceRange: {},
    directOnly: false
  })
  const [sortBy, setSortBy] = useState('recommend')

  const filteredFlights = filterFlights(flights, filters)
  const sortedFlights = sortFlights(filteredFlights, sortBy)

  const allAirlines = [...new Set(flights.map(f => f.airlineCode))]
    .map(code => AIRLINES.find(a => a.code === code) || { code, name: code, logo: code })

  const allPrices = flights.flatMap(f => f.cabins.map(c => c.price))
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)

  return (
    <div className="flight-list-container">
      <div className="flight-list-header">
        <div className="list-title-row">
          <h3 className="list-title">{title}</h3>
          <span className="result-count">共 {sortedFlights.length} 个航班</span>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>

        <div className="list-toolbar">
          <div className="sort-section">
            <label className="sort-label">排序：</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flight-list-content">
        <Filters
          filters={filters}
          onFiltersChange={setFilters}
          airlines={allAirlines}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <div className="flight-cards-list">
          {sortedFlights.length === 0 ? (
            <div className="empty-state">
              <p>暂无符合条件的航班，请调整筛选条件</p>
            </div>
          ) : (
            sortedFlights.map(flight => (
              <FlightCard
                key={flight.id}
                flight={flight}
                isSelected={selectedFlight?.id === flight.id}
                onSelect={(f) => onSelectFlight(type, f)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default FlightList
