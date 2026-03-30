import client from './client';

const unwrap = async (promise) => {
  const response = await promise;
  return response.data?.data;
};

export const learnerApi = {
  getProfile: () => unwrap(client.get('/learner/profile')),
  updateProfile: (payload) => unwrap(client.put('/learner/profile', payload)),
  changePassword: (payload) => unwrap(client.put('/learner/change-password', payload)),
  getCourses: (params) => unwrap(client.get('/learner/courses', { params })),
  getCourseDetail: (courseId) => unwrap(client.get(`/learner/courses/${courseId}`)),
  registerFreeCourse: (courseId) => unwrap(client.post(`/learner/courses/${courseId}/register-free`)),
  registerPaidCourse: (courseId, payload) => unwrap(client.post(`/learner/courses/${courseId}/register-paid`, payload)),
  getMyCourses: () => unwrap(client.get('/learner/my-courses')),
  getMyProgress: () => unwrap(client.get('/learner/my-progress')),
  getLearningContent: (courseId) => unwrap(client.get(`/learner/learning/${courseId}`)),
  saveVideoProgress: (courseId, sessionId, payload) => unwrap(client.post(`/learner/learning/${courseId}/sessions/${sessionId}/video-progress`, payload)),
  markSessionComplete: (courseId, sessionId) => unwrap(client.post(`/learner/learning/${courseId}/sessions/${sessionId}/mark-complete`)),
  getExercises: (courseId, sessionId) => unwrap(client.get(`/learner/learning/${courseId}/sessions/${sessionId}/exercises`)),
  submitExercises: (courseId, sessionId, answers) => unwrap(client.post(`/learner/learning/${courseId}/sessions/${sessionId}/exercises/submit`, { answers })),
  getFinancialRequests: () => unwrap(client.get('/learner/financial-requests')),
  createFinancialRequest: (payload) => unwrap(client.post('/learner/financial-requests', payload)),
  getCourseFeedbacks: (courseId) => unwrap(client.get(`/learner/courses/${courseId}/feedbacks`)),
  saveFeedback: (courseId, payload) => unwrap(client.post(`/learner/courses/${courseId}/feedbacks`, payload)),
  saveReaction: (courseId, payload) => unwrap(client.post(`/learner/courses/${courseId}/reaction`, payload)),
  getNotifications: () => unwrap(client.get('/learner/notifications')),
  getRecommendations: () => unwrap(client.get('/learner/recommendations')),
  runReminders: () => unwrap(client.post('/learner/reminders/run-check')),
  registerPaidCourse: (courseId, payload) =>
  unwrap(client.post(`/learner/courses/${courseId}/register-paid`, payload)),
};
