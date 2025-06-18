import styles from "./ClientProfile.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Card } from "../../components/card/Card.jsx";
import { Button } from "../../components/button/Button.jsx";
import { CardHeader } from "../../components/card/CardHeader.jsx";
import { CardContent } from "../../components/card/CardContent.jsx";
import { CardFooter } from "../../components/card/CardFooter.jsx";

import { CLIENTS } from "../../data/clientData.js";

export function ClientProfile() {
  // const navigate = useNavigate();
  const { id } = useParams();

  const getUser = CLIENTS.find((client) => {
    const name = client.name.toLowerCase().split(" ");
    return name.includes(id.toLowerCase());
  });

  return (
    <div className={styles["profile-container"]}>
      <h1>Client – {getUser.name}</h1>
      <section className={styles["client-cards-container"]}>
        <Card variant="vertical">
          <div className={styles["inner-cards-container"]}>
            <CardHeader>
              <div className={styles["profile-avatar-wrapper"]}>
                <img
                  className={styles["profile-avatar"]}
                  src={getUser.avatar}
                  alt={`Profile picture of ${getUser.name}`}
                />
              </div>
            </CardHeader>
            <CardContent>Content</CardContent>
            <CardFooter>Footer</CardFooter>
          </div>
        </Card>
        <Card>
          <div className={styles["inner-cards-container"]}></div>
        </Card>
      </section>
      <footer className={styles["profile__footer-controls"]}>
        <Link to={""}>Delete account</Link>
        <Button
          buttonType="primary"
          buttonSize="large"
          type="button"
          label="Save Changes"
        />
      </footer>
    </div>
  );
}
