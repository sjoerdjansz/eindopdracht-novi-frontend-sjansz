import {
  faTableColumns,
  faBook,
  faDumbbell,
  faUser,
  faShapes,
} from "@fortawesome/free-solid-svg-icons";

export const NAV_ITEMS = [
  {
    id: 1,
    label: "dashboard",
    to: "/",
    icon: faTableColumns,
  },
  { id: 2, label: "exercise library", to: "/exercise-library", icon: faBook },
  { id: 3, label: "workouts", to: "/workouts", icon: faDumbbell },
  {
    id: 4,
    label: "build workout",
    to: "/workouts/new-workout",
    icon: faShapes,
  },
  { id: 5, label: "clients", to: "/clients", icon: faUser },
];
