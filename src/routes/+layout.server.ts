import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
  // Get the user principal from Azure Easy Auth
  const clientPrincipal = request.headers.get('X-MS-CLIENT-PRINCIPAL');
  
  if (clientPrincipal) {
    try {
      // Decode the base64 encoded user info
      const userInfo = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString('utf-8'));
      
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
  
  // Return null if no authenticated user
  return {
    user: null
  };
};