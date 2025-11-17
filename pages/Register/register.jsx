import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../pages/Register/register.css';
import registerImage from '../../assets/images/person.png'; // تأكد أن المسار صحيح
import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // تحقق من أن جميع الحقول ممتلئة
    if (!username || !email || !password || !confirmPassword || !role || !phone) {
      alert('Please fill all fields.');
      return;
    }
  
    // تحقق من تطابق كلمات المرور
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    // تجهيز البيانات لإرسالها كـ JSON
    const payload = {
      username,
      email,
      password,
      confirmPassword,
      role,
      phone
    };
  
    try {
      const response = await axios.post(
        'http://localhost:5062/api/Account/register',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log(response.data);
      alert('Registered Successfully!');
      navigate('/login'); // توجيه المستخدم إلى صفحة تسجيل الدخول بعد النجاح
    } catch (error) {
      console.error('Error Response:', error.response?.data || error.message);
      alert(error.response?.data || 'Registration failed. Please try again.');
    }
  };
  

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <img src={registerImage} alt="Register Illustration" className="register-image" />
        <h2>Create an Account</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="Landlord">Landlord</option>
          <option value="Tenant">Tenant</option>
        </select>

        <button type="submit">Create Account</button>

        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
