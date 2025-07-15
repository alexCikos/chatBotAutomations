import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, fetch, url }) => {
  console.log('=== /api/auth/me endpoint ===');
  
  // Log all headers
  console.log('Request headers:');
  for (const [key, value] of request.headers.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Try to fetch from /.auth/me endpoint
  try {
    const authMeUrl = new URL('/.auth/me', url.origin);
    const authResponse = await fetch(authMeUrl.toString(), {
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
      }
    });
    
    console.log('/.auth/me response status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('/.auth/me response data:', authData);
      
      if (authData && authData.length > 0) {
        const userInfo = authData[0];
        
        // Parse the user information like in the layout
        const findClaim = (type: string) => {
          const claim = userInfo.user_claims?.find((c: any) => c.typ === type);
          return claim?.val;
        };
        
        const userId = userInfo.user_id || 
                      findClaim('http://schemas.microsoft.com/identity/claims/objectidentifier') ||
                      findClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier') ||
                      'unknown';
        
        const userName = findClaim('name') || 'Unknown User';
        const userEmail = findClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress') || 
                         findClaim('preferred_username') || 
                         userInfo.user_id || 
                         'unknown@example.com';
        
        return json({ 
          success: true, 
          rawAuthData: authData,
          parsedUser: {
            id: userId,
            name: userName,
            email: userEmail,
            provider: userInfo.provider_name || 'microsoft',
          }
        });
      }
      
      return json({ success: true, authData, message: 'No user data found' });
    } else {
      console.log('/.auth/me not available');
      return json({ success: false, error: '/.auth/me not available', status: authResponse.status });
    }
  } catch (error) {
    console.log('Error fetching /.auth/me:', error);
    return json({ success: false, error: 'Error fetching auth info', details: error.message });
  }
};