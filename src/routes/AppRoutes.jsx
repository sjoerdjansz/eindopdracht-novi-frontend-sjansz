import { Routes, Route } from "react-router-dom";
import { Signup } from "../pages/signup/Signup.jsx";
import { Layout } from "../layouts/Layout.jsx";
import { Dashboard } from "../pages/dashboard/Dashboard.jsx";
import { Clients } from "../pages/clients/Clients.jsx";
import { Workouts } from "../pages/workouts/Workouts.jsx";
import { WorkoutBuilder } from "../pages/workoutBuilder/WorkoutBuilder.jsx";
import { ExerciseList } from "../pages/exerciseList/ExerciseList.jsx";
import { CreateExercisePage } from "../pages/createExercisePage/CreateExercisePage.jsx";
import { ClientProfile } from "../pages/clientProfile/ClientProfile.jsx";
import { CreateClientPage } from "../pages/createClientPage/CreateClientPage.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workout-builder" element={<WorkoutBuilder />} />
        <Route path="/exercise-library" element={<ExerciseList />} />
        <Route
          path="/exercise-library/create"
          element={<CreateExercisePage />}
        />
        <Route path="/clients/profile/:id" element={<ClientProfile />} />
        <Route path="/clients/create" element={<CreateClientPage />} />
      </Route>
    </Routes>
  );
}
