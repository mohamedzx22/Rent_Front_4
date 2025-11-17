import React, { useEffect } from "react";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { Container, Row, Col, Card } from "react-bootstrap";
import aboutImg from "../../assets/images/about/about.jpg";
import "../About/About.css";
import icons1 from "../../assets/images/icons/google-maps.png";
import icons2 from "../../assets/images/icons/customer-service.png";
import icons3 from "../../assets/images/icons/best-price.png";

const About = () => {

  useEffect(() => {
    document.title = "About us ";
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs title="About us" pagename="About us" />
      <section className="py-5">
        <Container>
          <Row>
            <Col md="8">
              <div className="about-content">
                <div className="about-image position-relative">
                  <img
                    src={aboutImg}
                    alt="about"
                    className="img-fluid rounded-5"
                  />
                  <div className="about-image-content position-absolute top-50 end-0 p-md-4 p-3 rounded-5 shadow-sm">
                    <h3 className="h2 fw-bold text-white">
                      WHY WE ARE THE BEST IN REAL ESTATE?
                    </h3>
                  </div>
                </div>
              </div>
              <h2 className="h2 font-bold pt-4 pb-2">
                WHY WE ARE THE BEST IN REAL ESTATE?
              </h2>
              <p className="body-text mb-2">
                We provide top-notch real estate solutions tailored to your needs,
                whether you're looking for a rental apartment or a long-term investment.
                Our team is committed to offering properties in prime locations at competitive prices.
              </p>
              <p className="body-text mb-2">
                Our platform features a wide range of updated listings including apartments,
                villas, and offices, ensuring you always find what fits your lifestyle and budget.
              </p>
              <p className="body-text mb-2">
                Whether you're an individual searching for a new home or a company looking for office space,
                we're here to make your property journey seamless and efficient.
              </p>
            </Col>
            <Col md="4">
              {/* First Card */}
              <Card className="border-0 shadow-sm rounded-3 mb-4">
                <Card.Body className="text-center">
                  <div className="d-flex justify-content-center my-2">
                    <div className="card-icon">
                      <img src={icons1} alt="google-maps" />
                    </div>
                  </div>
                  <Card.Title className="fw-bold h5">50+ Prime Locations</Card.Title>
                  <p className="mb-2 body-text">
                    Explore a wide selection of properties in over 50 top locations across the Kingdom,
                    designed to meet every need and lifestyle.
                  </p>
                </Card.Body>
              </Card>

              {/* Second Card */}
              <Card className="border-0 shadow-sm rounded-3 mb-4">
                <Card.Body className="text-center">
                  <div className="d-flex justify-content-center my-2">
                    <div className="card-icon">
                      <img src={icons2} alt="customer-service" />
                    </div>
                  </div>
                  <Card.Title className="fw-bold h5">Best Prices in the Market</Card.Title>
                  <p className="mb-2 body-text">
                    We ensure fair and affordable pricing without compromising on the quality of properties or service.
                  </p>
                </Card.Body>
              </Card>

              {/* Third Card */}
              <Card className="border-0 shadow-sm rounded-3 mb-4">
                <Card.Body className="text-center">
                  <div className="d-flex justify-content-center my-2">
                    <div className="card-icon">
                      <img src={icons3} alt="best-price" />
                    </div>
                  </div>
                  <Card.Title className="fw-bold h5">Super Fast Booking</Card.Title>
                  <p className="mb-2 body-text">
                    Book your property or schedule a viewing easily through our platform with just a few clicks —
                    fast, simple, and secure.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;