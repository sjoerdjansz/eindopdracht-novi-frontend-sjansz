import styles from "./ExerciseList.module.css";
import { Button } from "../../components/button/Button.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { useNavigate } from "react-router-dom";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/api.js";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { BODYPART_FILTER_OPTIONS } from "../../data/clientFilterOptions.js";

export function ExerciseList() {
  const navigate = useNavigate();
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");
  const [originalExercises, setOriginalExercises] = useState([]);
  const [findExercises, setFindExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [bodyPartFilter, setBodyPartFilter] = useState("");

  useEffect(() => {
    getExercises();
  }, []);

  useEffect(() => {
    let filteredExercises = originalExercises;

    if (exerciseSearchQuery) {
      filteredExercises = filteredExercises.filter((exercise) => {
        return exercise.name.toLowerCase().includes(exerciseSearchQuery);
      });
    }

    if (bodyPartFilter) {
      filteredExercises = filteredExercises.filter((exercise) => {
        return (
          exercise.bodypart.toLowerCase().replaceAll(" ", "") ===
          bodyPartFilter.toLowerCase().trim()
        );
      });
    }

    setFindExercises(filteredExercises);
  }, [bodyPartFilter, exerciseSearchQuery, originalExercises]);

  // Get exercises api call
  async function getExercises() {
    try {
      setIsLoading(true);
      const response = await axios.get(API_ENDPOINTS.exercises, {
        headers: { "novi-education-project-id": import.meta.env.VITE_API_KEY },
      });
      setOriginalExercises(response.data);
      setFindExercises(response.data);
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

  function findExerciseChangeHandler(e) {
    setExerciseSearchQuery(e.target.value.toLowerCase());
  }

  function filterBodypartChangeHandler(e) {
    setBodyPartFilter(e.target.value.toLowerCase().trim().replaceAll(" ", ""));
  }

  function resetAllFilters() {
    setBodyPartFilter("");
    setExerciseSearchQuery("");
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
            <SelectField
              id="bodypart"
              name="bodypart"
              options={BODYPART_FILTER_OPTIONS}
              value={bodyPartFilter}
              title="Bodypart"
              handleChange={filterBodypartChangeHandler}
              onButtonClick={resetAllFilters}
              button={true}
              buttonLabel="reset"
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
          {originalExercises &&
            findExercises.map((exercise) => {
              return (
                <tr key={exercise.id} className={styles["exercise-list__row"]}>
                  <td className={styles["exercise-name--td"]}>
                    {exercise.name}
                  </td>
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
