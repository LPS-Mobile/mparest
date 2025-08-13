'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

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
        maxWidth: '40rem',
        width: '100%',
        border: '1px solid #e5e7eb'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem'
        }}>
          <img 
            src="/myprayerlogo.png" 
            alt="MyPrayer.AI Logo" 
            style={{ 
              width: 'auto', 
              height: 'auto',
              maxWidth: '12rem',
              maxHeight: '12rem',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Welcome Message */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '1rem',
          letterSpacing: '-0.025em'
        }}>
          Welcome to MyPrayer.AI
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          Your spiritual companion for prayer, reflection, and connection with the divine.
        </p>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Sign In Button */}
          <button
            onClick={() => router.push('/login')}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              backgroundColor: '#d3b65d',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(211, 182, 93, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8a04a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d3b65d'}
          >
            Sign In
          </button>

          {/* Sign Up Button */}
          <button
            onClick={() => router.push('/signup')}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              backgroundColor: 'white',
              color: '#d3b65d',
              border: '2px solid #d3b65d',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d3b65d';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#d3b65d';
            }}
          >
            Create Account
          </button>
        </div>

        {/* Additional Links */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => router.push('/reset-password')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#d3b65d'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            Reset Password
          </button>

          <button
            onClick={() => router.push('/confirm')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#d3b65d'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            Confirm Email
          </button>

          <button
            onClick={() => router.push('/success')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#d3b65d'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            Success Page
          </button>
        </div>

        {/* Demo Notice */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#fef3cd',
          border: '1px solid #d3b65d',
          borderRadius: '0.5rem'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#92400e',
            margin: 0,
            fontWeight: '500'
          }}>
            Demo App - Explore all authentication pages
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '80px',
        height: '80px',
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