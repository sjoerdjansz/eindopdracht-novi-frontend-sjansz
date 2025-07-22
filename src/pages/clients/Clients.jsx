import styles from "./Clients.module.css";
import { Button } from "../../components/button/Button.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { Card } from "../../components/card/Card.jsx";
import { CardHeader } from "../../components/card/CardHeader.jsx";
import { CardContent } from "../../components/card/CardContent.jsx";
import { CardFooter } from "../../components/card/CardFooter.jsx";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";

// Data
import { CLIENT_FILTER_OPTIONS } from "../../data/clientFilterOptions.js";
import placeholderAvatar from "../../assets/no_profile_picture_image.jpeg";

// Helpers
import { colorCodeText } from "../../utils/colorCodeText.js";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";
import { API_ENDPOINTS } from "../../api/api.js";
import { formatDate } from "../../utils/formatDate.js";
import { NoContent } from "../../components/noContent/NoContent.jsx";

export function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filterOption, setFilterOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    message: "",
    open: false,
    status: "",
    duration: 3000,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    let filteredArr = [...clients];

    if (filterOption === "firstName") {
      filteredArr.sort((a, b) => {
        return a.firstName.localeCompare(b.firstName);
      });
    } else if (filterOption === "complianceRate") {
      filteredArr.sort((a, b) => {
        return b.compliance - a.compliance;
      });
    } else if (filterOption === "completedWorkouts") {
      filteredArr.sort((a, b) => {
        return b.completedWorkouts - a.completedWorkouts;
      });
    } else if (filterOption === "joinedAtOld") {
      filteredArr.sort((a, b) => {
        return new Date(a.joinedAt) - new Date(b.joinedAt);
      });
    } else if (filterOption === "joinedAtNew") {
      filteredArr.sort((a, b) => {
        return new Date(b.joinedAt) - new Date(a.joinedAt);
      });
    } else {
      setFilterOption("");
    }

    setFilteredClients(filteredArr);
  }, [clients, filterOption]);

  async function fetchClients() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.clients, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });

      const changedData = data.map((client) => ({
        ...client,
        imageUrl: client["imageUrl[data]"]
          ? `data:${client["imageUrl[contentType]"]};base64,${client["imageUrl[data]"]}`
          : "",
      }));

      setClients(changedData);
    } catch (error) {
      setShowSnackbar({
        message: "Couldn't fetch client profiles",
        open: true,
        status: "warning",
        duration: 3000,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }

  const handleCreateClientClick = () => {
    navigate("/clients/create");
  };

  if (!hasLoaded || isLoading) {
    return <LoadingSpinner />;
  }

  if (filteredClients.length === 0) {
    return (
      <NoContent
        title="No clients yet"
        message="Make sure to add your first client."
        buttonLabel="Add client"
        handleClick={() => navigate("/clients/create")}
      />
    );
  }

  return (
    <div className={styles["clients-page"]}>
      {showSnackbar && (
        <Snackbar
          message={showSnackbar.message}
          open={showSnackbar.open}
          onClose={() =>
            setShowSnackbar({
              ...showSnackbar,
              open: true,
            })
          }
          durationVisible={showSnackbar.duration}
          status={showSnackbar.status}
        />
      )}
      <section className={styles["clients-page__header"]}>
        <div className={styles["clients-page__header-text"]}>
          <h1>Clients</h1>
          <Button
            buttonType="primary"
            buttonSize="medium"
            type="button"
            label="add client"
            handleClick={handleCreateClientClick}
          />
        </div>

        <InputWrapper width="small">
          <SelectField
            id="client-filter"
            label=""
            name="client-filter"
            options={CLIENT_FILTER_OPTIONS}
            title="Filter clients"
            value={filterOption}
            handleChange={(e) => setFilterOption(e.target.value)}
            button={true}
            styling="secondary"
            buttonStyle="secondary"
            buttonLabel="Reset"
            onButtonClick={() => setFilterOption("")}
          />
        </InputWrapper>
      </section>
      <section className={styles["clients-page__list"]}>
        {clients &&
          filteredClients.map((client) => {
            return (
              <Card key={client.id} variant="horizontal" size="medium">
                <div className={styles["clients-page__card-container"]}>
                  <CardHeader>
                    <div className={styles["clients-page__card-header"]}>
                      <div className={styles["clients-page__avatar-wrapper"]}>
                        <img
                          src={
                            client.imageUrl
                              ? client.imageUrl
                              : placeholderAvatar
                          }
                          alt={`client ${client.firstName} ${client.lastName} `}
                        />
                      </div>
                      <div className={styles["clients-page__card-details"]}>
                        <p>{`${client.firstName} ${client.lastName} `}</p>
                        <p>{formatDate(client.joinedAt)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={styles["clients-page__card-content"]}>
                      <p>
                        Workouts: <span>{client.completedWorkouts}</span>
                      </p>
                      <p>
                        Compliance:{" "}
                        <span
                          className={styles[colorCodeText(client.compliance)]}
                        >
                          {client.compliance}%
                        </span>
                      </p>
                      <p>
                        Plan: <span>{client.currentPlan}</span>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className={styles["clients-page-footer"]}>
                      <Button
                        buttonType="tertiary"
                        type="button"
                        label="View profile"
                        handleClick={() => {
                          navigate(`/clients/${client.id}`);
                        }}
                        buttonSize="small"
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
