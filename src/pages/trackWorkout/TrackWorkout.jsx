import styles from "./TrackWorkout.module.css";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/button/Button.jsx";
import { TrackExerciseCard } from "../../components/trackExerciseCard/TrackExerciseCard.jsx";
import { useApiRequest } from "../../hooks/useApiRequest.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../api/api.js";
import { formatDate } from "../../utils/formatDate.js";

export function TrackWorkout() {
  const [exercisesState, setExercisesState] = useState([]);

  const { id } = useParams();

  // Custom hooks
  const {
    data: workoutExercisesData,
    error: workoutExercisesError,
    isLoading: workoutExercisesIsLoading,
    doRequest: getWorkoutExercises,
  } = useApiRequest();

  const {
    data: exercisesData,
    error: exercisesError,
    isLoading: exercisesIsLoading,
    doRequest: getExercises,
  } = useApiRequest();

  const { data: workoutTemplateData, doRequest: getWorkoutTemplate } =
    useApiRequest();

  useEffect(() => {
    async function fetchData() {
      const workoutTemplate = await getWorkoutTemplate({
        method: "GET",
        url: `${API_ENDPOINTS.workoutTemplates}/${id}`,
      });

      if (!workoutTemplate) {
        return;
      }

      const workoutExercises = await getWorkoutExercises({
        method: "GET",
        url: `${API_ENDPOINTS.workoutTemplates}/${id}/workoutExercises`,
      });

      if (!workoutExercises) {
        return;
      }

      const exerciseIds = workoutExercises.map((item) => {
        return item.exerciseId;
      });

      const exercises = await getExercises({
        method: "GET",
        url: `${API_ENDPOINTS.exercises}?id=${exerciseIds.join(",")}`,
      });

      if (!exercises) {
        return;
      }

      // we map over the workoutExercises array
      const mergedExercisesData = workoutExercises.map((workoutItem) => {
        // for each workoutItem we look for a matching id and save the result of the exercises.find,
        // which is an object from exercises array
        const matchedResult = exercises.find((exercise) => {
          // return if there is a match
          return exercise.id === workoutItem.exerciseId;
        });
        // return an object consisting of the key/value pairs of the workoutItem object and matched resul
        // object, which is the exercise.
        return { ...workoutItem, ...matchedResult };
      });
      console.log(mergedExercisesData);
      // place the matchedObject in state to be able to easily render the data together
      setExercisesState(mergedExercisesData);
    }

    fetchData();
  }, []);

  return (
    <div className={styles["track-workout"]}>
      <header className={styles["track-workout__header"]}>
        <div>
          <h1>{!workoutTemplateData ? "" : workoutTemplateData.name}</h1>
          <p>{formatDate(Date.now())}</p>
        </div>
        <Link to="track-workout/1">View workout notes</Link>
      </header>

      <main className={styles["track-workout__exercises-container"]}>
        {exercisesState.length > 0 &&
          exercisesState.map((exercise) => {
            return (
              <TrackExerciseCard
                key={exercise.exerciseId}
                exerciseName={exercise.name}
                setCount={exercise.sets}
              />
            );
          })}
      </main>
      <div className={styles["track-workout__footer"]}>
        <Button
          buttonType="secondary"
          label="Add exercise"
          type="button"
          buttonSize="medium"
        />
        <Button
          buttonType="success"
          label="Save workout"
          type="button"
          buttonSize="medium"
        />
      </div>
    </div>
  );
}
