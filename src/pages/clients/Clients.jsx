import styles from "./Clients.module.css";
import { Button } from "../../components/button/Button.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { Card } from "../../components/card/Card.jsx";

// Data
import { CLIENT_FILTER_OPTIONS } from "../../data/clientFilterOptions.js";
import { CLIENTS } from "../../data/clientData.js";

export function Clients() {
  return (
    <div className={styles.clients}>
      <h1>Clients</h1>

      <section className={styles["clients__controls"]}>
        <Button
          buttonType="primary"
          buttonSize="medium"
          type="button"
          label="add client"
        />

        <div className={styles["filter-controls"]}>
          <SelectField
            id="client-filter"
            label=""
            name="client-filter"
            options={CLIENT_FILTER_OPTIONS}
          />
        </div>
      </section>
      <section className={styles["clients__list"]}>
        {CLIENTS.map((client) => {
          return (
            <Card
              key={client.id}
              lastActive={client.lastActive}
              activeSince={client.clientSince}
              clientName={client.name}
              profilePicture={client.avatar}
              workouts={client.workouts}
              compliance={client.complianceRate}
              program={client.currentPlan}
            />
          );
        })}
      </section>
    </div>
  );
}
