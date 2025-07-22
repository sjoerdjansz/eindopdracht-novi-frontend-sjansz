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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";

export function ClientProfile() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    joinedAt: "",
    imageUrl: null,
    completedWorkouts: 0,
    compliance: 0,
    currentPlan: "",
    userId: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);

  const [clientWorkouts, setClientWorkouts] = useState([]);
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [isWorkoutsLoaded, setIsWorkoutsLoaded] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profileHasError, setProfileHasError] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
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

  function handleAvatarChange(e) {
    const avatar = e.target.files[0];
    if (!avatar) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;

      setProfile((prevState) => ({
        ...prevState,
        imageUrl: base64String,
      }));

      const base64Data = base64String.split(",")[1];

      const imgPayload = {
        data: base64Data,
        fileName: avatar.name,
        contentType: avatar.type,
      };

      addUserAvatar(imgPayload);
    };
    reader.readAsDataURL(avatar);
  }

  async function addUserAvatar(base64String) {
    try {
      setIsAvatarLoading(true);
      const response = await axios.patch(
        `${API_ENDPOINTS.clients}/${id}`,
        { imageUrl: base64String },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        },
      );
      setShowSnackbar({
        open: true,
        message: "Profile picture added",
        status: "success",
      });
    } catch (error) {
      console.error(error);
      setShowSnackbar({
        open: true,
        message: "Couldn't fetch user avatar",
        status: "error",
      });
    } finally {
      setIsAvatarLoading(false);
    }
  }

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

  async function fetchProfile(signal) {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_ENDPOINTS.clients}/${id}`, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
          signal,
        },
      });

      const profileData = {
        ...data,
        imageUrl: data["imageUrl[data]"]
          ? `data:${data["imageUrl[contentType]"]};base64,${data["imageUrl[data]"]}`
          : "",
      };

      setProfile(profileData);
      setOriginalProfile(profileData);
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
    if (!originalProfile) {
      return;
    }

    const updatedValues = {};
    const excludedFields = [
      "joinedAt",
      "imageUrl",
      "compliance",
      "completedWorkouts",
      "currentPlan",
      "userId",
    ];

    for (const key in profile) {
      if (excludedFields.includes(key)) continue;
      if (profile[key] !== originalProfile[key]) {
        updatedValues[key] = profile[key];
      }
    }

    if (Object.keys(updatedValues).length === 0) {
      setShowSnackbar({
        open: true,
        message: "No changes to save",
        status: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${API_ENDPOINTS.clients}/${id}`,
        updatedValues,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Updated", response.data);
      setOriginalProfile(profile);
      setShowSnackbar({
        open: true,
        message: "Changes saved",
        status: "success",
      });
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
      }, 1500);
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
                    <input
                      className={styles["upload-user-avatar-input"]}
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
                      onChange={handleAvatarChange}
                    />
                    <label
                      htmlFor="avatar"
                      className={styles["upload-user-avatar-label"]}
                    >
                      {isAvatarLoading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <FontAwesomeIcon icon={faCamera} />
                      )}
                    </label>
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
                      <p>{`${workoutTemplates.length} workouts assigned`}</p>
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
