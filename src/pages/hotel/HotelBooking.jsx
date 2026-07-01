import React, { useState, useMemo } from 'react';
import SearchSection from './components/SearchSection';
import HotelList from './components/HotelList';
import RoomFilter from './components/RoomFilter';
import GuestInfoForm from './components/GuestInfoForm';
import PriceDetail from './components/PriceDetail';
import OrderConfirmation from './components/OrderConfirmation';
import OrderResult from './components/OrderResult';
import Steps from './components/Steps';
import { hotelData } from './data/mockData';
import {
  calculateNights,
  calculatePriceDetail,
  validateGuestInfo,
  generateOrderNo,
} from './utils/validators';
import './styles/hotel.css';

const STEPS = {
  SEARCH: 0,
  GUEST_INFO: 1,
  CONFIRM: 2,
  RESULT: 3,
};

export default function HotelBooking() {
  const [currentStep, setCurrentStep] = useState(STEPS.SEARCH);

  const [searchParams, setSearchParams] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: undefined,
    maxPrice: undefined,
    bedTypes: [],
    hasBreakfast: false,
  });

  const [selections, setSelections] = useState({});

  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    idCard: '',
    email: '',
    remark: '',
  });

  const [guestFormTouched, setGuestFormTouched] = useState(false);

  const [orderData, setOrderData] = useState(null);

  const searchedHotels = useMemo(() => {
    if (!searchParams?.city) return [];
    const cityKeyword = searchParams.city.trim();
    return hotelData.filter((hotel) =>
      hotel.city.includes(cityKeyword) || hotel.name.includes(cityKeyword)
    );
  }, [searchParams]);

  const nights = useMemo(() => {
    if (!searchParams) return 0;
    return calculateNights(searchParams.checkIn, searchParams.checkOut);
  }, [searchParams]);

  const totalPriceDetail = useMemo(() => {
    let totalRoomPrice = 0;
    let totalQuantity = 0;

    Object.entries(selections).forEach(([key, sel]) => {
      const [hotelId, roomId] = key.split('_');
      const hotel = hotelData.find((h) => h.id === hotelId);
      const room = hotel?.rooms.find((r) => r.id === roomId);
      if (room) {
        totalRoomPrice += room.price * sel.quantity;
        totalQuantity += sel.quantity;
      }
    });

    if (totalQuantity === 0 || nights === 0) {
      return null;
    }

    return calculatePriceDetail(totalRoomPrice / totalQuantity, nights, totalQuantity);
  }, [selections, nights]);

  const selectedListForOrder = useMemo(() => {
    return Object.entries(selections).map(([key, sel]) => {
      const [hotelId, roomId] = key.split('_');
      const hotel = hotelData.find((h) => h.id === hotelId);
      const room = hotel?.rooms.find((r) => r.id === roomId);
      return { hotel, room, quantity: sel.quantity };
    });
  }, [selections]);

  const hasSelections = Object.keys(selections).length > 0;

  const handleSearch = (params) => {
    setSearchParams(params);
    setSelections({});
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      bedTypes: [],
      hasBreakfast: false,
    });
  };

  const handleSelectRoom = (hotel, room) => {
    const key = `${hotel.id}_${room.id}`;
    setSelections((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = { quantity: 1 };
      }
      return next;
    });
  };

  const handleQuantityChange = (hotelId, roomId, qty) => {
    const key = `${hotelId}_${roomId}`;
    setSelections((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), quantity: qty },
    }));
  };

  const canGoToGuestInfo = () => {
    return hasSelections && searchParams;
  };

  const goToGuestInfo = () => {
    if (!canGoToGuestInfo()) return;
    setCurrentStep(STEPS.GUEST_INFO);
  };

  const goToConfirm = () => {
    const validation = validateGuestInfo(guestInfo);
    if (!validation.isValid) {
      setGuestFormTouched(true);
      return;
    }
    setCurrentStep(STEPS.CONFIRM);
  };

  const handleConfirm = () => {
    const orderNo = generateOrderNo();
    const order = {
      orderNo,
      status: 'success',
      searchParams,
      selectedList: selectedListForOrder,
      guestInfo,
      priceDetail: totalPriceDetail,
      createdAt: Date.now(),
    };
    setOrderData(order);
    setCurrentStep(STEPS.RESULT);
  };

  const handleBackToSearch = () => {
    setCurrentStep(STEPS.SEARCH);
    setSelections({});
    setGuestInfo({
      name: '',
      phone: '',
      idCard: '',
      email: '',
      remark: '',
    });
    setGuestFormTouched(false);
    setOrderData(null);
  };

  const goBack = (targetStep) => {
    setCurrentStep(targetStep);
    if (targetStep === STEPS.SEARCH) {
      setGuestFormTouched(false);
    }
  };

  return (
    <div className="hotel-booking">
      <div className="hb-container">
        <h1 className="hb-page-title">🏨 酒店预订</h1>

        <Steps currentStep={currentStep} />

        {currentStep === STEPS.SEARCH && (
          <div>
            <SearchSection onSearch={handleSearch} initialParams={searchParams} />

            {searchedHotels.length > 0 && (
              <RoomFilter filters={filters} onFilterChange={setFilters} />
            )}

            <HotelList
              hotels={searchedHotels}
              filters={filters}
              selections={selections}
              onSelectRoom={handleSelectRoom}
              onQuantityChange={handleQuantityChange}
            />

            {searchedHotels.length > 0 && (
              <div className="hb-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="hb-actions">
                  <div className="hb-actions-total">
                    已选 <strong style={{ fontSize: 14, margin: 0, color: '#ff6b35' }}>
                      {Object.keys(selections).length}
                    </strong> 种房型
                    {totalPriceDetail && (
                      <>
                        ，共 {totalPriceDetail.nights} 晚
                        <span>，合计：</span>
                        <strong>¥{totalPriceDetail.finalTotal.toFixed(2)}</strong>
                      </>
                    )}
                  </div>
                  <button
                    className="hb-btn hb-btn-primary"
                    onClick={goToGuestInfo}
                    disabled={!canGoToGuestInfo()}
                  >
                    下一步：填写信息 →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === STEPS.GUEST_INFO && (
          <div>
            <button className="hb-back-link" onClick={() => goBack(STEPS.SEARCH)}>
              ← 返回选择房型
            </button>

            <div className="hb-card">
              <GuestInfoForm
                guestInfo={guestInfo}
                onGuestInfoChange={(info) => {
                  setGuestInfo(info);
                  setGuestFormTouched(false);
                }}
                forceTouched={guestFormTouched}
              />
            </div>

            {totalPriceDetail && (
              <div className="hb-card">
                <h3 className="hb-card-title">💰 费用明细</h3>
                <PriceDetail priceDetail={totalPriceDetail} />
              </div>
            )}

            <div className="hb-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="hb-actions">
                <div className="hb-actions-total">
                  <span>应付金额：</span>
                  <strong>
                    ¥{totalPriceDetail?.finalTotal.toFixed(2) || '0.00'}
                  </strong>
                </div>
                <button
                  className="hb-btn hb-btn-primary"
                  onClick={goToConfirm}
                >
                  下一步：确认订单 →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === STEPS.CONFIRM && (
          <div>
            <button className="hb-back-link" onClick={() => goBack(STEPS.GUEST_INFO)}>
              ← 返回修改信息
            </button>

            <OrderConfirmation
              searchParams={searchParams}
              selections={selections}
              guestInfo={guestInfo}
              priceDetail={totalPriceDetail}
              hotelsData={hotelData}
            />

            <div className="hb-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="hb-actions">
                <div className="hb-actions-total">
                  <span>应付金额：</span>
                  <strong>
                    ¥{totalPriceDetail?.finalTotal.toFixed(2) || '0.00'}
                  </strong>
                </div>
                <button className="hb-btn hb-btn-primary" onClick={handleConfirm}>
                  ✅ 确认并提交订单
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === STEPS.RESULT && orderData && (
          <OrderResult orderData={orderData} onBackToSearch={handleBackToSearch} />
        )}
      </div>
    </div>
  );
}
