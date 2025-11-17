import React, { useState, useEffect } from 'react';
import { Container, Row, Navbar, Offcanvas, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink, useNavigate } from 'react-router-dom';
import '../Header/header.css';
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMenu = () => setShow(!show);

  const handleScroll = () => {
    setIsSticky(window.scrollY >= 120);
  };

  // Remove all related tokens
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5062/api/Account/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Logout failed:', error);
    }

    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUserRole(role);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleProfileClick = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      
      // Map role numbers to route paths
      const roleRoutes = {
        '1': 'admin',
        '2': 'landlord',
        '3': 'tenant'
      };
      
      const route = roleRoutes[role];
      if (route) {
        navigate(`/${route}`);
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error("Invalid token");
      navigate('/login');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={`header-section ${isSticky ? 'is-sticky' : ''}`}>
      <Container>
        <Row>
          <Navbar expand="lg" className="p-0">
            {/* Logo Section */}
            <Navbar.Brand as={NavLink} to="/" className="me-auto">
              {/* Add your logo here */}
            </Navbar.Brand>

            {/* Desktop Menu */}
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={NavLink} to="/" exact>Home</Nav.Link>
                <Nav.Link as={NavLink} to="/about">About Us</Nav.Link>
                <Nav.Link as={NavLink} to="/listings">Latest Listing</Nav.Link>
                <Nav.Link as={NavLink} to="/contact">Contact Us</Nav.Link>

                {isLoggedIn && (
                  <Nav.Link onClick={handleProfileClick}>Profile</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>

            {/* Auth Buttons - Desktop */}
            <div className="d-flex ms-md-4">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="primaryBtn d-none d-sm-inline-block"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink 
                    to="/register" 
                    className="primaryBtn d-none d-sm-inline-block me-2"
                  >
                    Register
                  </NavLink>
                  <NavLink 
                    to="/login" 
                    className="primaryBtn d-none d-sm-inline-block"
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Navbar.Toggle 
              aria-controls="offcanvasNavbar" 
              onClick={toggleMenu}
              className="border-0"
            />

            {/* Mobile Menu */}
            <Offcanvas 
              show={show} 
              onHide={toggleMenu} 
              placement="end"
              className="mobile-menu"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-column">
                  <Nav.Link as={NavLink} to="/" exact onClick={toggleMenu}>Home</Nav.Link>
                  <Nav.Link as={NavLink} to="/about" onClick={toggleMenu}>About Us</Nav.Link>
                  <Nav.Link as={NavLink} to="/listings" onClick={toggleMenu}>Latest Listing</Nav.Link>
                  <Nav.Link as={NavLink} to="/contact" onClick={toggleMenu}>Contact Us</Nav.Link>

                  {isLoggedIn ? (
                    <>
                      <Nav.Link 
                        onClick={() => {
                          handleProfileClick();
                          toggleMenu();
                        }}
                      >
                        Profile
                      </Nav.Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="nav-link text-start border-0 bg-transparent p-0"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Nav.Link as={NavLink} to="/register" onClick={toggleMenu}>Register</Nav.Link>
                      <Nav.Link as={NavLink} to="/login" onClick={toggleMenu}>Login</Nav.Link>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
          </Navbar>
        </Row>
      </Container>
    </section>
  );
};

export default Header;