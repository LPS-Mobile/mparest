'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Define the debug info type
interface DebugInfo {
  fullURL?: string;
  searchParams?: string;
  hash?: string;
  pathname?: string;
  timestamp?: string;
  hasCurrentSession?: boolean;
  error?: {
    message: string;
    status?: number;
  };
  originalRedirect?: string | null;
  decodedRedirect?: string | null;
  allParams?: Record<string, string>;
}

export default function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Collect debug information
        const debugData = {
          fullURL: window.location.href,
          searchParams: window.location.search,
          hash: window.location.hash,
          pathname: window.location.pathname,
          timestamp: new Date().toISOString()
        };
        
        setDebugInfo(debugData);
        console.log('🔍 Auth redirect page loaded:', debugData);

        // Let's also check what Supabase auth thinks about the current state
        const { data: currentSession } = await supabase.auth.getSession();
        console.log('🔍 Current session before PKCE:', !!currentSession.session);
        
        setDebugInfo((prev: DebugInfo | null) => ({ ...prev, hasCurrentSession: !!currentSession.session }));

        setStatus('Exchanging code for session...');
        
        // Use PKCE flow - exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          const errorDetails = {
            message: error.message,
            status: error.status,
            statusCode: error.status,
            url: window.location.href
          };
          
          console.error('❌ PKCE exchange error details:', errorDetails);
          setDebugInfo((prev: DebugInfo | null) => ({ ...prev, error: errorDetails }));
          setStatus(`Authentication failed: ${error.message}`);
          
          // Don't redirect immediately so user can see the error
          setTimeout(() => {
            router.replace('/login?error=oauth');
          }, 10000); // 10 seconds to read the error
          return;
        }
        
        if (data.session) {
          console.log('✅ PKCE auth successful:', data.session.user?.email);
          setStatus('Authentication successful! Redirecting...');
          
          // Get the original mobile redirect URL from search params
          const urlParams = new URLSearchParams(window.location.search);
          const originalRedirect = urlParams.get('original_redirect');
          
          console.log('🔍 Checking redirect params:', {
            originalRedirect: originalRedirect,
            decodedRedirect: originalRedirect ? decodeURIComponent(originalRedirect) : null,
            allParams: Object.fromEntries(urlParams.entries())
          });
          
          // Update debug info with redirect params
          setDebugInfo((prev: DebugInfo | null) => ({ 
            ...prev, 
            originalRedirect: originalRedirect || undefined,
            decodedRedirect: originalRedirect ? decodeURIComponent(originalRedirect) : undefined,
            allParams: Object.fromEntries(urlParams.entries())
          }));
          
          // Detect platform
          const userAgent = navigator.userAgent.toLowerCase();
          const isMobile = /iphone|ipad|android|mobile/i.test(userAgent);
          const isInAppBrowser = /expo|react-native/i.test(userAgent);
          
          console.log('📱 Platform detection:', {
            isMobile,
            isInAppBrowser,
            originalRedirect,
            userAgent: userAgent.substring(0, 100)
          });
          
          // Check if this should redirect to mobile app
          // For Expo Go, always redirect if we have an originalRedirect that starts with exp://
          const shouldRedirectToMobile = originalRedirect && originalRedirect.startsWith('exp://');
          
          console.log('🚀 Should redirect to mobile?', {
            shouldRedirectToMobile,
            originalRedirect,
            startsWithExp: originalRedirect?.startsWith('exp://'),
          });
          
          if (shouldRedirectToMobile) {
            setStatus('Redirecting back to mobile app...');
            
            // Create the mobile redirect URL with success indicator
            const mobileUrl = `${originalRedirect}?auth_success=true`;
            
            console.log('📲 Redirecting to mobile app:', mobileUrl);
            console.log('📲 Decoded mobile URL:', decodeURIComponent(mobileUrl));
            
            // For Expo Go, we need to be more aggressive with the redirect
            try {
              // Method 1: Try immediate redirect
              console.log('📲 Attempting window.location.href redirect...');
              window.location.href = mobileUrl;
              
              // Method 2: Try after a short delay
              setTimeout(() => {
                console.log('📲 Attempting delayed window.location.replace...');
                window.location.replace(mobileUrl);
              }, 500);
              
              // Method 3: Try window.open as fallback
              setTimeout(() => {
                console.log('📲 Attempting window.open...');
                window.open(mobileUrl, '_self');
              }, 1000);
              
              // Method 4: Create a clickable link as final fallback
              setTimeout(() => {
                setStatus(`If the app didn't open automatically, click here: ${mobileUrl}`);
              }, 3000);
              
            } catch (redirectError) {
              console.error('Error redirecting to mobile app:', redirectError);
              setStatus('Please return to your mobile app manually.');
            }
            
          } else {
            // Handle web app redirect
            console.log('🌐 Redirecting to web dashboard...');
            setStatus('Redirecting to dashboard...');
            setTimeout(() => {
              router.replace('/success'); // Changed to match your login component
            }, 1000);
          }
        } else {
          console.log('❌ No session found, redirecting to login');
          setStatus('No session found. Redirecting to login...');
          setTimeout(() => {
            router.replace('/login');
          }, 2000);
        }
        
      } catch (error) {
        console.error('❌ Error in PKCE auth redirect:', error);
        setStatus('Authentication error occurred. Redirecting to login...');
        setTimeout(() => {
          router.replace('/login?error=oauth');
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
          <p className="mt-2">If you're using a mobile app and it doesn't open automatically, please return to the app manually.</p>
          
          {/* Add manual redirect button for testing */}
          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('original_redirect')?.startsWith('exp://') && (
            <button 
              onClick={() => {
                const originalRedirect = new URLSearchParams(window.location.search).get('original_redirect');
                if (originalRedirect) {
                  const mobileUrl = `${originalRedirect}?auth_success=true`;
                  console.log('Manual redirect button clicked:', mobileUrl);
                  window.location.href = mobileUrl;
                }
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Open in Expo Go (Manual)
            </button>
          )}
        </div>
        
        {/* Debug info display - visible on mobile */}
        {debugInfo && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-left max-w-full overflow-auto">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <div className="space-y-1 font-mono text-xs">
              <p><strong>URL:</strong> {debugInfo.fullURL}</p>
              <p><strong>Search:</strong> {debugInfo.searchParams}</p>
              <p><strong>Hash:</strong> {debugInfo.hash}</p>
              <p><strong>Path:</strong> {debugInfo.pathname}</p>
              <p><strong>Session:</strong> {debugInfo.hasCurrentSession ? 'Yes' : 'No'}</p>
              {debugInfo.error && (
                <div className="mt-2 p-2 bg-red-100 rounded">
                  <p><strong>Error:</strong> {debugInfo.error.message}</p>
                  <p><strong>Status:</strong> {debugInfo.error.status}</p>
                </div>
              )}
              {debugInfo.originalRedirect && (
                <p><strong>Mobile URL:</strong> {debugInfo.originalRedirect}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}