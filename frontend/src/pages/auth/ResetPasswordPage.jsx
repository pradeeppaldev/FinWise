import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ErrorBanner from '../../components/ErrorBanner';
import api from '../../utils/api';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      
      // In a real app, you would call your API here with the token from URL params
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API call
      // const response = await api.post('/auth/reset-password', { password, token });
      
      setSuccess(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 shadow-xl">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Set a new password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your new password must be different from previous passwords.
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
              <p>Password reset successfully! Redirecting to login...</p>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md space-y-4">
                <FormInput
                  label="New Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                
                <FormInput
                  label="Confirm New Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordPage;