const http_status = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const user_roles = {
  ADMIN: 'admin',
  USER: 'user',
  PROVIDER : 'PROVIDER'
};

const messages = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCESS_DENIED: 'Access denied'
};

module.exports = {
  http_status,
  user_roles,
  messages
};
