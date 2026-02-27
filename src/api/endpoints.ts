
export const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    signup: '/auth/signup',
  },
  dashboard: {
    stats: '/dashboard/stats',
    recentActivity: '/dashboard/activity',
    upcomingAppointments: '/dashboard/upcoming-appointments',
    journeyProgress: '/dashboard/journey-progress',
    profileCompletion: '/dashboard/profile-completion',
    recommendedMatches: '/dashboard/recommended-matches',
  },
  profile: {
    me: '/profile/me',
    update: '/profile/me',
  },
  cv: {
    get: '/cv',
    upload: '/cv/upload',
    delete: '/cv',
    download: '/cv/download',
  },
  matching: {
    list: '/matches',
    byId: (id: string) => `/matches/${id}`,
    save: (id: string) => `/matches/${id}/save`,
    apply: (id: string) => `/matches/${id}/apply`,
  },
  appointments: {
    list: '/appointments',
    byId: (id: string) => `/appointments/${id}`,
    book: '/appointments',
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
    advisors: '/appointments/advisors',
    slots: (advisorId: string, date: string) =>
      `/appointments/advisors/${advisorId}/slots?date=${date}`,
  },
  messaging: {
    conversations: '/messaging/conversations',
    startConversation: '/messaging/conversations',
    messages: (conversationId: string) =>
      `/messaging/conversations/${conversationId}/messages`,
    sendMessage: (conversationId: string) =>
      `/messaging/conversations/${conversationId}/messages`,
    markRead: (conversationId: string) =>
      `/messaging/conversations/${conversationId}/read`,
  },
  journey: {
    data: '/journey',
    updateStep: (stepId: string) => `/journey/steps/${stepId}`,
  },
  resources: {
    list: '/resources',
    byId: (id: string) => `/resources/${id}`,
    bookmark: (id: string) => `/resources/${id}/bookmark`,
    view: (id: string) => `/resources/${id}/view`,
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    clear: (id: string) => `/notifications/${id}`,
    clearAll: '/notifications',
    unreadCount: '/notifications/unread-count',
  },
};
