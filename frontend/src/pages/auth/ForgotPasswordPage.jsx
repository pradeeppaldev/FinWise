import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ErrorBanner from '../../components/ErrorBanner';
import api from '../../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // In a real app, you would call your API here
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API call
      // const response = await api.post('/auth/forgot-password', { email });
      
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 shadow-xl">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          {error && (
            <div className="mt-4">
              <ErrorBanner title="Reset Error">
                {error}
              </ErrorBanner>
            </div>
          )}
          
          {success ? (
            <div className="mt-8 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <p>If an account exists for {email}, you will receive password reset instructions shortly.</p>
              <div className="mt-4 text-center">
                <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md space-y-4">
                <FormInput
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
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

export default ForgotPasswordPage;