import { useState } from 'react'
import SearchForm from './components/SearchForm'
import FlightList from './components/FlightList'
import CabinSelector from './components/CabinSelector'
import PassengerManager from './components/PassengerManager'
import OrderSummary from './components/OrderSummary'
import { getMockFlights, CITIES } from './data/mockData'
import { getDateStr } from './utils/helpers'
import './flights.css'

const STEPS = {
  SEARCH: 'search',
  SELECT_FLIGHT: 'select_flight',
  SELECT_CABIN: 'select_cabin',
  CONFIRM_ORDER: 'confirm_order'
}

function FlightsPage() {
  const [currentStep, setCurrentStep] = useState(STEPS.SEARCH)
  const [searchForm, setSearchForm] = useState(null)
  const [flightsData, setFlightsData] = useState({ departureFlights: [], returnFlights: [] })

  const [selections, setSelections] = useState([
    { type: 'departure', flight: null, cabin: null }
  ])

  const [cabinSelectorType, setCabinSelectorType] = useState(null)
  const [currentFlightForCabin, setCurrentFlightForCabin] = useState(null)

  const [passengers, setPassengers] = useState([
    {
      id: 'p_default_1',
      name: '张三',
      idType: 'idcard',
      idNo: '110101199003071234',
      phone: '13800138000'
    }
  ])
  const [selectedPassengerIds, setSelectedPassengerIds] = useState(['p_default_1'])

  const handleSearch = (formData) => {
    setSearchForm(formData)
    const data = getMockFlights(
      formData.departure,
      formData.arrival,
      formData.departureDate,
      formData.tripType === 'roundTrip' ? formData.returnDate : null
    )
    setFlightsData(data)

    const newSelections = [{ type: 'departure', flight: null, cabin: null }]
    if (formData.tripType === 'roundTrip') {
      newSelections.push({ type: 'return', flight: null, cabin: null })
    }
    setSelections(newSelections)
    setCurrentStep(STEPS.SELECT_FLIGHT)
  }

  const handleSelectFlight = (type, flight) => {
    setSelections(prev => prev.map(s =>
      s.type === type ? { ...s, flight, cabin: null } : s
    ))
    setCabinSelectorType(type)
    setCurrentFlightForCabin(flight)
    setCurrentStep(STEPS.SELECT_CABIN)
  }

  const handleSelectCabin = (type, cabin) => {
    setSelections(prev => prev.map(s =>
      s.type === type ? { ...s, cabin } : s
    ))
    setCurrentStep(STEPS.SELECT_FLIGHT)
  }

  const handleCabinBack = () => {
    setCurrentStep(STEPS.SELECT_FLIGHT)
  }

  const handleSelectPassenger = (passengerId, selected) => {
    setSelectedPassengerIds(prev =>
      selected
        ? [...prev, passengerId]
        : prev.filter(id => id !== passengerId)
    )
  }

  const goToConfirm = () => {
    const allSelected = selections.every(s => s.flight && s.cabin)
    if (allSelected) {
      setCurrentStep(STEPS.CONFIRM_ORDER)
    }
  }

  const backToFlightSelection = () => {
    setCurrentStep(STEPS.SELECT_FLIGHT)
  }

  const resetAll = () => {
    setCurrentStep(STEPS.SEARCH)
    setSearchForm(null)
    setFlightsData({ departureFlights: [], returnFlights: [] })
    setSelections([{ type: 'departure', flight: null, cabin: null }])
    setCabinSelectorType(null)
    setCurrentFlightForCabin(null)
  }

  const handleOrderConfirm = () => {
    resetAll()
  }

  const getCityName = (code) => {
    const city = CITIES.find(c => c.code === code)
    return city ? `${city.name}(${city.code})` : code
  }

  const allFlightsSelected = selections.every(s => s.flight && s.cabin)

  const renderStepIndicator = () => {
    const steps = [
      { key: STEPS.SEARCH, label: '搜索', active: currentStep === STEPS.SEARCH },
      { key: STEPS.SELECT_FLIGHT, label: '选航班', active: currentStep === STEPS.SELECT_FLIGHT || currentStep === STEPS.SELECT_CABIN },
      { key: STEPS.CONFIRM_ORDER, label: '填订单', active: currentStep === STEPS.CONFIRM_ORDER }
    ]

    return (
      <div className="step-indicator">
        {steps.map((step, idx) => (
          <div key={step.key} className="step-item">
            <div className={`step-circle ${step.active ? 'active' : ''}`}>
              {idx + 1}
            </div>
            <div className={`step-label ${step.active ? 'active' : ''}`}>{step.label}</div>
            {idx < steps.length - 1 && <div className={`step-line ${steps[idx + 1].active ? 'active' : ''}`} />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flights-page">
      <div className="flights-page-header">
        <h1 className="page-title">机票预订</h1>
        {searchForm && (
          <button className="back-to-search-btn" onClick={resetAll}>
            重新搜索
          </button>
        )}
      </div>

      {renderStepIndicator()}

      <div className="flights-page-content">
        {currentStep === STEPS.SEARCH && (
          <SearchForm
            initialForm={{
              tripType: 'oneWay',
              departure: 'PEK',
              arrival: 'SHA',
              departureDate: getDateStr(3),
              returnDate: ''
            }}
            onSearch={handleSearch}
          />
        )}

        {(currentStep === STEPS.SELECT_FLIGHT || currentStep === STEPS.SELECT_CABIN) && searchForm && (
          <div className="booking-content">
            <div className="search-summary">
              <div className="route-info">
                <span className="route-text">
                  {getCityName(searchForm.departure)} → {getCityName(searchForm.arrival)}
                  {searchForm.tripType === 'roundTrip' && ' 往返'}
                </span>
              </div>
              <div className="date-info">
                <span>去程：{searchForm.departureDate}</span>
                {searchForm.tripType === 'roundTrip' && (
                  <span>返程：{searchForm.returnDate}</span>
                )}
              </div>
            </div>

            {currentStep === STEPS.SELECT_FLIGHT && (
              <>
                {selections.map(sel => (
                  <div key={sel.type} className="flight-section">
                    <div className="section-header-row">
                      <h3 className="section-heading">
                        {sel.type === 'departure' ? '选择去程航班' : '选择返程航班'}
                        {sel.flight && sel.cabin && (
                          <span className="selected-badge">已选 {sel.flight.flightNo} {sel.cabin.name}</span>
                        )}
                      </h3>
                    </div>
                    <FlightList
                      title=""
                      flights={sel.type === 'departure' ? flightsData.departureFlights : flightsData.returnFlights}
                      type={sel.type}
                      selectedFlight={sel.flight}
                      onSelectFlight={handleSelectFlight}
                    />
                  </div>
                ))}

                <div className="sticky-action-bar">
                  <div className="action-summary">
                    {selections.filter(s => s.flight && s.cabin).map((s, i) => (
                      <span key={i} className="summary-tag">
                        {s.type === 'departure' ? '去程' : '返程'}：{s.flight.flightNo} {s.cabin.name}
                      </span>
                    ))}
                  </div>
                  <button
                    className="next-step-btn"
                    onClick={goToConfirm}
                    disabled={!allFlightsSelected}
                  >
                    下一步 · 填写订单
                  </button>
                </div>
              </>
            )}

            {currentStep === STEPS.SELECT_CABIN && currentFlightForCabin && (
              <CabinSelector
                flight={currentFlightForCabin}
                flightType={cabinSelectorType}
                selectedCabin={selections.find(s => s.type === cabinSelectorType)?.cabin}
                onSelectCabin={handleSelectCabin}
                onBack={handleCabinBack}
              />
            )}
          </div>
        )}

        {currentStep === STEPS.CONFIRM_ORDER && searchForm && (
          <div className="confirm-order-content">
            <button className="back-btn-inline" onClick={backToFlightSelection}>
              ← 返回修改航班
            </button>

            <div className="order-main-content">
              <div className="order-left-section">
                <PassengerManager
                  passengers={passengers}
                  selectedIds={selectedPassengerIds}
                  onUpdatePassengers={setPassengers}
                  onSelectPassenger={handleSelectPassenger}
                />
              </div>

              <div className="order-right-section">
                <OrderSummary
                  tripType={searchForm.tripType}
                  searchForm={searchForm}
                  selections={selections}
                  passengers={passengers}
                  selectedPassengerIds={selectedPassengerIds}
                  onConfirm={handleOrderConfirm}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlightsPage
