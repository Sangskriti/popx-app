import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaBuilding, FaCheckCircle, FaExclamationCircle, FaRocket } from 'react-icons/fa';

const CreateAccount = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    companyName: '',
    isAgency: 'yes'
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    companyName: '',
    isAgency: ''
  });
  
  // Field touched state
  const [touched, setTouched] = useState({
    fullName: false,
    phoneNumber: false,
    email: false,
    password: false,
    companyName: false,
    isAgency: false
  });

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Only alphabets and spaces are allowed';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name cannot exceed 50 characters';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    // Only allow numbers, + and - signs, max 14 characters
    if (!/^[\d+-]+$/.test(phone)) return 'Only numbers, + and - are allowed';
    if (phone.length < 10) return 'Phone number must be at least 10 digits';
    if (phone.length > 14) return 'Phone number cannot exceed 14 characters';
    return '';
  };

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

  const validateCompanyName = (name) => {
    if (!name.trim()) return 'Company name is required';
    if (name.trim().length < 2) return 'Company name must be at least 2 characters';
    return '';
  };

  const validateAgency = (value) => {
    if (!value) return 'Please select an option';
    return '';
  };

  // Handle input change with restrictions
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for full name - only allow alphabets and spaces
    if (name === 'fullName') {
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
      
      if (touched[name]) {
        setErrors(prev => ({ ...prev, [name]: validateName(filteredValue) }));
      }
    } 
    // Special handling for phone number - only allow numbers, + and -
    else if (name === 'phoneNumber') {
      const filteredValue = value.replace(/[^\d+-]/g, '');
      // Limit to 14 characters
      const truncatedValue = filteredValue.substring(0, 14);
      setFormData(prev => ({ ...prev, [name]: truncatedValue }));
      
      if (touched[name]) {
        setErrors(prev => ({ ...prev, [name]: validatePhone(truncatedValue) }));
      }
    } 
    // Special handling for email - prevent typing after .com
    else if (name === 'email') {
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
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (touched[name]) {
        let error = '';
        switch (name) {
          case 'password': error = validatePassword(value); break;
          case 'companyName': error = validateCompanyName(value); break;
          case 'isAgency': error = validateAgency(value); break;
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
      case 'fullName': error = validateName(value); break;
      case 'phoneNumber': error = validatePhone(value); break;
      case 'email': error = validateEmail(value); break;
      case 'password': error = validatePassword(value); break;
      case 'companyName': error = validateCompanyName(value); break;
      case 'isAgency': error = validateAgency(value); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleCreateAccount = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      fullName: validateName(formData.fullName),
      phoneNumber: validatePhone(formData.phoneNumber),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      companyName: validateCompanyName(formData.companyName),
      isAgency: validateAgency(formData.isAgency)
    };
    
    setErrors(newErrors);
    setTouched({
      fullName: true,
      phoneNumber: true,
      email: true,
      password: true,
      companyName: true,
      isAgency: true
    });
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      // Get fields with errors for Swal
      const errorFields = Object.entries(newErrors)
        .filter(([error]) => error !== '')
        .map(([field, error]) => {
          const fieldName = {
            fullName: 'Full Name',
            phoneNumber: 'Phone Number',
            email: 'Email Address',
            password: 'Password',
            companyName: 'Company Name',
            isAgency: 'Agency Selection'
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
        title: 'Account Created Successfully!',
        html: `
          <div style="font-size: 16px;">
            Welcome to PopX, <strong>${formData.fullName}</strong>!<br>
            Your account has been created successfully.
          </div>
        `,
        confirmButtonColor: '#6C63FF',
        confirmButtonText: 'Continue',
        showClass: {
          popup: 'animate__animated animate__bounceIn'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
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

        .required-star {
          color: #e74c3c;
          margin-left: 4px;
          font-weight: bold;
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

        .success-indicator {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #27ae60;
          font-size: 18px;
        }

        .radio-container {
          display: flex;
          gap: 30px;
          padding: 10px 0;
        }

        .radio-option {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          border-radius: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .radio-option:hover {
          background: #f0f0ff;
        }

        .radio-option input[type="radio"] {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .radio-option input[type="radio"]:checked {
          accent-color: #6C63FF;
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
            <FaRocket size={40} />
          </div>
          Create PopX Account
        </div>
        
        <div className="form-container">
          <Form onSubmit={handleCreateAccount}>
            <div className="form-group-wrapper">
              <Form.Label className="form-label">
                <FaUser />
                Full Name<span className="required-star">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                className={`form-control-popx ${touched.fullName && errors.fullName ? 'is-invalid' : ''} ${touched.fullName && !errors.fullName ? 'is-valid' : ''}`}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.fullName && !errors.fullName && (
                <div className="success-indicator">
                  <FaCheckCircle />
                </div>
              )}
              {touched.fullName && errors.fullName && (
                <div className="error-message">
                  <FaExclamationCircle />
                  {errors.fullName}
                </div>
              )}
              <div className="form-hint">Only alphabets and spaces are allowed</div>
            </div>
            
            <div className="form-group-wrapper">
              <Form.Label className="form-label">
                <FaPhone />
                Phone number<span className="required-star">*</span>
              </Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                className={`form-control-popx ${touched.phoneNumber && errors.phoneNumber ? 'is-invalid' : ''} ${touched.phoneNumber && !errors.phoneNumber ? 'is-valid' : ''}`}
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={14}
              />
              {touched.phoneNumber && !errors.phoneNumber && (
                <div className="success-indicator">
                  <FaCheckCircle />
                </div>
              )}
              {touched.phoneNumber && errors.phoneNumber && (
                <div className="error-message">
                  <FaExclamationCircle />
                  {errors.phoneNumber}
                </div>
              )}
              <div className="form-hint">Only numbers, + and - are allowed (max 14 characters)</div>
            </div>
            
            <div className="form-group-wrapper">
              <Form.Label className="form-label">
                <FaEnvelope />
                Email address<span className="required-star">*</span>
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
              {touched.email && !errors.email && (
                <div className="success-indicator">
                  <FaCheckCircle />
                </div>
              )}
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
                Password<span className="required-star">*</span>
              </Form.Label>
              <Form.Control
  type="password"
  name="password"
  className={`form-control-popx ${touched.password && errors.password ? 'is-invalid' : ''} ${touched.password && !errors.password ? 'is-valid' : ''}`}
  placeholder="Create a strong password"
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
            
            <div className="form-group-wrapper">
              <Form.Label className="form-label">
                <FaBuilding />
                Company name<span className="required-star">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                className={`form-control-popx ${touched.companyName && errors.companyName ? 'is-invalid' : ''} ${touched.companyName && !errors.companyName ? 'is-valid' : ''}`}
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.companyName && !errors.companyName && (
                <div className="success-indicator">
                  <FaCheckCircle />
                </div>
              )}
              {touched.companyName && errors.companyName && (
                <div className="error-message">
                  <FaExclamationCircle />
                  {errors.companyName}
                </div>
              )}
            </div>
            
            <div className="form-group-wrapper">
              <Form.Label className="form-label">
                Are you an Agency?<span className="required-star">*</span>
              </Form.Label>
              <div className="radio-container">
                <div className="radio-option">
                  <Form.Check
                    type="radio"
                    id="yes"
                    name="isAgency"
                    label="Yes"
                    value="yes"
                    checked={formData.isAgency === 'yes'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="radio-option">
                  <Form.Check
                    type="radio"
                    id="no"
                    name="isAgency"
                    label="No"
                    value="no"
                    checked={formData.isAgency === 'no'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              {touched.isAgency && errors.isAgency && (
                <div className="error-message">
                  <FaExclamationCircle />
                  {errors.isAgency}
                </div>
              )}
            </div>
            
            <Button type="submit" className="btn-popx w-100">
              Create Account
            </Button>
          </Form>
          
          <div className="login-link">
            Already have an account? 
            <a href="#" onClick={(e) => {e.preventDefault(); navigate('/login');}}>
              Login here
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;