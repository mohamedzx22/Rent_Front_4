import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pages/Login/login.css';
import loginImage from '../../assets/images/person.png'; // تأكد من أن المسار صحيح للصورة

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // LoginPage.jsx

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5062/api/Account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const msg = data.message
          || (data.errors ? Object.values(data.errors).flat().join('\n') : JSON.stringify(data));
        alert(msg);
        return;
      }
  
      // Save token, role, and userId to localStorage
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('refreshToken', data.refreshtoken); 
      window.dispatchEvent(new Event("storage"));
      localStorage.setItem('Role', data.role);
      localStorage.setItem('UserId', data.userId);
  
      // Redirect based on user role
      switch (data.role) {
  case 1: // Admin
    navigate('/admin');
    break;
  case 2: // Landlord
    navigate('/landlord');
    break;
  case 3: // Tenant
    navigate('/tenant');
    break;
  default:
    navigate('/login');
    break;
}
      console.log('Login response:', data);

    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred. Please try again.');
    }
  };


  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <img src={loginImage} alt="Login Illustration" className="login-image" />
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LoginPage;
