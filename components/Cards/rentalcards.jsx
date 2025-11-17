import React from 'react';
import "../Cards/card.css";
import { Card, Stack } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const RentalCards = ({ val }) => {
  if (!val) return null;

  return (
    <Card className="rounded-2 shadow-sm popular">
      <Card.Img
        variant="top"
        src={val.image || "https://via.placeholder.com/400x250"}
        className="img-fluid"
        alt="image"
      />
      <Card.Body>
        <Card.Text>
          <i className="bi bi-geo-alt"></i>
          <span className="text ms-1">{val.location || "Unknown Location"}</span>
        </Card.Text>

        <Card.Title>
          <NavLink className="body-text text-dark text-decoration-none" to="/tour-details">
            {val.title || "No Title"}
          </NavLink>
        </Card.Title>

        <p className="review">
          <i className="bi bi-star-fill me-1 text-warning"></i>
          <span>{val.rating || 0} </span>
          <span>({val.reviews || 0} reviews)</span>
        </p>

        {val.category && val.category.map((cat, index) => (
          <span key={index} className={`${cat.replace(/ .*/, "")} badge me-1`}>
            {cat}
          </span>
        ))}
      </Card.Body>

      <Card.Footer className="py-4">
        {val.afterDiscount && (
          <p className="text-decoration-line-through text-muted">
            ${val.price?.toFixed(2)}
          </p>
        )}

        <Stack direction="horizontal" className="justify-content-between mt-3">
          <p>
            From <b>${val.afterDiscount ? val.afterDiscount.toFixed(2) : val.price.toFixed(2)}</b>
          </p>
          <p>
            <i className="bi bi-clock"></i> {val.days || "N/A"}
          </p>
        </Stack>
      </Card.Footer>
    </Card>
  );
};

export default RentalCards;
