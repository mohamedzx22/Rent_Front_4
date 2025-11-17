import React from "react";
import { Accordion, Form } from "react-bootstrap";
import "../Listing/listing.css"
// في Filters.jsx
import { priceRanges } from "../../utils/data"; // تأكد من استخدام الاستيراد الصحيح
// في Filters.jsx
import { location} from "../../utils/data";
import "../Listing/listing.css"


const Filters = () => {
  return (
    <div className="side_bar">
      <div className="filter_box shadow-sm rounded-2">
        {/* Filter by Location */}
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Location</Accordion.Header>
            <Accordion.Body>
              {location.map((loc, inx) => {
                return (
                  <Form.Check
                    key={inx}
                    type="checkbox"
                    id={loc}
                    label={loc}
                    value={loc}
                  />
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Filter by Price Range */}
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="1">
            <Accordion.Header>Price Range</Accordion.Header>
            <Accordion.Body>
            {priceRanges.map((price, inx) => {
             return (
              <Form.Check
               key={inx}
               type="checkbox"
               id={price}
               label={price}
               value={price}
               />
               );
               })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Filter by Number of Rooms */}
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="2">
            <Accordion.Header>Number of Rooms</Accordion.Header>
            <Accordion.Body>
              {/* You can define specific values for rooms */}
              <Form.Check type="checkbox" label="1 Bedroom" />
              <Form.Check type="checkbox" label="2 Bedrooms" />
              <Form.Check type="checkbox" label="3+ Bedrooms" />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Filter by Space (Area in square feet) */}
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="3">
            <Accordion.Header>Space (sq. ft.)</Accordion.Header>
            <Accordion.Body>
              {/* You can define specific ranges for space */}
              <Form.Check type="checkbox" label="Below 500 sq. ft." />
              <Form.Check type="checkbox" label="500 - 1000 sq. ft." />
              <Form.Check type="checkbox" label="Above 1000 sq. ft." />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

      </div>
    </div>
  );
};

export default Filters;


