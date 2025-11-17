import React from "react";
import { Carousel } from "react-bootstrap";
import sliderImg from "../../assets/images/slider1.jpg";
import sliderImg1 from "../../assets/images/slider2.jpg";
import "../Banner/banner.css"

const Banner = () => {
  return (
    <>
      <section className="slider">
        <Carousel variant="dark">
          <Carousel.Item>
            <img src={sliderImg} className="d-block w-100" alt="First slide" />
            <Carousel.Caption>
              <div className="slider_des">
                <h5 className="heading">
                  Discover <span>Properties for Rent and Sale</span>
                </h5>
                <p className="sub_text">
                  We offer a wide range of premium properties in the best locations. 
                  Find the perfect place to call home and enjoy a unique living experience.
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img src={sliderImg1} className="d-block w-100" alt="Second slide" />
            <Carousel.Caption>
              <div className="slider_des">
                <h5 className="heading">
                  Best <span>Real Estate Deals</span>
                </h5>
                <p className="sub_text">
                  Find the best apartments for rent and sale at competitive prices. 
                  We guarantee the best deals in the real estate market.
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>
    </>
  );
};

export default Banner;
