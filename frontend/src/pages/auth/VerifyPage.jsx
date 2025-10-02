import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ErrorBanner from '../../components/ErrorBanner';
import api from '../../utils/api';

const VerifyPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    // Move to next input field if a digit is entered
    if (element.value !== '' && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('').slice(0, 6);
    
    if (pasteArray.length === 6 && pasteArray.every(char => !isNaN(char))) {
      setCode(pasteArray);
      document.getElementById(`code-input-5`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      return setError('Please enter a valid 6-digit code');
    }
    
    try {
      setError('');
      setLoading(true);
      
      // In a real app, you would call your API here
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API call
      // const response = await api.post('/auth/verify-email', { code: verificationCode });
      
      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 shadow-xl">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Verify your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a 6-digit code to your email address. Enter it below to verify your account.
            </p>
          </div>
          
          {error && (
            <div className="mt-4">
              <ErrorBanner title="Verification Error">
                {error}
              </ErrorBanner>
            </div>
          )}
          
          {success ? (
            <div className="mt-8 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <p>Email verified successfully! Redirecting to dashboard...</p>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Verification Code
                </label>
                <div className="flex justify-center space-x-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={e => handleChange(e.target, index)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                  ))}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>Didn't receive the code?</p>
                <button 
                  type="button" 
                  className="font-medium text-blue-600 hover:text-blue-500 mt-1"
                  onClick={() => {
                    // In a real app, you would resend the code
                    alert('Code resent! (This is a simulation)');
                  }}
                >
                  Resend Code
                </button>
              </div>
              
              <div className="text-center">
                <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerifyPage;