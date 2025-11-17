import React, { useState } from "react";
import { FaRegComment, FaRegStar, FaBookmark, FaBookmark as FilledBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import './PropertyCard.css';

const PropertyCard = ({ image, name, price, rating, onChatToggle }) => {
  const [isSaved, setIsSaved] = useState(false); // لحفظ حالة الـ Save
  const navigate = useNavigate();

  const handleSaveToggle = () => {
    setIsSaved((prev) => !prev);
  };

  return (
    <div className="property-card">
      <img src={image} alt={name} className="property-image" />

      <div className="property-details">
        <h3>{name}</h3>
        <p className="property-price">{price}</p>

        <div className="property-rating">
          {[...Array(5)].map((_, index) => (
            <FaRegStar key={index} className={index < rating ? "filled" : ""} />
          ))}
        </div>

        <div className="property-actions">
          {/* أيقونة الشات فقط */}
          <button className="icon-only" onClick={onChatToggle} title="Chat">
            <FaRegComment />
          </button>

          {/* زر البوكينج */}
          <button className="booking-btn" onClick={() => navigate("/booking")}>
            🏠 Booking
          </button>

          {/* أيقونة الحفظ */}
          <button
            className={`icon-only ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveToggle}
            title={isSaved ? "Unsave" : "Save"}
          >
            {isSaved ? <FilledBookmark /> : <FaBookmark />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

