import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './ChatbotLogin.css';

const ChatbotLogin = ({ onLoginSuccess }) => {
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
      const response = await fetch('/api/chatbot/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok && data.authorized) {
        // Email is whitelisted - grant access
        onLoginSuccess(userEmail);
      } else {
        // Email not whitelisted - show error
        setErrorMessage('Access denied. This chatbot is only available to authorized users. Please contact your administrator for access.');
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
      <div className="chatbot-login-container">
        <div className="chatbot-login-card">
          <h2>Welcome to L'mu-Oa</h2>
          <p className="login-description">
            Your AI-powered sponsorship assistant. Sign in with your authorized Google account to get started.
          </p>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" style={{
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #1a4d2e',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
              <p style={{ marginTop: '1rem', color: '#64748b' }}>Verifying your access...</p>
            </div>
          ) : (
            <>
              <div className="google-login-wrapper">
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
                <div className="error-message-box">
                  {errorMessage}
                </div>
              )}

              <div className="divider">
                <span>or</span>
              </div>

              <button className="bypass-btn" onClick={() => onLoginSuccess('dev@example.com')}>
                Bypass (Dev Mode)
              </button>

              <p className="bypass-info">
                This bypass button is for development purposes only and will be removed in production.
              </p>

              <div className="login-footer">
                <p>Only authorized users can access this chatbot.</p>
                <p>Need access? Contact your administrator.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default ChatbotLogin;
