import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Decode the JWT token to get user info
      const decoded = jwtDecode(credentialResponse.credential);
      const userEmail = decoded.email;

      // Verify email with backend
      const response = await fetch('/api/admin/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok && data.authorized) {
        // Email is whitelisted - grant access
        onLoginSuccess();
      } else {
        // Email not whitelisted - show error
        setErrorMessage('Access denied. Your email is not authorized for admin access.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMessage('Google login failed. Please try again.');
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="admin-login-overlay">
        <div className="admin-login-container">
          <button className="close-button" onClick={onCancel}>×</button>

          <h2>Admin Access</h2>
          <p className="login-subtitle">Sign in to access the admin dashboard</p>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div className="spinner" style={{
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #1a4d2e',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
              <p style={{ marginTop: '1rem', color: '#64748b' }}>Verifying access...</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>

              {errorMessage && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  {errorMessage}
                </div>
              )}

              <div className="divider">
                <span>or</span>
              </div>

              <button className="override-btn" onClick={onLoginSuccess}>
                Override (Dev Mode)
              </button>

              <p className="login-info">
                This override button is for development purposes only and will be removed in production.
              </p>
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AdminLogin;
