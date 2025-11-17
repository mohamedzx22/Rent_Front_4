import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import "../../pages/ContactUs/contactus.css"; // التأكد من استيراد الـ CSS هنا
import Footer from "../../components/common/Footer/footer";
import { Col, Container, Row, Card, Form, FloatingLabel, Button, Alert } from "react-bootstrap";
import image from "../../assets/images/contact.jpg";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact us";
    window.scroll(0, 0);
  }, []);

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // validation logic
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required.";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone must be numbers only.";
    }

    if (!formData.message.trim()) newErrors.message = "Message is required.";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } else {
      setErrors(validationErrors);
      setSubmitted(false);
    }
  };

  return (
    <>
      <Breadcrumbs title="Contact us" pagename="Contact us" />
      <section className="contact pt-5">
        <Container>
          {/* Info Cards هنا زي ما هي */}

          <Row className="py-5 align-items-center">
            <Col xl="6" md="6" className="d-none d-md-block">
              <img src={image} alt="" className="img-fluid me-3" />
            </Col>
            <Col xl="6" md="6">
              <Card className="bg-light p-4 border-0 shadow-sm">
                <div className="form-box">
                  <h1 className="h3 font-bold mb-4">Send us message</h1>

                  {submitted && (
                    <Alert variant="success">Message sent successfully!</Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="6">
                        <FloatingLabel controlId="name" label="Full Name" className="mb-4">
                          <Form.Control
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md="6">
                        <FloatingLabel controlId="email" label="Email address" className="mb-4">
                          <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>

                      <Col md="12">
                        <FloatingLabel controlId="phone" label="Phone Number" className="mb-4">
                          <Form.Control
                            type="text"
                            placeholder="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            isInvalid={!!errors.phone}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>

                      <Col md="12">
                        <FloatingLabel controlId="message" label="Message">
                          <Form.Control
                            as="textarea"
                            placeholder="Message"
                            style={{ height: "126px" }}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            isInvalid={!!errors.message}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.message}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Button className="primaryBtn mt-3" type="submit">
                      Send Message
                    </Button>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;
