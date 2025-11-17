import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { propertyDetails } from "../../utils/data";
import { NavLink } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import {
  Container,
  Row,
  Nav,
  Col,
  Tab,
  ListGroup,
  Accordion,
  Card,
  Stack,
} from "react-bootstrap";

const PropertyDetails = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Property Details";
    window.scroll(0, 0);

    // محاكاة تحميل البيانات
    setTimeout(() => {
      setLoading(false);
    }, 2000); // تعيين فترة 2 ثانية كمثال
  }, []);

  if (loading) {
    return <div>Loading...</div>; // عرض رسالة أو مكون تحميل أثناء تحميل البيانات
  }

  return (
    <>
      <Breadcrumbs
        title={propertyDetails.title}
        pagename={<NavLink to="/properties">Properties</NavLink>}
        childpagename={propertyDetails.title}
      />

      <section className="property_details py-5">
        <Container>
          <Row>
            <h1 className="fs-2 font-bold mb-4">{propertyDetails.title} </h1>
            <ImageGallery
              items={propertyDetails.images}
              showNav={true}
              showBullets={true}
              showPlayButton={false}
            />

            <Tab.Container id="left-tabs-example" defaultActiveKey="1">
              <Row className="py-5">
                <Col md={8}>
                  <Nav variant="pills" className="flex-row nav_bars rounded-2">
                    <Nav.Item>
                      <Nav.Link eventKey="1">Overview</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="2">Features</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="3">Location</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content className="mt-4">
                    <Tab.Pane eventKey="1">
                      <div className="property_details">
                        <h1 className="font-bold mb-2 h3 border-bottom pb-2">
                          Overview
                        </h1>
                        <p>{propertyDetails.description}</p>
                        <h5>Property Info</h5>
                        <ListGroup>
                          {propertyDetails.propertyInfo.map((info, idx) => (
                            <ListGroup.Item key={idx} className="border-0 pt-0">
                              {info}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    </Tab.Pane>

                    {/* Additional Tabs content here */}
                  </Tab.Content>
                </Col>

                <Col md={4}>
                  {/* Price and Contact Info */}
                </Col>
              </Row>
            </Tab.Container>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default PropertyDetails;
