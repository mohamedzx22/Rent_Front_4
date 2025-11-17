

import React from 'react';
import ReactDOM from 'react-dom/client'; // تأكد من أنك تستخدم react-dom/client
import { BrowserRouter } from 'react-router-dom'; // استيراد BrowserRouter
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* لف التطبيق بالكامل بـ BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
