
export const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    signup: '/auth/signup',
  },
  dashboard: {
    me: '/dashboard',
  },
  profile: {
    me: '/profile/me',
  },
} as const;