import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
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

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes morph {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .logo-container {
          transition: all 0.3s ease;
        }

        .logo-container:hover {
          transform: rotate(5deg) scale(1.1);
        }

        .logo-ring {
          animation: rotate 20s linear infinite;
        }

        .morph-shape {
          animation: morph 8s ease-in-out infinite;
        }

        .btn-popx {
          background: linear-gradient(135deg, #6C63FF 0%, #9B94FF 100%) !important;
          border: none !important;
          color: white !important;
          border-radius: 12px !important;
          padding: 16px !important;
          font-weight: 600 !important;
          font-size: 18px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3) !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .btn-popx::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-popx:hover::before {
          left: 100%;
        }

        .btn-popx:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(108, 99, 255, 0.4) !important;
        }

        .btn-popx-secondary {
          background-color: #f8f9fa !important;
          border: 2px solid #e9ecef !important;
          color: #6C63FF !important;
          border-radius: 12px !important;
          padding: 16px !important;
          font-weight: 600 !important;
          font-size: 18px !important;
          transition: all 0.3s ease !important;
        }

        .btn-popx-secondary:hover {
          background-color: #6C63FF !important;
          color: white !important;
          border-color: #6C63FF !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 15px rgba(108, 99, 255, 0.2) !important;
        }

        .welcome-title {
          font-size: 42px !important;
          font-weight: 500 !important;
          color: #222;
          background-clip: text;
          margin-bottom: 20px !important;
          letter-spacing: -0.5px;
        }

        .welcome-subtitle {
          font-size: 20px !important;
          line-height: 1.6 !important;
          color: #6c757d !important;
          font-weight: 400 !important;
          max-width: 320px;
          margin: 0 auto;
        }

        .mobile-container {
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
        }

        .decorative-dots {
          position: absolute;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #6C63FF 0%, #9B94FF 100%);
          border-radius: 50%;
          opacity: 0.3;
        }

        .dot-1 { top: 20%; left: 10%; animation: float 4s ease-in-out infinite; }
        .dot-2 { top: 30%; right: 15%; animation: float 3s ease-in-out infinite 0.5s; }
        .dot-3 { bottom: 40%; left: 20%; animation: float 5s ease-in-out infinite 1s; }
        .dot-4 { bottom: 30%; right: 10%; animation: float 3.5s ease-in-out infinite 1.5s; }
      `}</style>

      <div className="mobile-container position-relative">
        {/* Decorative dots */}
        <div className="decorative-dots dot-1"></div>
        <div className="decorative-dots dot-2"></div>
        <div className="decorative-dots dot-3"></div>
        <div className="decorative-dots dot-4"></div>

        <Container className="d-flex flex-column h-100 justify-content-between p-4">
          <div className="text-center mt-5">
            <div 
              className={`logo-container position-relative ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
              style={{ 
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                animationDelay: '0.2s'
              }}
            >
              <div>

                {/* Additional glow effects */}
                <div 
                  className="position-absolute rounded-circle"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div 
            className={`text-center my-5 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.4s' }}
          >
            <h1 className="welcome-title">Welcome to PopX</h1>
            <p className="welcome-subtitle">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
            </p>
          </div>
          
          <div 
            className={`d-grid gap-3 mb-5 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.6s' }}
          >
            <Button 
              className="btn-popx"
              onClick={() => navigate('/create-account')}
            >
              Create Account
            </Button>
            <Button 
              className="btn-popx-secondary"
              onClick={() => navigate('/login')}
            >
              Already Registered? Login
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Landing;