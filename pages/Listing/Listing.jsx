import React, { useState } from "react";
import PropertyCard from "../../components/Cards/PropertyCard";
import { listingsData } from "../../utils/data";
import Filter from "./Filters";
import Chatbot from "../../components/ChatBot/ChatBot"; // تأكد من المسار
import '../Listing/listing.css'; // لو عندك ستايل للصفحة

const ListingsPage = () => {
  const [showChat, setShowChat] = useState(false);

  const handleChatToggle = () => {
    setShowChat(prev => !prev); // Toggle chat visibility
  };

  return (
    <div className="listing-page">
      <div className="filters">
        <Filter />
      </div>

      <div className="property-list">
        {listingsData.map((listing, index) => (
          <PropertyCard
            key={index}
            image={listing.image}
            name={listing.name}
            price={listing.price}
            rating={listing.rating}
            onChatToggle={handleChatToggle}
          />
        ))}
      </div>

      {/* الشات يظهر تحت الفلتر فقط عند الضغط على الأيقونة */}
      {showChat && (
        <div className="chatbot-under-filter">
          <Chatbot onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
