import React from 'react';
import { filterRooms } from '../utils/validators';

function RoomCard({ room, selected, quantity, onSelect, onQuantityChange, maxQuantity }) {
  const handleQuantityDown = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleQuantityUp = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div
      className={`hb-room-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect()}
      style={{ cursor: 'pointer' }}
    >
      <div className="hb-room-info">
        <h5 className="hb-room-name">{room.name}</h5>
        <div className="hb-room-desc">
          <span className="hb-room-spec bed">🛏️ {room.bedDesc}</span>
          <span className="hb-room-spec">👥 可住{room.maxGuests}人</span>
          <span className="hb-room-spec">📐 {room.size}㎡</span>
          <span className="hb-room-spec">🏢 {room.floor}</span>
        </div>
        <div className="hb-room-desc">
          <span
            className={`hb-room-spec ${
              room.hasBreakfast ? 'breakfast-yes' : 'breakfast-no'
            }`}
          >
            {room.hasBreakfast ? '✅' : '❌'} {room.breakfastDesc}
          </span>
        </div>
        {room.remaining <= 3 && (
          <div className="hb-room-bottom">
            <span className="hb-room-remaining">
              ⚠️ 仅剩 {room.remaining} 间房
            </span>
          </div>
        )}
      </div>

      <div className="hb-room-price-box">
        <div style={{ textAlign: 'right' }}>
          <div>
            <span className="hb-room-price">¥{room.price}</span>
            <span className="hb-room-price-unit">/晚</span>
          </div>
          {selected && (
            <div className="hb-quantity">
              <button
                className="hb-quantity-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityDown();
                }}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="hb-quantity-value">{quantity}</span>
              <button
                className="hb-quantity-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityUp();
                }}
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HotelList({
  hotels,
  filters,
  selections,
  onSelectRoom,
  onQuantityChange,
}) {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="hb-card hb-empty">
        <div className="hb-empty-icon">🏨</div>
        <div className="hb-empty-text">请输入搜索条件查找酒店</div>
      </div>
    );
  }

  const hotelsWithFilteredRooms = hotels.map((hotel) => ({
    ...hotel,
    filteredRooms: filterRooms(hotel.rooms, filters),
  }));

  const totalFilteredRooms = hotelsWithFilteredRooms.reduce(
    (sum, h) => sum + h.filteredRooms.length,
    0
  );

  if (totalFilteredRooms === 0) {
    return (
      <div className="hb-card hb-empty">
        <div className="hb-empty-icon">🔍</div>
        <div className="hb-empty-text">没有符合筛选条件的房型，请调整筛选条件</div>
      </div>
    );
  }

  return (
    <div>
      {hotelsWithFilteredRooms.map((hotel) => {
        if (hotel.filteredRooms.length === 0) return null;
        return (
          <div key={hotel.id} className="hb-card hb-hotel-card">
            <div className="hb-hotel-header">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="hb-hotel-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiPuWwj+W6i+WbvueJhDwvdGV4dD48L3N2Zz4=';
                }}
              />
              <div className="hb-hotel-info">
                <h4 className="hb-hotel-name">{hotel.name}</h4>
                <div className="hb-hotel-meta">
                  <span className="hb-rating">★ {hotel.rating}</span>
                  <span className="hb-rating-text">{hotel.reviews}条评价</span>
                </div>
                <div className="hb-hotel-location">📍 {hotel.location}</div>
                <div className="hb-tags">
                  {hotel.tags.map((tag, idx) => (
                    <span key={idx} className="hb-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="hb-rooms">
              <h5 className="hb-rooms-title">可选房型（{hotel.filteredRooms.length}种）</h5>
              {hotel.filteredRooms.map((room) => {
                const selectionKey = `${hotel.id}_${room.id}`;
                const selection = selections[selectionKey];
                return (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={!!selection}
                    quantity={selection?.quantity || 1}
                    maxQuantity={room.remaining}
                    onSelect={() => onSelectRoom(hotel, room)}
                    onQuantityChange={(qty) =>
                      onQuantityChange(hotel.id, room.id, qty)
                    }
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { RoomCard };
