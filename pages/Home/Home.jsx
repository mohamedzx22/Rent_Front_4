import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/header';
import Footer from '../../components/common/Footer/footer';
import Search from '../../components/Search/search';
import Banner from '../../components/Banner/banner';
import Features from '../../components/Features/features';
import Cards from '../../components/Cards/Cards';
import rentalcards from '../../components/Cards/rentalcards';
import { propertiesData as destinationsData } from "../../utils/data";
import ContactUs from '../ContactUs/Contact';
import About from '../About/About'

const Home = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    // محاكاة تحميل البيانات
    setDestinations(destinationsData); // استبدال هذا عند الحاجة لطلب بيانات من API
  }, []);

  return (
    <>
      <Banner />
      <Search />
      <Features />
      {/* تمرير الـ destinations كـ props إلى مكون الكروت */}
      <div className="home-section">
        <div className="cards">
          <Cards destinations={destinations} />
        </div>
      </div>
    </>
  );
};

export default Home;
