'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const [resendEmail, setResendEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const email = searchParams.get('email');

      // Check if this is an email confirmation link
      if (!token || type !== 'signup') {
        setMessage({
          text: 'Invalid or missing confirmation link. Please check your email for the correct link.',
          type: 'error'
        });
        setConfirmationStatus('error');
        setConfirming(false);
        return;
      }

      try {
        console.log('Attempting email confirmation...');
        
        // Verify the email confirmation token
        const { data, error } = await supabase.auth.verifyOtp({
          email: email || '',
          token: token,
          type: 'signup',
        });

        console.log('Confirmation result:', { data, error });

        if (error) {
          // Handle different types of errors
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            setConfirmationStatus('expired');
            setMessage({
              text: 'This confirmation link has expired. Please request a new confirmation email.',
              type: 'error'
            });
          } else {
            setConfirmationStatus('error');
            setMessage({
              text: `Email confirmation failed: ${error.message}`,
              type: 'error'
            });
          }
        } else {
          setConfirmationStatus('success');
          setMessage({
            text: 'Email confirmed successfully! Your account is now active and you can sign in.',
            type: 'success'
          });
          
          // Redirect to login after a delay
          setTimeout(() => {
            router.push('/login?confirmed=true');
          }, 3000);
        }
      } catch (error) {
        console.log('Confirmation catch error:', error);
        setConfirmationStatus('error');
        setMessage({
          text: 'An unexpected error occurred during email confirmation. Please try again.',
          type: 'error'
        });
      } finally {
        setConfirming(false);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resendEmail.trim()) {
      setMessage({
        text: 'Please enter your email address.',
        type: 'error'
      });
      return;
    }

    setResendLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: resendEmail.trim(),
      });

      if (error) {
        setMessage({
          text: `Failed to resend confirmation: ${error.message}`,
          type: 'error'
        });
      } else {
        setMessage({
          text: 'Confirmation email sent! Please check your inbox and click the confirmation link.',
          type: 'success'
        });
        setResendEmail('');
        setShowResendForm(false);
      }
    } catch (error) {
      setMessage({
        text: 'An unexpected error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Loading state while confirming email
  if (confirming) {
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
            Confirming Your Email
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Please wait while we confirm your email address...
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
            {confirmationStatus === 'success' ? 'Email Confirmed!' : 
             confirmationStatus === 'expired' ? 'Link Expired' :
             confirmationStatus === 'error' ? 'Confirmation Failed' : 
             'Email Confirmation'}
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            {confirmationStatus === 'success' ? 'Your account is now active and ready to use' : 
             confirmationStatus === 'expired' ? 'The confirmation link has expired' :
             confirmationStatus === 'error' ? 'There was an issue confirming your email' :
             'Verifying your email address'}
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

          {/* Success State */}
          {confirmationStatus === 'success' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg style={{ width: '2rem', height: '2rem', color: '#10b981' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Welcome to the Platform!
              </h3>
              
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                marginBottom: '2rem',
                lineHeight: '1.5'
              }}>
                Your email has been successfully verified. You'll be redirected to the login page in a few seconds, or you can click the button below to continue.
              </p>

              <button
                onClick={() => router.push('/login?confirmed=true')}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  backgroundColor: '#d3b65d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8a04a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d3b65d'}
              >
                Continue to Sign In →
              </button>
            </div>
          )}

          {/* Error/Expired State */}
          {(confirmationStatus === 'error' || confirmationStatus === 'expired') && (
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
                {confirmationStatus === 'expired' ? 'Confirmation Link Expired' : 'Confirmation Failed'}
              </h3>
              
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {confirmationStatus === 'expired' 
                  ? 'This confirmation link has expired. Please request a new one.'
                  : 'We couldn\'t confirm your email. Please try requesting a new confirmation email.'}
              </p>

              {!showResendForm ? (
                <button
                  onClick={() => setShowResendForm(true)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '1rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  Request New Confirmation Email
                </button>
              ) : (
                <form onSubmit={handleResendConfirmation} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textAlign: 'left'
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResendForm(false);
                        setResendEmail('');
                        setMessage(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.875rem 1rem',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={resendLoading}
                      style={{
                        flex: 2,
                        padding: '0.875rem 1rem',
                        backgroundColor: resendLoading ? '#9ca3af' : '#d3b65d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: resendLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        if (!resendLoading) e.currentTarget.style.backgroundColor = '#b8a04a';
                      }}
                      onMouseLeave={(e) => {
                        if (!resendLoading) e.currentTarget.style.backgroundColor = '#d3b65d';
                      }}
                    >
                      {resendLoading && (
                        <svg style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {resendLoading ? 'Sending...' : 'Send Email'}
                    </button>
                  </div>
                </form>
              )}

              <button
                onClick={() => router.push('/login')}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
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