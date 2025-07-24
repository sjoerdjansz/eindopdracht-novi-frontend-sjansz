import styles from "./TrackWorkout.module.css";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/button/Button.jsx";
import { TrackExerciseCard } from "../../components/trackExerciseCard/TrackExerciseCard.jsx";
import { useApiRequest } from "../../hooks/useApiRequest.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../api/api.js";
import { formatDate } from "../../utils/formatDate.js";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";

export function TrackWorkout() {
  const [exercisesState, setExercisesState] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });

  const { id } = useParams();

  // Custom hooks
  const {
    error: workoutExercisesError,
    isLoading: workoutExercisesIsLoading,
    doRequest: getWorkoutExercises,
  } = useApiRequest();

  const {
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
      // console.log(mergedExercisesData);
      // place the matchedObject in state to be able to easily render the data together
      setExercisesState(mergedExercisesData);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (exercisesError || workoutExercisesError) {
      setShowSnackbar({
        open: true,
        message: "Couldn't fetch workout data",
        status: "error",
      });
    }
  }, [exercisesError, workoutExercisesError]);

  return (
    <div className={styles["track-workout"]}>
      {exercisesIsLoading || (workoutExercisesIsLoading && <LoadingSpinner />)}
      {showSnackbar.open && (
        <Snackbar
          message={showSnackbar.message}
          open={showSnackbar.open}
          status={showSnackbar.status}
          durationVisible={3000}
          onClose={() =>
            setShowSnackbar({
              ...showSnackbar,
              open: false,
            })
          }
        />
      )}
      <header className={styles["track-workout__header"]}>
        <div>
          <h1>{!workoutTemplateData ? "" : workoutTemplateData.name}</h1>
          <p>{formatDate(Date.now())}</p>
        </div>
        <Link to="">View workout notes</Link>
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
