import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TenantDropdown from "../Tenant_dropdown/tenant_dropdown";
import "../Search/search.css";
import { Container, Row, Col, Button } from "react-bootstrap";



const Search = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const selectedLocation = (value) => {
    console.log("Location", value);
  };

  const selectedPropertyType = (value) => {
    console.log("Property Type", value);
  };

  const selectedGuest = (value) => {
    console.log("Guest", value);
  };

  return (
    <>
      <section className="box-search-advance">
        <Container>
          <Row>
            <Col md={12} xs={12}>
              <div className="box-search shadow-sm">
                <div className="item-search">
                  {/* Using Props to Pass Data */}
                  <TenantDropdown
                    label="Location"
                    onSelect={selectedLocation}
                    options={[
                      "Zamalek",
                      "Maadi",
                      "Garden City",
                      "Heliopolis",
                      "Nasr City",
                      "Helwan" ,
                    ]}
                  />
                </div>
                <div className="item-search item-search-2">
                  <label className="item-search-label">Move-in Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd, MMMM, yyyy"
                  />
                </div>
                <div className="item-search item-search-2">
                  <label className="item-search-label">Move-out Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={endDate}
                    endDate={startDate}
                    dateFormat="dd, MMMM, yyyy"
                  />
                </div>
                <div className="item-search">
                  <TenantDropdown
                    label="Property Type"
                    onSelect={selectedPropertyType}
                    options={[
                      "For Rent",
                      "For Sale",
                    ]}
                  />
                </div>
                <div className="item-search">
                  <TenantDropdown
                    label="Price"
                    onSelect={selectedPropertyType}
                    options={[
                      "50$",
                      "100$",
                       "150$",
                      "200$",
                    ]}
                  />
                </div>
                <div className="item-search">
                  <TenantDropdown
                    label="Rooms"
                    onSelect={selectedGuest}
                    options={[
                      "2 Rooms",
                      "3 Rooms",
                      "4 Rooms",
                    ]}
                  />
                </div>
                <div className="item-search bd-none">
                  <Button className="primaryBtn flex-even d-flex justify-content-center">
                    <i className="bi bi-search me-2"></i> Search
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Search;
