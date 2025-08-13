'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');

  // Helper function for Google OAuth sign-in with hardcoded redirect
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://mparest.vercel.app/auth-redirect'
      }
    });
  };

  // Helper function for password reset with hardcoded redirect
  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://mparest.vercel.app/auth-redirect'
    });
  };

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Get URL parameters and hash parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Get tokens from URL hash
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        const expiresIn = hashParams.get('expires_in');
        const tokenType = hashParams.get('token_type');
        
        console.log('Auth redirect - tokens found:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          error: error,
          url: window.location.href
        });
        
        // Get the original mobile redirect URL
        const originalRedirect = urlParams.get('original_redirect');
        
        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /iphone|ipad|android|mobile/i.test(userAgent);
        const isInAppBrowser = /expo|react-native/i.test(userAgent);
        
        console.log('Platform detection:', {
          isMobile,
          isInAppBrowser,
          originalRedirect,
          userAgent: userAgent.substring(0, 100)
        });
        
        // Determine if this should redirect to mobile app
        const shouldRedirectToMobile = originalRedirect && (
          originalRedirect.startsWith('exp://') || 
          originalRedirect.startsWith('your-prayer-app://')
        );
        
        if (shouldRedirectToMobile) {
          setStatus('Redirecting back to mobile app...');
          
          let mobileUrl = originalRedirect;
          
          // Append tokens or error to mobile redirect URL
          if (accessToken) {
            const separator = mobileUrl.includes('#') ? '&' : '#';
            const tokenParams = new URLSearchParams();
            tokenParams.set('access_token', accessToken);
            if (refreshToken) tokenParams.set('refresh_token', refreshToken);
            if (expiresIn) tokenParams.set('expires_in', expiresIn);
            if (tokenType) tokenParams.set('token_type', tokenType);
            
            mobileUrl += separator + tokenParams.toString();
          } else if (error) {
            const separator = mobileUrl.includes('#') ? '&' : '#';
            const errorParams = new URLSearchParams();
            errorParams.set('error', error);
            if (errorDescription) errorParams.set('error_description', errorDescription);
            
            mobileUrl += separator + errorParams.toString();
          }
          
          console.log('Redirecting to mobile app:', mobileUrl);
          
          // Try to redirect to mobile app
          window.location.href = mobileUrl;
          
          // Show fallback message after a delay
          setTimeout(() => {
            setStatus('Please return to your mobile app. If it didn\'t open automatically, please return manually.');
          }, 3000);
          
        } else {
          // Handle web app redirect
          setStatus('Completing web authentication...');
          
          if (accessToken) {
            // Authentication successful for web user
            console.log('Web auth successful, redirecting to dashboard');
            router.push('/dashboard');
          } else if (error) {
            // Handle authentication error for web user
            console.error('Web auth error:', error, errorDescription);
            router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`);
          } else {
            // No tokens found, redirect to login
            console.log('No tokens found, redirecting to login');
            router.push('/login');
          }
        }
        
      } catch (error) {
        console.error('Error in auth redirect:', error);
        setStatus('Authentication error occurred. Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    };

    // Small delay to ensure the URL is fully loaded
    const timer = setTimeout(handleRedirect, 100);
    
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Completing sign in...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {status}
          </p>
        </div>
        
        {/* Loading spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        {/* Fallback instructions */}
        <div className="text-center text-xs text-gray-500">
          <p>Please wait while we redirect you back to the app.</p>
        </div>
      </div>
    </div>
  );
}