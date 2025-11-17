


import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaRegSave, FaRegEye } from 'react-icons/fa';
import "../Cards/card.css"; // تأكدي من المسار

const Cards = ({ destinations }) => {
  const [saved, setSaved] = useState({});
  const [showMessage, setShowMessage] = useState({});

  const handleSaveClick = (name) => {
    setSaved((prevSaved) => ({
      ...prevSaved,
      [name]: !prevSaved[name],
    }));
  };

  const handleMoreClick = (name) => {
    setShowMessage((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="cards-container d-flex flex-wrap gap-3 justify-content-center">
      {destinations.map((destination, index) => (
        <div className="img-box" key={index}>
          <Card className="h-100 shadow-sm">
            <Card.Img
              variant="top"
              src={destination.image || "https://via.placeholder.com/400x250"}
              className="img-fluid"
              alt={destination.name || "Property"}
            />
            <Card.Body>
              <Card.Title className="mb-2">
                {destination.name || "No Name"}
              </Card.Title>

              <div className="location-price">
                <p>{destination.location || "No Location"}</p>
                <p className="price">{destination.price || "$0"}</p>
              </div>

              <div className="icon-container d-flex justify-content-between">
                <div
                  className="more-icon"
                  onClick={() => handleMoreClick(destination.name)}
                >
                  <FaRegEye size={24} />
                </div>

                <div
                  className="save-icon"
                  onClick={() => handleSaveClick(destination.name)}
                >
                  <FaRegSave
                    size={24}
                    color={saved[destination.name] ? 'gold' : '#62643c'}
                  />
                </div>
              </div>

              {showMessage[destination.name] && (
                <div className="message mt-2">
                  <p>Details for {destination.name} have been revealed!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Cards;
