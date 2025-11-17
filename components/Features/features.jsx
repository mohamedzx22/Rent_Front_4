import React from "react";
import "../Features/features.css";

// Images for features
import feature1 from "../../assets/images/Features/beach.png";
import feature2 from "../../assets/images/Features/deal.png";
import feature3 from "../../assets/images/Features/booking.png";
import feature4 from "../../assets/images/Features/reviews.png";
// React-Bootstrap components
import { Card, Col, Container, Row } from "react-bootstrap";

// Slick Carousel for sliding feature cards
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Features = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplay: true,
          prevArrow: false,
          nextArrow: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          prevArrow: false,
          nextArrow: false,
        },
      },
    ],
  };

  const featureList = [
    {
      id: 0,
      image: feature1,
      title: "Discover the Possibilities",
      des: "Explore thousands of vacation rentals, beach houses, and unique properties around the world. Find the perfect spot for your next getaway!",
    },
    {
      id: 1,
      image: feature2,
      title: "Exclusive Deals & Offers",
      des: "Save more on your next vacation with our special offers, exclusive discounts, and rewards. Unlock more savings as a Rent Mate member!",
    },
    {
      id: 2,
      image: feature3,
      title: "Easy Booking, Anytime",
      des: "With Rent Mate, you can book your stay at any time, skip the lines, and even get free cancellations. Flexibility at its best.",
    },
    {
      id: 3,
      image: feature4,
      title: "Trustworthy Reviews & Support",
      des: "Our community of guests and hosts provide honest reviews to help you make informed decisions. We're here for you 24/7 with top-tier customer support.",
    },
  ];

  return (
    <section className="feature-section">
      <Container>
        <Row>
          <Col md="12">
            <Slider {...settings}>
              {featureList.map((feature, inx) => {
                return (
                  <Card key={inx} className="feature-card">
                    <Card.Img
                      variant="top"
                      src={feature.image}
                      className="img-fluid"
                      alt={feature.title}
                    />
                    <Card.Body>
                      <Card.Title>{feature.title}</Card.Title>
                      <Card.Text>{feature.des}</Card.Text>
                    </Card.Body>
                  </Card>
                );
              })}
            </Slider>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Features;
