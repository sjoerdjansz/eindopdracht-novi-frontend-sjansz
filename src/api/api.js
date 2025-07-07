const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_ENDPOINTS = {
  //   To login existing user
  login: `${BASE_URL}/login`,
  //   Create new user
  users: `${BASE_URL}/users`,
  //   Other utility endpoints
  workoutTemplates: `${BASE_URL}/workoutTemplates`,
  exercises: `${BASE_URL}/exercises`,
  workoutExercises: `${BASE_URL}/workoutExercises`,
  clients: `${BASE_URL}/clients`,
  userWorkouts: `${BASE_URL}/userWorkouts`,
};
