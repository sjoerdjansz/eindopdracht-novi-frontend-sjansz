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
  faBoxArchive,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../api/api.js";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { NoContent } from "../../components/noContent/NoContent.jsx";
import { useApiRequest } from "../../hooks/useApiRequest.js";

export function Workouts() {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [allWorkoutTemplates, setAllWorkoutTemplates] = useState([]);
  const [filteredWorkoutTemplates, setFilteredWorkoutTemplates] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState({});
  const [loadingState, setLoadingState] = useState({
    workouts: false,
    assign: false,
    archive: false,
  });
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });
  const [workoutFilter, setWorkoutFilter] = useState("");
  const [searchWorkouts, setSearchWorkouts] = useState("");
  const [selectClient, setSelectClient] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const navigate = useNavigate();

  // Custom hook
  const { isLoading: isClientLoading, sendRequest } = useApiRequest();

  useEffect(() => {
    fetchWorkoutTemplates();

    // usage of custom hook
    async function getClients() {
      const result = await sendRequest({
        method: "GET",
        url: `${API_ENDPOINTS.clients}`,
      });
      if (result) {
        setAllClients(result);
      } else {
        setShowSnackbar({
          open: true,
          message: "Failed to fetch clients",
          status: "error",
        });
      }
    }
    getClients();
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
      setLoadingState((prevState) => ({ ...prevState, workouts: true }));
      const { data } = await axios.get(API_ENDPOINTS.workoutTemplates, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });

      setWorkoutExercises({});

      const filteredTemplatesData = data.filter(
        (template) => !template.archivedAt,
      );

      await Promise.all(
        data.map((template) => fetchWorkoutExercises(template.id)),
      );

      setAllWorkoutTemplates(filteredTemplatesData);
      setFilteredWorkoutTemplates(filteredTemplatesData);
    } catch (error) {
      setShowSnackbar({
        open: true,
        message: "Couldn't fetch workout templates",
        status: "warning",
      });
      console.error(error);
    } finally {
      setLoadingState((prevState) => ({ ...prevState, workouts: false }));
      setHasLoaded(true);
    }
  }

  async function pairUserWorkoutsToUser(clientId, workoutTemplates) {
    if (!clientId || !workoutTemplates?.length) {
      return;
    }

    try {
      setLoadingState((prevState) => ({ ...prevState, assign: true }));
      const existingWorkoutTemplates = await fetchClientWorkouts(clientId);

      const existingTemplateIds = existingWorkoutTemplates.map((template) => {
        return template.workoutTemplateId;
      });

      const newTemplatesToAssign = workoutTemplates.filter((templateId) => {
        return !existingTemplateIds.includes(parseInt(templateId));
      });

      if (newTemplatesToAssign.length === 0) {
        setShowSnackbar({
          open: true,
          message: "A selected workout is already assigned",
          status: "error",
        });
        return;
      }

      for (let i = 0; i < newTemplatesToAssign.length; i++) {
        await axios.post(
          `${API_ENDPOINTS.userWorkouts}`,

          {
            userProfileId: parseInt(clientId),
            workoutTemplateId: parseInt(newTemplatesToAssign[i]),
          },
          {
            headers: {
              "novi-education-project-id": import.meta.env.VITE_API_KEY,
              "Content-Type": "application/json",
            },
          },
        );
      }
      const matchedClient = allClients.find(
        (client) => parseInt(selectClient) === parseInt(client.id),
      );

      setSelectedWorkouts([]);

      setShowSnackbar({
        open: true,
        message: `Workout(s) successfully assigned to ${matchedClient.firstName} ${matchedClient.lastName}`,
        status: "success",
      });
    } catch (error) {
      setShowSnackbar({
        open: true,
        message: "Something went wrong while assigning the workout(s)",
        status: "error",
      });
      console.error(error);
    } finally {
      setLoadingState((prevState) => ({ ...prevState, assign: false }));
    }
  }

  async function fetchClientWorkouts(clientId) {
    try {
      setLoadingState((prevState) => ({ ...prevState, workouts: true }));
      const { data } = await axios.get(
        `${API_ENDPOINTS.clients}/${clientId}/userWorkouts`,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        },
      );
      return data;
    } catch (error) {
      setShowSnackbar({
        open: true,
        status: "error",
        message: "Couldn't fetch the client workout templates",
      });
      console.error(error);
    } finally {
      setLoadingState((prevState) => ({ ...prevState, workouts: false }));
    }
  }

  async function fetchWorkoutExercises(templateId) {
    if (!templateId) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${API_ENDPOINTS.workoutTemplates}/${templateId}/workoutExercises`,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        },
      );
      setWorkoutExercises((prevState) => ({
        ...prevState,
        [templateId]: data,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  // deleting is actually archiving (TODO: create archived workouts component)
  async function handleDeleteWorkout(workoutTemplateId) {
    if (!workoutTemplateId) {
      setShowSnackbar({
        message: "Workout couldn't be archived",
        open: true,
        status: "error",
      });
      return;
    }

    const result = filteredWorkoutTemplates.find((template) => {
      return template.id === workoutTemplateId;
    });

    try {
      setLoadingState((prevState) => ({ ...prevState, archive: true }));
      await axios.put(
        `${API_ENDPOINTS.workoutTemplates}/${workoutTemplateId}`,
        { ...result, archivedAt: new Date().toISOString() },
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      await fetchWorkoutTemplates();
    } catch (error) {
      setShowSnackbar({
        message: "Something went wrong while trying to archive the workout",
        open: true,
        status: "error",
      });
      console.error(error);
    } finally {
      setLoadingState((prevState) => ({ ...prevState, archive: false }));
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
  }

  function handleSelectClient(e) {
    setSelectClient(e.target.value);
  }

  function handleCreateWorkoutClick() {
    navigate("/workouts/new-workout");
  }

  function deselectWorkout(arr, value) {
    setSelectedWorkouts(
      arr.filter((item) => {
        return item !== value;
      }),
    );
  }

  function selectWorkout(workoutId) {
    const value = selectedWorkouts.find((id) => {
      return id === workoutId;
    });

    if (value) {
      deselectWorkout(selectedWorkouts, value);
    } else {
      setSelectedWorkouts([...selectedWorkouts, workoutId]);
    }
  }

  // TODO: fix buggy loading spinner & snackbar ui flickering
  if (!hasLoaded || loadingState.workouts || loadingState.archive) {
    return <LoadingSpinner />;
  }

  if (filteredWorkoutTemplates.length === 0) {
    return (
      <NoContent
        title="No workout templates yet"
        message="Create your first workout."
        handleClick={() => {
          navigate("/workouts/new-workout");
        }}
        buttonLabel="Create workout"
      />
    );
  }

  return (
    <div className={styles["workouts-page"]}>
      {showSnackbar.open && (
        <Snackbar
          message={showSnackbar.message}
          open={showSnackbar.open}
          status={showSnackbar.status}
          durationVisible={3000}
          onClose={() => setShowSnackbar({ ...showSnackbar, open: false })}
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
        <div>
          <InputWrapper width="small">
            {isClientLoading ? (
              <p>Loading clients...</p>
            ) : (
              <SelectField
                id="client-select"
                name="client-select"
                title="Select client"
                options={allClients.map((client) => ({
                  label: `${client.firstName} ${client.lastName}`,
                  value: client.id.toString(),
                }))}
                value={selectClient}
                handleChange={handleSelectClient}
                button={true}
                buttonLabel="Add"
                buttonStyle="secondary"
                onButtonClick={() => {
                  pairUserWorkoutsToUser(selectClient, selectedWorkouts);
                }}
                disabled={selectClient.length <= 0}
              />
            )}
          </InputWrapper>

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
        </div>
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
        {filteredWorkoutTemplates.map((template) => {
          return (
            <Card key={template.id} variant="horizontal" size="medium">
              <div className={styles["workout-page__card-container"]}>
                <CardHeader>
                  <div className={styles["workouts-page__card-header"]}>
                    <CustomCheckbox
                      className={styles["workouts__card-select"]}
                      type="button"
                      name="select-workout"
                      onClick={() => {
                        selectWorkout(template.id);
                      }}
                      selected={selectedWorkouts.find((id) => {
                        return id === template.id;
                      })}
                    />
                    <div>
                      <h4>{template.name}</h4>
                      <p>
                        {workoutExercises[template.id]?.length || "No"}{" "}
                        exercises in workout
                      </p>
                      <p>{formatDate(template.createdAt)}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter>
                  <div className={styles["workouts__icons-container"]}>
                    <FontAwesomeIcon
                      icon={faBoxArchive}
                      onClick={() => handleDeleteWorkout(template.id)}
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
