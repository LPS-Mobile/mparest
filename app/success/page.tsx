'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Auto redirect after some time
    // const timer = setTimeout(() => {
    //   router.push('/login');
    // }, 5000);
    
    // return () => clearTimeout(timer);
  }, [router]);

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
        borderRadius: '1rem',
        padding: '4rem 3rem',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
        maxWidth: '32rem',
        width: '100%',
        border: '1px solid #e5e7eb'
      }}>
        {/* Logo Container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0'
        }}>
          <img 
            src="/myprayerlogo.png" 
            alt="Prayer Logo" 
            style={{ 
              width: 'auto', 
              height: 'auto',
              maxWidth: '14rem',
              maxHeight: '14rem',
              objectFit: 'contain',
              imageRendering: 'pixelated' // Better for small images being scaled
            }}
          />
        </div>

        {/* Success Icon */}
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
          <svg style={{ width: '2rem', height: '2rem', color: '#22c55e' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          color: '#d3b65d',
          marginBottom: '0.75rem',
          letterSpacing: '-0.025em'
        }}>
          You Have Logged In!
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Welcome back! You have successfully signed in to your account.
        </p>

        {/* Animated Success Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '0.75rem',
            height: '0.75rem',
            backgroundColor: '#d3b65d',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
          <span style={{
            fontSize: '0.875rem',
            color: '#d3b65d',
            fontWeight: '600'
          }}>
            Authentication Successful
          </span>
        </div>

        {/* Action Button */}
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
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(211, 182, 93, 0.3)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8a04a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d3b65d'}
        >
          Continue
        </button>
      </div>

      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        backgroundColor: '#d3b65d',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '60px',
        height: '60px',
        backgroundColor: '#d3b65d',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'float 4s ease-in-out infinite reverse'
      }}></div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}