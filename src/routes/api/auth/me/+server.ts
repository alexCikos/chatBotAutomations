import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, fetch }) => {
  console.log('=== /api/auth/me endpoint ===');
  
  // Log all headers
  console.log('Request headers:');
  for (const [key, value] of request.headers.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Try to fetch from /.auth/me endpoint
  try {
    const authResponse = await fetch('/.auth/me');
    console.log('/.auth/me response status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('/.auth/me response data:', authData);
      return json({ success: true, authData });
    } else {
      console.log('/.auth/me not available');
      return json({ success: false, error: '/.auth/me not available' });
    }
  } catch (error) {
    console.log('Error fetching /.auth/me:', error);
    return json({ success: false, error: 'Error fetching auth info' });
  }
};