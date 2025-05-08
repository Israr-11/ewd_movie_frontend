// Extract token from localStorage

export const getIdToken = (): string | null => {
    try {
      // Get token from auth_tokens in localStorage
      const authTokensString = localStorage.getItem('auth_tokens');
      if (!authTokensString) return null;
      
      const authTokens = JSON.parse(authTokensString);
      return authTokens.idToken;
    } catch (e) {
      console.error('Error getting ID token', e);
      return null;
    }
  };
  
  export const getUserId = (): string | null => {
    try {
      const token = getIdToken();
      if (!token) return null;
      
      // Decode the JWT to get the user ID (sub)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (e) {
      console.error('Error extracting user ID from token', e);
      return null;
    }
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getIdToken();
  };
  