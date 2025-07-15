import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, url, fetch }) => {
  // Debug: Log all headers to see what's available
  console.log('=== All Headers ===');
  for (const [key, value] of request.headers.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Check for different authentication header patterns
  const clientPrincipal = request.headers.get('X-MS-CLIENT-PRINCIPAL');
  const authHeader = request.headers.get('Authorization');
  const userHeader = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME');
  const idHeader = request.headers.get('X-MS-CLIENT-PRINCIPAL-ID');
  const idpHeader = request.headers.get('X-MS-CLIENT-PRINCIPAL-IDP');
  
  console.log('=== Auth Headers ===');
  console.log('X-MS-CLIENT-PRINCIPAL:', clientPrincipal ? '[PRESENT]' : '[MISSING]');
  console.log('Authorization:', authHeader ? '[PRESENT]' : '[MISSING]');
  console.log('X-MS-CLIENT-PRINCIPAL-NAME:', userHeader);
  console.log('X-MS-CLIENT-PRINCIPAL-ID:', idHeader);
  console.log('X-MS-CLIENT-PRINCIPAL-IDP:', idpHeader);
  
  // Try to decode X-MS-CLIENT-PRINCIPAL header first
  if (clientPrincipal) {
    try {
      console.log('=== Decoding Client Principal ===');
      console.log('Raw header length:', clientPrincipal.length);
      
      // Decode the base64 encoded user info
      const decoded = Buffer.from(clientPrincipal, 'base64').toString('utf-8');
      console.log('Decoded string:', decoded);
      
      const userInfo = JSON.parse(decoded);
      console.log('Parsed user info:', JSON.stringify(userInfo, null, 2));
      
      // Extract user information from claims array
      const findClaim = (type: string) => {
        const claim = userInfo.claims?.find((c: any) => c.typ === type);
        return claim?.val;
      };
      
      const userId = findClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier') || 
                    findClaim('sub') || 
                    findClaim('oid') || 
                    userInfo.userId;
      
      const userName = findClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name') || 
                      findClaim('name') || 
                      findClaim('preferred_username') || 
                      userInfo.userDetails;
      
      const userEmail = findClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress') || 
                       findClaim('email') || 
                       findClaim('upn') || 
                       userName;
      
      console.log('Extracted values:', { userId, userName, userEmail });
      
      return {
        user: {
          id: userId || 'unknown',
          name: userName || 'Unknown User',
          email: userEmail || 'unknown@example.com',
          provider: userInfo.auth_typ || 'microsoft',
          createdAt: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('Error parsing user principal:', error);
    }
  }
  
  // Try alternative header structure
  if (userHeader && idHeader) {
    console.log('=== Using alternative headers ===');
    return {
      user: {
        id: idHeader,
        name: userHeader,
        email: userHeader,
        provider: idpHeader || 'microsoft',
        createdAt: new Date().toISOString(),
      }
    };
  }
  
  // Try to call /.auth/me endpoint
  try {
    console.log('=== Trying /.auth/me endpoint ===');
    const authMeUrl = new URL('/.auth/me', url.origin);
    console.log('Fetching:', authMeUrl.toString());
    
    const authResponse = await fetch(authMeUrl.toString(), {
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
      }
    });
    
    console.log('/.auth/me response status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('/.auth/me response data:', JSON.stringify(authData, null, 2));
      
      if (authData && authData.length > 0) {
        const userInfo = authData[0];
        
        // Extract user information from the claims
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
        
        console.log('Extracted user info:', { userId, userName, userEmail });
        
        return {
          user: {
            id: userId,
            name: userName,
            email: userEmail,
            provider: userInfo.provider_name || 'microsoft',
            createdAt: new Date().toISOString(),
          }
        };
      }
    }
  } catch (error) {
    console.error('Error fetching /.auth/me:', error);
  }
  
  console.log('=== No authenticated user found ===');
  // Return null if no authenticated user
  return {
    user: null
  };
};