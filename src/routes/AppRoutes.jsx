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
import { NotFound } from "../pages/notFound/NotFound.jsx";
import { ClientAccountDetails } from "../components/clientAccountDetails/ClientAccountDetails.jsx";
import { ClientWorkouts } from "../components/clientWorkouts/ClientWorkouts.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="workouts">
          <Route index element={<Workouts />} />
          <Route path="new-workout" element={<WorkoutBuilder />} />
        </Route>
        <Route path="exercise-library">
          <Route index element={<ExerciseList />} />
          <Route path="create" element={<CreateExercisePage />} />
          <Route path="create/:id" element={<CreateExercisePage />} />
        </Route>
        <Route path="clients" element={<Clients />} />
        <Route path="/clients/create" element={<CreateClientPage />} />

        <Route path="clients/:id" element={<ClientProfile />}>
          <Route index element={<ClientAccountDetails />} />
          <Route path="account" element={<ClientAccountDetails />} />
          <Route path="workouts" element={<ClientWorkouts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
