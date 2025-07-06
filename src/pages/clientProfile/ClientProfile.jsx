import styles from "./ClientProfile.module.css";
import {
  Link,
  NavLink,
  Outlet,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

import { Card } from "../../components/card/Card.jsx";
import { Button } from "../../components/button/Button.jsx";
import placeholderAvatar from "../../assets/no_profile_picture_image.jpeg";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";

import { InputField } from "../../components/inputField/InputField.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../api/api.js";

export function ClientProfile() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchWorkouts();
    };
    fetchData();
  }, [id]);

  async function fetchWorkouts() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${API_ENDPOINTS.profiles}/${id}/userWorkouts`,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        },
      );

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
      const results = response.map((res) => res.data);
      setWorkoutTemplates(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_ENDPOINTS.profiles}/${id}`, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });
      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // TODO: save function maken met patch/put naar db
  function handleSaveChanges() {
    setShowSnackbar(true);
  }

  return (
    <div className={styles["profile-page"]}>
      {isLoading && <LoadingSpinner />}
      {showSnackbar && (
        <Snackbar
          message="Changes have been saved"
          open={showSnackbar}
          status="success"
          durationVisible={3000}
          onClose={() => setShowSnackbar(false)}
        />
      )}
      <h4>Profile</h4>
      <div className={styles["profile-page__container"]}>
        <Card>
          <div className={styles["profile-page__card-container"]}>
            <div className={styles["profile-page__card-header"]}>
              <div className={styles["profile-page__avatar-wrapper"]}>
                <img
                  className={styles["user-avatar"]}
                  src={profile.imageUrl ? profile.imageUrl : placeholderAvatar}
                  alt={`Profile picture of ${profile.firstName}`}
                />
              </div>

              <div className={styles["profile-page__user-details"]}>
                <h4>{`${profile.firstName} ${profile.lastName}`}</h4>
                <p>{`Joined: ${profile.joinedAt}`}</p>
              </div>

              {/* TODO Veranderen naar Link en workout assign text, schijnt netter te zijn*/}
              {workoutTemplates.length > 0 ? (
                <Button
                  buttonType="success"
                  label="Start Workout"
                  type="button"
                  buttonSize="medium"
                  handleClick={() => navigate(`/clients/${id}/workouts`)}
                />
              ) : (
                <Button
                  buttonType="secondary"
                  label="Assign workout"
                  type="button"
                  buttonSize="medium"
                  handleClick={() => navigate("/workouts")}
                />
              )}
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
                clientWorkouts: clientWorkouts,
                workoutTemplates: workoutTemplates,
              }}
            />
          </div>
        </Card>
      </div>

      <footer className={styles["profile-page__footer"]}>
        <Link to={""}>Delete account</Link>
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
