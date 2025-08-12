'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [needsEmail, setNeedsEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Simple password validation
  const isPasswordValid = (pwd: string) => {
    return pwd.length >= 8 && 
           /[A-Z]/.test(pwd) && 
           /[a-z]/.test(pwd) && 
           /\d/.test(pwd);
  };

  useEffect(() => {
    const verifyResetToken = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const emailFromUrl = searchParams.get('email');

      if (!token || type !== 'recovery') {
        setMessage({
          text: 'Invalid or missing reset token. Please request a new password reset from your app.',
          type: 'error'
        });
        setIsVerifying(false);
        return;
      }

      // If email is in URL, use it directly
      if (emailFromUrl) {
        setUserEmail(emailFromUrl);
        await attemptVerification(token, emailFromUrl);
      } else {
        // Ask user for email
        setNeedsEmail(true);
        setIsVerifying(false);
        setMessage({
          text: 'Please enter the email address you used to request the password reset.',
          type: 'error'
        });
      }
    };

    verifyResetToken();
  }, [searchParams]);

  const attemptVerification = async (token: string, email: string) => {
    try {
      console.log('Attempting verification with email + token...');
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: 'recovery',
      });

      console.log('Verification result:', { data, error });

      if (error) {
        setMessage({
          text: `Reset link error: ${error.message}`,
          type: 'error'
        });
        setIsVerifying(false);
      } else {
        setIsValidToken(true);
        setMessage({
          text: 'Reset link verified! You can now set your new password.',
          type: 'success'
        });
        setIsVerifying(false);
        setNeedsEmail(false);
      }
    } catch (error) {
      console.log('Verification catch error:', error);
      setMessage({
        text: 'Error verifying reset link. Please try again or request a new reset.',
        type: 'error'
      });
      setIsVerifying(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail.trim()) {
      setMessage({
        text: 'Please enter your email address.',
        type: 'error'
      });
      return;
    }

    setVerifying(true);
    const token = searchParams.get('token');
    
    if (token) {
      await attemptVerification(token, userEmail.trim());
    }
    
    setVerifying(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid(password)) {
      setMessage({
        text: 'Password must be at least 8 characters with uppercase, lowercase, and number.',
        type: 'error'
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        text: 'Passwords do not match.',
        type: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage({
          text: error.message,
          type: 'error'
        });
      } else {
        setMessage({
          text: 'Password updated successfully! You can now use your new password to sign in.',
          type: 'success'
        });
        
        // Clear the form
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/login?reset=success');
        }, 2000);
      }
    } catch (error) {
      setMessage({
        text: 'An unexpected error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          maxWidth: '28rem',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <img 
              src="/myprayerlogo.png" 
              alt="Logo" 
              style={{ 
                width: 'auto', 
                height: 'auto',
                maxWidth: '5rem',
                maxHeight: '5rem',
                objectFit: 'contain'
              }} 
            />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Verifying Reset Link
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Please wait while we verify your password reset link...
          </p>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <img 
              src="/myprayerlogo.png" 
              alt="Logo" 
              style={{ 
                width: 'auto', 
                height: 'auto',
                maxWidth: '5rem',
                maxHeight: '5rem',
                objectFit: 'contain'
              }} 
            />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Reset Your Password
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            {needsEmail ? 'Verify your email to continue' : 'Create a new secure password for your account'}
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          {/* Message Display */}
          {message && (
            <div style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <div style={{ flexShrink: 0 }}>
                {message.type === 'success' ? (
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: message.type === 'success' ? '#065f46' : '#991b1b'
              }}>
                {message.text}
              </span>
            </div>
          )}

          {/* Email Verification Form */}
          {needsEmail && (
            <form onSubmit={handleEmailSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#d3b65d'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter the email you used to request password reset"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  backgroundColor: verifying ? '#9ca3af' : '#d3b65d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: verifying ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!verifying) e.currentTarget.style.backgroundColor = '#b8a04a';
                }}
                onMouseLeave={(e) => {
                  if (!verifying) e.currentTarget.style.backgroundColor = '#d3b65d';
                }}
              >
                {verifying && (
                  <svg style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {verifying ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          )}

          {/* Password Reset Form */}
          {isValidToken && (
            <form onSubmit={onSubmit}>
              {/* New Password Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${
                      password && isPasswordValid(password)
                        ? '#10b981'
                        : password && !isPasswordValid(password)
                        ? '#ef4444'
                        : '#d1d5db'
                    }`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: password && isPasswordValid(password) ? '#f0fdf4' : password && !isPasswordValid(password) ? '#fef2f2' : '#f9fafb'
                  }}
                  onFocus={(e) => {
                    if (!password || (!isPasswordValid(password) && password)) {
                      e.target.style.borderColor = '#d3b65d';
                    }
                  }}
                  onBlur={(e) => {
                    if (password && isPasswordValid(password)) {
                      e.target.style.borderColor = '#10b981';
                    } else if (password && !isPasswordValid(password)) {
                      e.target.style.borderColor = '#ef4444';
                    } else {
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                  placeholder="Enter your new password"
                  required
                />
                
                {password && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    Password requirements: 8+ characters, uppercase, lowercase, number
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ color: password.length >= 8 ? '#059669' : '#dc2626' }}>
                        ✓ 8+ characters
                      </span><br/>
                      <span style={{ color: /[A-Z]/.test(password) ? '#059669' : '#dc2626' }}>
                        ✓ Uppercase letter
                      </span><br/>
                      <span style={{ color: /[a-z]/.test(password) ? '#059669' : '#dc2626' }}>
                        ✓ Lowercase letter
                      </span><br/>
                      <span style={{ color: /\d/.test(password) ? '#059669' : '#dc2626' }}>
                        ✓ Number
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${
                      confirmPassword && confirmPassword === password
                        ? '#10b981'
                        : confirmPassword && confirmPassword !== password
                        ? '#ef4444'
                        : '#d1d5db'
                    }`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: confirmPassword && confirmPassword === password ? '#f0fdf4' : confirmPassword && confirmPassword !== password ? '#fef2f2' : '#f9fafb'
                  }}
                  onFocus={(e) => {
                    if (!confirmPassword || (confirmPassword && confirmPassword !== password)) {
                      e.target.style.borderColor = '#d3b65d';
                    }
                  }}
                  onBlur={(e) => {
                    if (confirmPassword && confirmPassword === password) {
                      e.target.style.borderColor = '#10b981';
                    } else if (confirmPassword && confirmPassword !== password) {
                      e.target.style.borderColor = '#ef4444';
                    } else {
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isPasswordValid(password)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  backgroundColor: loading || !isPasswordValid(password) ? '#9ca3af' : '#d3b65d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading || !isPasswordValid(password) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loading && isPasswordValid(password)) {
                    e.currentTarget.style.backgroundColor = '#b8a04a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && isPasswordValid(password)) {
                    e.currentTarget.style.backgroundColor = '#d3b65d';
                  }
                }}
              >
                {loading && (
                  <svg style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* Error State - No Valid Token */}
          {!isValidToken && !isVerifying && !needsEmail && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Reset Link Invalid
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                This reset link has expired or is invalid. Please request a new password reset from your app.
              </p>
              <button
                onClick={() => router.push('/login')}
                style={{
                  padding: '0.875rem 2rem',
                  backgroundColor: '#d3b65d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8a04a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d3b65d'}
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            Need help? Contact support or return to your app.
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}