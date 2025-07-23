import styles from "./Workouts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useMemo, useState } from "react";
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
import { useApiRequest } from "../../hooks/useApiRequest.jsx";

export function Workouts() {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });
  const [workoutFilter, setWorkoutFilter] = useState("");
  const [searchWorkouts, setSearchWorkouts] = useState("");
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [selectClient, setSelectClient] = useState("");

  const navigate = useNavigate();

  // Custom hook
  const {
    data: clientData,
    error: clientError,
    doRequest: getClients,
  } = useApiRequest();

  const {
    data: workoutData,
    error: workoutError,
    doRequest: getWorkouts,
  } = useApiRequest();

  const {
    data: deletedWorkout,
    error: errorDeleteWorkout,
    doRequest: deleteWorkout,
  } = useApiRequest();

  useEffect(() => {
    async function fetchData() {
      const clients = await getClients({
        method: "GET",
        url: `${API_ENDPOINTS.clients}`,
      });

      const workouts = await getWorkouts({
        method: "GET",
        url: `${API_ENDPOINTS.workoutTemplates}`,
      });
      setHasFetchedData(true);
      if (!clients) {
        setShowSnackbar({
          open: true,
          message: `Couldn't fetch clients: ${clientError}`,
          status: "error",
        });
      }
      if (!workouts) {
        setShowSnackbar({
          open: true,
          message: `Couldn't fetch workouts: ${workoutError}`,
          status: "error",
        });
      }
    }
    void fetchData();
  }, []);

  // Deze useMemo maakt een memoized versie van de filtered workouts en voert de callback alleen uit wanneer
  // een dependency verandert. Hij retourneert dus de return value van de callback en onthoudt deze tot een
  // dependency verandert. Hierdoor hebben we geen extra useEffect en state nodig.
  const filteredWorkoutTemplates = useMemo(() => {
    if (!workoutData) {
      return [];
    }

    let filteredArr = [...workoutData];

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
    return filteredArr;
  }, [workoutData, searchWorkouts, workoutFilter]);

  useEffect(() => {
    if (workoutError || clientError) {
      setShowSnackbar({
        open: true,
        message:
          "Something went wrong while fetching client and workout template data",
        status: "error",
      });
    }
  }, [workoutError, clientError]);

  async function assignUserWorkoutsToUser(clientId, workoutTemplates) {
    if (!clientId || !workoutTemplates?.length) {
      return;
    }

    try {
      const { data: existingWorkoutTemplates } = await axios.get(
        `${API_ENDPOINTS.clients}/${clientId}/userWorkouts`,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        },
      );

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

      const matchedClient = clientData.find(
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
    }
  }

  // deleting is actually archiving (TODO: create archived workouts component)
  async function handleDeleteWorkout(workoutTemplateId) {
    console.log(workoutTemplateId);
    if (!workoutTemplateId) {
      setShowSnackbar({
        message: "Workout couldn't be archived",
        open: true,
        status: "error",
      });
      return;
    }

    const result = workoutData.find((template) => {
      return template.id === workoutTemplateId;
    });

    try {
      await deleteWorkout({
        method: "PUT",
        url: `${API_ENDPOINTS.workoutTemplates}/${workoutTemplateId}`,
        data: {
          ...result,
          archivedAt: new Date().toISOString(),
        },
      });

      await getWorkouts({
        method: "GET",
        url: `${API_ENDPOINTS.workoutTemplates}`,
      });
    } catch (error) {
      setShowSnackbar({
        message: "Something went wrong while trying to archive the workout",
        open: true,
        status: "error",
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

  if (!hasFetchedData) {
    return <LoadingSpinner />;
  }

  if (!workoutData) {
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
          onClose={() =>
            setShowSnackbar({
              ...showSnackbar,
              open: false,
            })
          }
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
            {clientData && (
              <SelectField
                id="client-select"
                name="client-select"
                title="Select client"
                options={clientData.map((client) => ({
                  label: `${client.firstName} ${client.lastName}`,
                  value: client.id.toString(),
                }))}
                value={selectClient}
                handleChange={handleSelectClient}
                button={true}
                buttonLabel="Add"
                buttonStyle="secondary"
                onButtonClick={() => {
                  assignUserWorkoutsToUser(selectClient, selectedWorkouts);
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
            !template.archivedAt && (
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
                          {template.numberOfExercises || "No"} exercises in
                          workout
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
            )
          );
        })}
      </section>
    </div>
  );
}
