import abs from "../assets/bodyparts/abs.svg";
import arms from "../assets/bodyparts/arms.svg";
import back from "../assets/bodyparts/back.svg";
import chest from "../assets/bodyparts/chest.svg";
import glutes from "../assets/bodyparts/glutes.svg";
import shoulders from "../assets/bodyparts/shoulders.svg";
import legs from "../assets/bodyparts/legs.svg";

export const WORKOUT_FILTER_OPTIONS = [
  { label: "Date added", value: "dateAdded" },
  { label: "Name", value: "name" },
];

export const BODYPARTS = [
  { label: "Chest", value: "chest", image: chest },
  { label: "Back", value: "back", image: back },
  { label: "Shoulders", value: "shoulders", image: shoulders },
  { label: "Arms", value: "arms", image: arms },
  { label: "Core", value: "core", image: abs },
  { label: "Glutes", value: "glutes", image: glutes },
  { label: "Legs", value: "legs", image: legs },
];

export const MOVEMENTS = [
  { label: "Horizontal push", value: "horizontalPush" },
  { label: "Horizontal pull", value: "horizontalPull" },
  { label: "Vertical push", value: "verticalPush" },
  { label: "Vertical pull", value: "verticalPull" },
  { label: "Hip hinge", value: "hipHinge" },
  { label: "Squatting", value: "squatting" },
  { label: "Accessory", value: "accessory" },
  { label: "Core", value: "core" },
];
