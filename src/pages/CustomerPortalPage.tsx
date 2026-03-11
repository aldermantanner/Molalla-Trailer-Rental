import { useEffect } from 'react';

export function CustomerPortalPage() {
  useEffect(() => {
    // Redirect to Jobber Client Hub
    window.location.href = 'https://clienthub.getjobber.com/client_hubs/935796ca-8da1-401b-a3dd-604659dcbf70/login/new?source=share_login';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Redirecting to Jobber Client Hub...</p>
      </div>
    </div>
  );
}
