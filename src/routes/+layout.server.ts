import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
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
  
  console.log('=== Auth Headers ===');
  console.log('X-MS-CLIENT-PRINCIPAL:', clientPrincipal);
  console.log('Authorization:', authHeader);
  console.log('X-MS-CLIENT-PRINCIPAL-NAME:', userHeader);
  console.log('X-MS-CLIENT-PRINCIPAL-ID:', idHeader);
  
  if (clientPrincipal) {
    try {
      console.log('=== Decoding Client Principal ===');
      // Decode the base64 encoded user info
      const userInfo = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString('utf-8'));
      console.log('Decoded user info:', userInfo);
      
      return {
        user: {
          id: userInfo.userId,
          name: userInfo.userDetails,
          email: userInfo.userDetails,
          provider: userInfo.identityProvider,
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
        provider: 'microsoft',
        createdAt: new Date().toISOString(),
      }
    };
  }
  
  console.log('=== No authenticated user found ===');
  // Return null if no authenticated user
  return {
    user: null
  };
};