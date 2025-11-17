import React, { useState } from "react";
import "../Footer/footer.css";
import { Col, Container, Row, ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", toggleVisible);
  }

  return (
    <>
      <footer className="pt-5">
        <Container>
          <Row>
            <Col md="3" sm="12" className="quick_link mt-3 mt-md-0">
              <h4 className="mt-lg-0 mt-sm-3">Company</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <NavLink to="/about">About Us</NavLink>
                </ListGroup.Item>
                <ListGroup.Item>
                  <NavLink to="/about">Privacy Policy</NavLink>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md="3" sm="12" className="quick_link mt-3 mt-md-0">
              <h4 className="mt-lg-0 mt-sm-3">Explore</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <NavLink to="/contact">Contact Us</NavLink>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md="3" sm="12" className="quick_link mt-3 mt-md-0">
              <h4 className="mt-lg-0 mt-sm-3">Quick Links</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <NavLink to="/">Home</NavLink>
                </ListGroup.Item>
                <ListGroup.Item>
                  <NavLink to="/listings">Our Properties</NavLink>
                </ListGroup.Item>
                <ListGroup.Item>
                  <NavLink to="/contact">FAQs</NavLink>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md="3" sm="12" className="location mt-3 mt-md-0">
              <h4 className="mt-lg-0 mt-sm-3">Contact Info</h4>
              <div className="d-flex align-items-top my-2">
                <i className="bi bi-geo-alt me-3"></i>
                <a
                  target="_blank"
                  href="mailto:rawatcoder@gmail.com"
                  className="d-block"
                >
                rent_mate@gmail.com
                </a>
              </div>
              <div className="d-flex align-items-top">
                <i className="bi bi-telephone me-3"></i>
                <a target="_blank" href="tel:9876543210" className="d-block">
                  0123456789
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      <div
        id="back-top"
        onClick={scrollTop}
        className={visible ? "active" : ""}
      >
        <i className="bi bi-arrow-up"></i>
      </div>
    </>
  );
};

export default Footer;
