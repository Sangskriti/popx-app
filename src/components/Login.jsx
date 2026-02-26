import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaExclamationCircle, FaUserCircle } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  // Field touched state
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  // Validation functions (matching create account component)
  const validateEmail = (email) => {
    if (!email.trim()) return 'Email address is required';
    
    // Gmail-specific validation
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    // Check for Gmail specific rules
    const localPart = email.split('@')[0];
    const domain = email.split('@')[1];
    
    // Local part rules
    if (localPart.startsWith('.') || localPart.endsWith('.')) return 'Email cannot start or end with a dot';
    if (localPart.includes('..')) return 'Email cannot contain consecutive dots';
    if (localPart.length > 30) return 'Username part is too long (max 30 characters)';
    
    // Domain rules
    if (!domain.includes('.')) return 'Invalid domain format';
    
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  // Handle input change with restrictions
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for email - prevent typing after .com
    if (name === 'email') {
      // Check if email contains .com
      const comIndex = value.toLowerCase().indexOf('.com');
      let filteredValue = value;
      
      if (comIndex !== -1) {
        // If user tries to type after .com, truncate it
        const cursorPosition = e.target.selectionStart;
        const comEndIndex = comIndex + 4; // .com is 4 characters
        
        if (cursorPosition > comEndIndex) {
          // User is trying to type after .com, prevent it
          filteredValue = value.substring(0, comEndIndex);
        } else if (value.length > comEndIndex) {
          // Somehow value is longer than it should be after .com
          filteredValue = value.substring(0, comEndIndex);
        }
      }
      
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
      
      if (touched[name]) {
        setErrors(prev => ({ ...prev, [name]: validateEmail(filteredValue) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (touched[name]) {
        let error = '';
        switch (name) {
          case 'password': error = validatePassword(value); break;
          default: break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let error = '';
    switch (name) {
      case 'email': error = validateEmail(value); break;
      case 'password': error = validatePassword(value); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };
    
    setErrors(newErrors);
    setTouched({
      email: true,
      password: true
    });
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      // Get fields with errors for Swal
      const errorFields = Object.entries(newErrors)
        .filter(([error]) => error !== '')
        .map(([field, error]) => {
          const fieldName = {
            email: 'Email Address',
            password: 'Password'
          }[field];
          return `<div style="margin: 5px 0;"><strong>${fieldName}:</strong> ${error}</div>`;
        });
      
      Swal.fire({
        icon: 'warning',
        title: 'Please Complete the Form',
        html: `
          <div style="text-align: left; font-size: 14px;">
            The following fields need attention:
            ${errorFields.join('')}
          </div>
        `,
        confirmButtonColor: '#6C63FF',
        confirmButtonText: 'Got it!',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    } else {
      // Success animation
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        html: `
          <div style="font-size: 16px;">
            Welcome back to PopX!<br>
            Redirecting to your account...
          </div>
        `,
        confirmButtonColor: '#6C63FF',
        confirmButtonText: 'Continue',
        showClass: {
          popup: 'animate__animated animate__bounceIn'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        navigate('/account-settings');
      });
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .mobile-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .mobile-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(108, 99, 255, 0.05) 0%, transparent 70%);
          animation: rotate 30s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .popx-header {
          background: linear-gradient(135deg, #6C63FF 0%, #8b85ff 100%);
          color: white;
          padding: 30px 10px;
          text-align: center;
          font-weight: bold;
          font-size: 28px;
          position: relative;
          z-index: 1;
          border-bottom: none;
          box-shadow: 0 10px 30px rgba(108, 99, 255, 0.2);
          overflow: hidden;
        }

        .popx-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="none" width="100" height="100"/><path d="M0,0 L100,100 M100,0 L0,100" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></svg>');
          background-size: 20px 20px;
          opacity: 0.5;
        }

        .popx-header-icon {
          display: inline-block;
          margin-bottom: 10px;
          animation: float 3s ease-in-out infinite;
        }

        .form-container {
          background: white;
          margin: -20px 20px 20px;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          position: relative;
          z-index: 2;
          animation: slideIn 0.5s ease-out;
        }

        .form-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          font-size: 14px;
        }

        .form-label svg {
          margin-right: 8px;
          color: #6C63FF;
        }

        .form-control-popx {
          border-radius: 12px !important;
          padding: 14px 15px !important;
          border: 2px solid #e0e0e0 !important;
          font-size: 15px !important;
          transition: all 0.3s ease !important;
          background: #f8f9fa !important;
        }

        .form-control-popx:focus {
          border-color: #6C63FF !important;
          box-shadow: 0 0 0 0.2rem rgba(108, 99, 255, 0.25) !important;
          background: white !important;
        }

        .form-control-popx.is-invalid {
          border-color: #e74c3c !important;
          background: #fff5f5 !important;
        }

        .form-control-popx.is-valid {
          border-color: #27ae60 !important;
          background: #f0fff4 !important;
        }

        .error-message {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
          display: flex;
          align-items: center;
          animation: slideIn 0.3s ease-out;
        }

        .error-message svg {
          margin-right: 5px;
          font-size: 14px;
        }

        .btn-popx {
          background: linear-gradient(135deg, #6C63FF 0%, #8b85ff 100%) !important;
          border: none !important;
          color: white !important;
          border-radius: 12px !important;
          padding: 15px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3) !important;
          position: relative !important;
          overflow: hidden !important;
          margin-top: 20px;
        }

        .btn-popx:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(108, 99, 255, 0.4) !important;
        }

        .btn-popx:active {
          transform: translateY(0) !important;
        }

        .btn-popx-secondary {
          background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%) !important;
          border: none !important;
          color: #6c757d !important;
          border-radius: 12px !important;
          padding: 15px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
          position: relative !important;
          overflow: hidden !important;
          margin-top: 20px;
        }

        .btn-popx-secondary:hover {
          background: linear-gradient(135deg, #d0d0d0 0%, #e5e5e5 100%) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
        }

        .btn-popx-secondary:active {
          transform: translateY(0) !important;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          color: #6c757d;
          font-size: 14px;
        }

        .login-link a {
          color: #6C63FF;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-link a:hover {
          color: #5a52d5;
          text-decoration: underline;
        }

        .form-group-wrapper {
          position: relative;
          margin-bottom: 20px;
        }

        .password-strength {
          font-size: 11px;
          margin-top: 5px;
          color: #6c757d;
        }

        .password-strength.strong {
          color: #27ae60;
        }

        .password-strength.medium {
          color: #f39c12;
        }

        .password-strength.weak {
          color: #e74c3c;
        }

        .form-hint {
          font-size: 11px;
          color: #6c757d;
          margin-top: 5px;
        }

        .form-hint.error {
          color: #e74c3c;
        }
      `}</style>

      <div className="mobile-container">
        <div className="popx-header">
          <div className="popx-header-icon">
            <FaUserCircle size={40} />
          </div>
          Signin to your PopX account
        </div>
        
        <div className="form-container">
          <Form onSubmit={handleLogin}>
            <div className="form-group-wrapper">
              <Form.Label className="form-label">
                <FaEnvelope />
                Email address
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                className={`form-control-popx ${touched.email && errors.email ? 'is-invalid' : ''} ${touched.email && !errors.email ? 'is-valid' : ''}`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <div className="error-message">
                  <FaExclamationCircle />
                  {errors.email}
                </div>
              )}
              <div className="form-hint">Please enter a valid email address</div>
            </div>
            
            <div className="form-group-wrapper">
              <Form.Label className="form-label">
                <FaLock />
                Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                className={`form-control-popx ${touched.password && errors.password ? 'is-invalid' : ''} ${touched.password && !errors.password ? 'is-valid' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && (
                <div className="error-message">
                  <FaExclamationCircle />
                  {errors.password}
                </div>
              )}
              {formData.password && (
                <div className={`password-strength ${
                  formData.password.length >= 12 ? 'strong' : 
                  formData.password.length >= 8 ? 'medium' : 'weak'
                }`}>
                  Password strength: {
                    formData.password.length >= 12 ? 'Strong' : 
                    formData.password.length >= 8 ? 'Medium' : 'Weak'
                  }
                </div>
              )}
              <div className="form-hint">Must contain uppercase, lowercase, and number</div>
            </div>
            
            <Button type="submit" className="btn-popx-secondary w-100">
              Login
            </Button>
          </Form>
          
          <div className="login-link">
            Don't have an account? 
            <a href="#" onClick={(e) => {e.preventDefault(); navigate('/create-account');}}>
              Create Account
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;