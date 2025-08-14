'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Log the confirmation for debugging
    console.log('✅ Email confirmation page loaded - email is now confirmed!');
    console.log('🔍 URL parameters:', Object.fromEntries(searchParams.entries()));

    // Start countdown to redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/login?confirmed=true');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, searchParams]);

  const handleContinueNow = () => {
    router.push('/login?confirmed=true');
  };

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
            Email Confirmed! 🎉
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            Your account is now active and ready to use
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
          {/* Success Message */}
          <div style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{ flexShrink: 0 }}>
              <svg style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#065f46'
            }}>
              Your email has been successfully verified! You can now sign in to your account and start using the app.
            </span>
          </div>

          {/* Success State */}
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
              Welcome to Prayer Companion!
            </h3>
            
            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              You'll receive 10 free prayer credits to get started. 
            </p>

            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              Redirecting to sign in page in <strong>{countdown}</strong> seconds...
            </p>

            <button
              onClick={handleContinueNow}
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
                transition: 'all 0.2s ease',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8a04a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d3b65d'}
            >
              Continue to Sign In →
            </button>

            <p style={{
              color: '#9ca3af',
              fontSize: '0.75rem',
              lineHeight: '1.4'
            }}>
              You can now use your email and password to sign in, or continue with Google sign-in from the mobile app.
            </p>
          </div>
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
            Need help? Contact support or return to your mobile app.
          </p>
        </div>
      </div>
    </div>
  );
}