export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  
  // Only protect /api/admin paths
  if (url.pathname.startsWith('/api/admin')) {
    const authHeader = getRequestHeader(event, 'authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token',
      });
    }

    // Attach user info to context
    event.context.auth = decoded;
  }
});
