export const QUIZ_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CREATE_QUIZ: '/create-quiz',
  EDIT_QUIZ: '/edit-quiz/:id',
  TAKE_QUIZ: '/take-quiz/:id',
  QUIZ_RESULT: '/quiz-result/:id',
  PROFILE: '/profile',
  PUBLIC_QUIZ: '/quiz/:id'
};

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  SHORT_ANSWER: 'short-answer'
};