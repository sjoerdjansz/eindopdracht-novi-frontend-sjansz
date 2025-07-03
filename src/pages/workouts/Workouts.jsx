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

export function Workouts() {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [allWorkoutTemplates, setAllWorkoutTemplates] = useState([]);
  const [filteredWorkoutTemplates, setFilteredWorkoutTemplates] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });
  const [workoutFilter, setWorkoutFilter] = useState("");
  const [searchWorkouts, setSearchWorkouts] = useState("");

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

  const navigate = useNavigate();

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

      // filtering unique user ids so that we don't have to do redundant api calls
      const userIds = data.map((user) => {
        return user.createdByUsersId;
      });

      const uniqueUserIds = userIds.filter((id, index) => {
        return userIds.indexOf(id) === index;
      });

      await fetchProfiles(uniqueUserIds);
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

  async function fetchProfiles(ids) {
    try {
      const requests = ids.map((id) => {
        return axios.get(`${API_ENDPOINTS.profiles}/${id}`, {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        });
      });

      const responses = await Promise.all(requests);
      const users = responses.map((response) => response.data);

      setProfiles(users);
    } catch (error) {
      setShowSnackbar({
        open: true,
        message: "Failed to load user profiles",
        status: "warning",
      });
      console.error(error);
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
        console.log("deleted item:", value);
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
      console.log("added item:", workoutId);
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
        <InputField
          type="text"
          name="search-workout"
          id="search-workout"
          placeholder="Search workout"
          icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          handleChange={handleSearchWorkouts}
          value={searchWorkouts}
        />
        <div>
          <SelectField
            id="workout-filter"
            name="workout-filter"
            options={WORKOUT_FILTER_OPTIONS}
            title="Filter workouts"
            handleChange={handleFilterWorkout}
            value={workoutFilter}
            button={true}
            buttonLabel="Reset"
            onButtonClick={handleResetFilters}
          />
        </div>
      </section>
      <section className={styles["workout-page__list"]}>
        {filteredWorkoutTemplates.map((workout) => {
          return (
            <Card key={workout.id} variant="horizontal" size="medium">
              <div className={styles["workout-page__card-container"]}>
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
                  <CardHeader>
                    <h4>{workout.name}</h4>
                    <p>
                      {(() => {
                        const author = profiles.find(
                          (profile) =>
                            profile.userId === workout.createdByUsersId,
                        );
                        return author
                          ? `Author: ${author.firstName} ${author.lastName}`
                          : "";
                      })()}
                    </p>
                    <p>{workout.createdAt}</p>
                  </CardHeader>
                </div>
                <CardFooter>
                  <div className={styles["workouts__icons-container"]}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <FontAwesomeIcon icon={faTrash} />
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
