import styles from "./Clients.module.css";
import { Button } from "../../components/button/Button.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { Card } from "../../components/card/Card.jsx";
import { CardHeader } from "../../components/card/CardHeader.jsx";
import { CardContent } from "../../components/card/CardContent.jsx";
import { CardFooter } from "../../components/card/CardFooter.jsx";

// Data
import { CLIENT_FILTER_OPTIONS } from "../../data/clientFilterOptions.js";
import { CLIENTS } from "../../data/clientData.js";

// Helpers
import { colorCodeText } from "../../utils/colorCodeText.js";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";

export function Clients() {
  return (
    <div className={styles.clients}>
      <h1>Clients</h1>

      <section className={styles["clients__controls"]}>
        <div className={styles["controls__container"]}>
          <Button
            buttonType="primary"
            buttonSize="medium"
            type="button"
            label="add client"
          />
          <InputWrapper width="small">
            <SelectField
              id="client-filter"
              label=""
              name="client-filter"
              options={CLIENT_FILTER_OPTIONS}
              title="Filter clients"
            />
          </InputWrapper>
        </div>
      </section>
      <section className={styles["clients__list"]}>
        {CLIENTS.map((client) => {
          return (
            <Card
              key={Math.random() + client.id}
              variant="horizontal"
              size="medium"
            >
              <CardHeader>
                <div className={styles["card__client-info"]}>
                  <div className={styles["card__avatar-wrapper"]}>
                    <img
                      className={styles["card__avatar"]}
                      src={client.avatar}
                      alt={client.name}
                    />
                  </div>
                  <div className={styles["client-info__details"]}>
                    <p>{client.name}</p>
                    <p>{client.lastActive}</p>
                    <p>{client.clientSince}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={styles["card__training-info"]}>
                  <p>
                    Workouts: <span>{client.workouts}</span>
                  </p>
                  <p>
                    Compliance:{" "}
                    <span
                      className={styles[colorCodeText(client.complianceRate)]}
                    >
                      {client.complianceRate}%
                    </span>
                  </p>
                  <p>
                    Plan: <span>{client.currentPlan}</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <a href="/">View</a>
              </CardFooter>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
