import styles from "./ClientProfile.module.css";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

import { Card } from "../../components/card/Card.jsx";
import { Button } from "../../components/button/Button.jsx";
import placeholderAvatar from "../../assets/no_profile_picture_image.jpeg";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";

import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../api/api.js";
import { formatDate } from "../../utils/formatDate.js";
import { DeleteConfirmation } from "../../components/deleteConfirmation/DeleteConfirmation.jsx";

export function ClientProfile() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    imageUrl: "",
    joinedAt: "",
    completedWorkouts: 0,
    compliance: 0,
    wellbeing: "",
  });
  const [clientWorkouts, setClientWorkouts] = useState([]);
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [isWorkoutsLoaded, setIsWorkoutsLoaded] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profileHasError, setProfileHasError] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      await fetchProfile(controller.signal);
      await fetchWorkouts(controller.signal);
    };
    fetchData();

    return function cleanup() {
      controller.abort();
    };
  }, [id]);

  async function fetchWorkouts(signal) {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${API_ENDPOINTS.clients}/${id}/userWorkouts`,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            signal,
          },
        },
      );

      setClientWorkouts(data);

      const response = await axios.all(
        data.map((workout) => {
          return axios.get(
            `${API_ENDPOINTS.workoutTemplates}/${workout.workoutTemplateId}`,
            {
              headers: {
                "novi-education-project-id": import.meta.env.VITE_API_KEY,
              },
            },
          );
        }),
      );

      const templates = response.map((res, index) => ({
        ...res.data,
        userWorkoutId: data[index].id,
      }));

      setWorkoutTemplates(templates);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsWorkoutsLoaded(true);
    }
  }

  async function deleteWorkout(userWorkoutId) {
    try {
      setIsLoading(true);
      await axios.delete(`${API_ENDPOINTS.userWorkouts}/${userWorkoutId}`, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });

      setShowSnackbar({
        open: true,
        status: "success",
        message: "Workout deleted",
      });

      await fetchWorkouts();
    } catch (error) {
      setShowSnackbar({
        open: true,
        status: "error",
        message: "Something went wrong while deleting the workout",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // TODO also create fetch user email for specific user profile at users collection

  async function fetchProfile(signal) {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_ENDPOINTS.clients}/${id}`, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
          signal,
        },
      });
      setProfile(data);

      setIsProfileLoaded(true);
    } catch (error) {
      console.error(error);

      setProfileHasError(true);

      setShowSnackbar({
        message: "Client not found",
        open: true,
        status: "error",
      });

      setTimeout(() => {
        navigate("/clients");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${API_ENDPOINTS.clients}/${id}`,
        {
          ...profile,
          id: id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          gender: profile.gender,
        },
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDeleteClick() {
    setToggleDelete(true);
  }

  async function handleDeleteClient() {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${API_ENDPOINTS.clients}/${id}`, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });

      console.log(response);

      setShowSnackbar({
        message: "Client deleted",
        open: true,
        status: "success",
      });

      setTimeout(() => {
        navigate("/clients");
      }, 2000);
    } catch (error) {
      console.error(error);
      setShowSnackbar({
        message: "Failed to delete client",
        open: true,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSaveChanges() {
    setShowSnackbar(true);
    updateProfile();
  }

  if (!isProfileLoaded || profileHasError) {
    return (
      <div className={styles["profile-page"]}>
        <Snackbar
          message="Client not found"
          open={showSnackbar}
          status="error"
          durationVisible={3000}
          onClose={() => setShowSnackbar(false)}
        />
      </div>
    );
  }
  return (
    <div className={styles["profile-page"]}>
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
      <h4>Profile</h4>
      {toggleDelete && (
        <DeleteConfirmation
          title="Are you sure you want to delete"
          item={profile.firstName || "this client"}
          onCancel={() => setToggleDelete(false)}
          onDelete={() => handleDeleteClient()}
        />
      )}
      <div className={styles["profile-page__container"]}>
        {isWorkoutsLoaded && (
          <>
            <Card>
              <div className={styles["profile-page__card-container"]}>
                <div className={styles["profile-page__card-header"]}>
                  <div className={styles["profile-page__avatar-wrapper"]}>
                    <img
                      className={styles["user-avatar"]}
                      src={
                        profile.imageUrl ? profile.imageUrl : placeholderAvatar
                      }
                      alt={`Profile picture of ${profile.firstName}`}
                    />
                  </div>

                  <div className={styles["profile-page__user-details"]}>
                    <h4>{`${profile.firstName} ${profile.lastName}`}</h4>
                    <p>{`Joined: ${formatDate(profile.joinedAt)}`}</p>
                  </div>

                  <div className={styles["profile-page__workout-buttons"]}>
                    {workoutTemplates.length > 0 ? (
                      <Link
                        className={`${styles["workout-button"]} ${styles.start}`}
                        to={`/clients/${id}/workouts`}
                      >
                        Start Workout
                      </Link>
                    ) : (
                      <>
                        <p>No workouts assigned yet.</p>
                        <Link
                          className={`${styles["workout-button"]} ${styles.assign}`}
                          to={"/workouts"}
                        >
                          Assign Workout
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles["profile-page__user-stats"]}>
                  <p className={styles["statistic"]}>
                    Workouts completed: <span>{profile.completedWorkouts}</span>
                  </p>
                  <hr />
                  <p className={styles["statistic"]}>
                    Compliance score: <span>{profile.compliance}%</span>
                  </p>
                  <hr />
                  <p className={styles["statistic"]}>
                    Wellbeing score:
                    <span>{profile.wellbeing ? profile.wellbeing : "n/a"}</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className={styles["profile-page__settings-card"]}>
                <nav className={styles["profile-page__settings-navigation"]}>
                  <ul className={styles["profile-page__settings-links"]}>
                    <li className={styles["profile-page__settings-link"]}>
                      <NavLink
                        to="account"
                        className={({ isActive }) => {
                          return isActive ? styles.activeNavLink : "";
                        }}
                      >
                        Account
                      </NavLink>
                    </li>
                    <li className={styles["profile-page__settings-link"]}>
                      <NavLink
                        to="workouts"
                        className={({ isActive }) => {
                          return isActive ? styles.activeNavLink : "";
                        }}
                      >
                        Workouts
                      </NavLink>
                    </li>
                  </ul>
                </nav>
                <Outlet
                  context={{
                    profile: profile,
                    setProfile: setProfile,
                    clientWorkouts: clientWorkouts,
                    workoutTemplates: workoutTemplates,
                    deleteWorkout: deleteWorkout,
                  }}
                />
              </div>
            </Card>
          </>
        )}
      </div>

      <footer className={styles["profile-page__footer"]}>
        <button
          onClick={() => {
            handleDeleteClick();
          }}
          type="button"
          className={styles["delete-link"]}
        >
          Delete account
        </button>
        <Button
          buttonType="primary"
          buttonSize="large"
          type="button"
          label="Save Changes"
          handleClick={handleSaveChanges}
        />
      </footer>
    </div>
  );
}
