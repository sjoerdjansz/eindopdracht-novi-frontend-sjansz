import styles from "./ExerciseList.module.css";
import { Button } from "../../components/button/Button.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { useNavigate } from "react-router-dom";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { SWAGGER_UI, API_ENDPOINTS } from "../../api/api.js";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";

export function ExerciseList() {
  const navigate = useNavigate();
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    getExercises();
  }, []);

  // Get exercises api call
  async function getExercises() {
    try {
      setIsLoading(true);
      const response = await axios.get(API_ENDPOINTS.exercises, {
        headers: { "novi-education-project-id": SWAGGER_UI },
      });
      setExercises(response.data);
    } catch (e) {
      setErrorMessage(
        `${e.response.status}: ${e.code}. Failed to load exercises.`,
      );
      setShowSnackbar(true);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  const handleCreateExerciseClick = () => {
    navigate("/exercise-library/create");
  };

  // TODO make find and filter exercises functions
  function findExerciseChangeHandler(e) {
    console.log(e.target.value);
    setExerciseSearchQuery(e.target.value);
  }

  return (
    <div className={styles["exercise-list"]}>
      <h1>Exercise List</h1>

      {showSnackbar && (
        <Snackbar
          message={errorMessage}
          open={showSnackbar}
          status="warning"
          durationVisible={3000}
          onClose={() => {
            setShowSnackbar(false);
          }}
        />
      )}
      <section className={styles["exercise-list__controls"]}>
        <Button
          buttonType="primary"
          type="button"
          buttonSize="medium"
          label="create exercise"
          handleClick={handleCreateExerciseClick}
        />
        {isLoading && <LoadingSpinner />}
        <div className={styles["exercise-list__inputs"]}>
          <InputWrapper>
            <InputField
              type="text"
              name="filter-bodypart"
              id="filter-bodypart"
              placeholder="Filter bodypart"
              style="primary"
            />
          </InputWrapper>
          <InputWrapper>
            <InputField
              type="text"
              name="find-exercise"
              id="find-exercise"
              placeholder="Find exercise"
              style="primary"
              value={exerciseSearchQuery}
              handleChange={findExerciseChangeHandler}
            />
          </InputWrapper>
        </div>
      </section>
      <table>
        <thead>
          <tr className={styles["exercise-list__header"]}>
            <th className={styles["exercise-name--th"]}>Name</th>
            <th className={styles["exercise-bodypart--th"]}>Bodypart</th>
            <th className={styles["exercise-movement--th"]}>Movement</th>
            <th className={styles["exercise-muscle--th"]}>Primary</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => {
            return (
              <tr key={exercise.id} className={styles["exercise-list__row"]}>
                <td className={styles["exercise-name--td"]}>{exercise.name}</td>
                <td className={styles["exercise-bodypart--td"]}>
                  {exercise.bodypart}
                </td>
                <td className={styles["exercise-movement--td"]}>
                  {exercise.movement}
                </td>
                <td className={styles["exercise-muscle--td"]}>
                  {exercise.primaryMuscle}
                </td>
                <td className={styles["exercise-list__icons"]}>
                  <span>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
