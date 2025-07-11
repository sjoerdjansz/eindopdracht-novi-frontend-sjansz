import styles from "./Workouts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState, useEffect } from "react";
import axios from "axios";

// Components
import { Button } from "../../components/button/Button.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Card } from "../../components/card/Card.jsx";
import { CardHeader } from "../../components/card/CardHeader.jsx";
import { CardFooter } from "../../components/card/CardFooter.jsx";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { CustomCheckbox } from "../../components/customCheckbox/CustomCheckbox.jsx";

// Data
import { WORKOUT_FILTER_OPTIONS } from "../../data/workoutFilterOptions.js";

// Icons
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../api/api.js";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { formatDate } from "../../utils/formatDate.js";

export function Workouts() {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [allWorkoutTemplates, setAllWorkoutTemplates] = useState([]);
  const [filteredWorkoutTemplates, setFilteredWorkoutTemplates] = useState([]);
  const [workoutAuthors, setWorkoutAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });
  const [workoutFilter, setWorkoutFilter] = useState("");
  const [searchWorkouts, setSearchWorkouts] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkoutTemplates();
  }, []);

  useEffect(() => {
    let filteredArr = [...allWorkoutTemplates];

    // filtering on search query
    if (searchWorkouts) {
      filteredArr = filteredArr.filter((workout) => {
        return workout.name
          .toLowerCase()
          .includes(searchWorkouts.toLowerCase());
      });
    }

    // filtering on date or name
    if (workoutFilter === "dateAdded") {
      filteredArr.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else if (workoutFilter === "name") {
      filteredArr.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    setFilteredWorkoutTemplates(filteredArr);
  }, [allWorkoutTemplates, searchWorkouts, workoutFilter]);

  async function fetchWorkoutTemplates() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.workoutTemplates, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });

      setAllWorkoutTemplates(data);
      setFilteredWorkoutTemplates(data);
    } catch (error) {
      setShowSnackbar({
        open: true,
        message: "Couldn't fetch workout templates",
        status: "warning",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteWorkout(workoutTemplateId) {
    if (!workoutTemplateId) {
      setShowSnackbar({
        message: "Workout couldn't be deleted",
        open: true,
        status: "error",
      });
      return;
    }
    try {
      setIsLoading(true);
      await axios.delete(
        `${API_ENDPOINTS.workoutTemplates}/${workoutTemplateId}`,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        },
      );

      await fetchWorkoutTemplates();

      setShowSnackbar({
        message: "Workout deleted successfully",
        open: true,
        status: "success",
      });
    } catch (error) {
      setShowSnackbar({
        message: "Something went wrong while trying to delete the workout",
        open: true,
        status: "error",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleResetFilters() {
    setWorkoutFilter("");
    setSearchWorkouts("");
  }

  function handleSearchWorkouts(e) {
    setSearchWorkouts(e.target.value.toLowerCase());
  }

  function handleFilterWorkout(e) {
    setWorkoutFilter(e.target.value);
    console.log(e.target.value);
  }

  function handleCreateWorkoutClick() {
    navigate("/workouts/new-workout");
  }

  function removeItem(arr, value) {
    setSelectedWorkouts(
      arr.filter((item) => {
        console.log("deselected item:", value);
        return item !== value;
      }),
    );
  }

  function handleClick(workoutId) {
    const value = selectedWorkouts.find((id) => {
      return id === workoutId;
    });

    if (value) {
      removeItem(selectedWorkouts, value);
    } else {
      console.log("selected item:", workoutId);
      setSelectedWorkouts([...selectedWorkouts, workoutId]);
    }
  }

  return (
    <div className={styles["workouts-page"]}>
      {isLoading && <LoadingSpinner />}
      {showSnackbar && (
        <Snackbar
          message={showSnackbar.message}
          open={showSnackbar.open}
          status={showSnackbar.status}
          durationVisible={3000}
          onClose={() => setShowSnackbar(false)}
        />
      )}
      <div className={styles["workouts-page__header"]}>
        <h1>Workouts</h1>
        <Button
          buttonType="primary"
          buttonSize="medium"
          type="button"
          label="Create workout"
          handleClick={handleCreateWorkoutClick}
        />
      </div>
      <section className={styles["workouts-page__controls"]}>
        <InputWrapper width="small">
          <SelectField
            id="workout-filter"
            name="workout-filter"
            options={WORKOUT_FILTER_OPTIONS}
            title="Filter workouts"
            handleChange={handleFilterWorkout}
            value={workoutFilter}
            button={true}
            buttonLabel="Reset"
            buttonStyle="secondary"
            onButtonClick={handleResetFilters}
          />
        </InputWrapper>
        <InputWrapper width="small">
          <InputField
            type="text"
            name="search-workout"
            id="search-workout"
            placeholder="Search workout"
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            handleChange={handleSearchWorkouts}
            value={searchWorkouts}
          />
        </InputWrapper>
      </section>
      <section className={styles["workout-page__list"]}>
        {filteredWorkoutTemplates.map((workout) => {
          return (
            <Card key={workout.id} variant="horizontal" size="medium">
              <div className={styles["workout-page__card-container"]}>
                <CardHeader>
                  <div className={styles["workouts-page__card-header"]}>
                    <CustomCheckbox
                      className={styles["workouts__card-select"]}
                      type="button"
                      name="select-workout"
                      onClick={() => {
                        handleClick(workout.id);
                      }}
                      selected={selectedWorkouts.find((id) => {
                        return id === workout.id;
                      })}
                    />
                    <div>
                      <h4>{workout.name}</h4>
                      <p>{formatDate(workout.createdAt)}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter>
                  <div className={styles["workouts__icons-container"]}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDeleteWorkout(workout.id)}
                    />
                  </div>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
