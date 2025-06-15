import styles from "./Dashboard.module.css";
import jimmy from "../../assets/jimmy-profile-picture.png";
import molly from "../../assets/molly-profile-picture.png";
import hank from "../../assets/hank-profile-picture.png";
import brion from "../../assets/benching-brion-profile-picture.png";

import {
  faChartLine,
  faHandshake,
  faHeart,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DashboardCard } from "../../components/dashboardCard/DashboardCard.jsx";
import { ListControls } from "../../components/listControls/ListControls.jsx";
import { useState } from "react";
import { ClientWorkoutStatusCard } from "../../components/clientWorkoutStatusCard/ClientWorkoutStatusCard.jsx";
import { Link } from "react-router-dom";
import { SmallCardDashContent } from "../../components/smallCardDashContent/SmallCardDashContent.jsx";
import { CLIENT_MILESTONES, UPCOMING_SESSIONS } from "../../data/clientData.js";
import { getDateTime, getDay } from "../../utils/getDateTime.js";

export function Dashboard() {
  const [toggleCaretWorkout, setToggleCaretWorkout] = useState(true);
  const [toggleCaretAdherence, setToggleCaretAdherence] = useState(true);

  // Deze functie geeft een object terug waarvan de keys de datums zijn en de values de sessions
  // die bij die datum horen
  function reduceSessionsData(sessions) {
    // De acc (accumulator) is een object die wordt gevuld met zelf gekozen waardes.
    // In dit geval beginnen we op 0.
    return sessions.reduce((acc, session) => {
      // we maken een key aan voor het object, in dit geval een datum. Deze maken we met de helper getDay functie
      const dateObjectKey = getDay(session.startTime);

      // Check of er wel een truthy/true value in de startTime zit
      if (session.startTime) {
        // Als er nog geen dateObjectKey is gemaakt op die specifieke accumulator waarde, maak dan een lege array
        if (!acc[dateObjectKey]) {
          acc[dateObjectKey] = [];
        }
        // Push vervolgens de session (currentValue) in die array.
        acc[dateObjectKey].push(session);
      } else {
        // toon een console warning als er een false of falsey waarde uit de parent if statement komt
        console.warn("Wrong startTime");
      }

      // Geef de aangepaste versie van het acc object terug zodat die de volgende iteratie van de reduce
      // weer aangepast kan worden. Is voor het tussenresultaat.
      return acc;
    }, {});
  }

  function handleCaretClick(title) {
    if (title.toLowerCase().includes("attention")) {
      setToggleCaretAdherence(!toggleCaretAdherence);
    } else {
      setToggleCaretWorkout(!toggleCaretWorkout);
    }
  }
  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["card-one"]}>
        <DashboardCard
          title="Workouts"
          flexDirection="direction-column"
          icon={faChartLine}
        >
          <SmallCardDashContent
            labelOne="Last week: "
            labelOneNumber={8}
            labelOnePercent="+25%"
            labelTwo="This year: "
            labelTwoNumber={256}
            labelTwoPercent={"+15%"}
          />
        </DashboardCard>
      </div>

      <div className={styles["card-two"]}>
        <DashboardCard
          title="Adherence"
          flexDirection="direction-column"
          icon={faHandshake}
        >
          <SmallCardDashContent
            labelOne="Last 30 days: "
            labelOneNumber={78}
            labelOnePercent="+4%"
            labelTwo="Average score: "
            labelTwoNumber={62}
            labelTwoPercent={""}
          />
        </DashboardCard>
      </div>
      <div className={styles["card-three"]}>
        <DashboardCard
          title="Wellbeing"
          flexDirection="direction-column"
          icon={faHeart}
        >
          <SmallCardDashContent
            labelOne="Last 30 days: "
            labelOneNumber={15}
            labelOnePercent="+5%"
            labelTwo="Average score: "
            labelTwoNumber={"74"}
            labelTwoPercent={""}
          />
        </DashboardCard>
      </div>

      <div className={styles["main-content"]}>
        <div className={styles["upcoming-sessions-content"]}>
          <DashboardCard
            title="Upcoming Sessions"
            flexDirection="direction-column"
          >
            <hr />
            {/* Object entries geeft een array terug van de key value pairs (de datum string en een array met sessions).
            Hier kunnen we met .map overheen loopen. We maken middels destructuring variabelen van de array
            items date en sessions. Had ook zo gekund: const date = entry[0], const sessions = entry[1]
            Omdat sessions in dit geval ook een array is kunnen we daar weer over loopen om te renderen.
             */}
            {Object.entries(reduceSessionsData(UPCOMING_SESSIONS)).map(
              ([date, sessions]) => {
                return (
                  <div key={date}>
                    <p>{date}</p>

                    <ul>
                      {sessions.map((session) => {
                        const date = getDateTime(
                          session.startTime,
                          session.endTime,
                        );
                        return (
                          <li key={session.id}>
                            <p>
                              {session.name} - {session.sessionType} -
                            </p>
                            <p>
                              {date.start} - {date.end}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              },
            )}
          </DashboardCard>
        </div>
      </div>
      <div className={styles["milestones-content"]}>
        <DashboardCard title="Milestones" flexDirection="direction-column">
          <hr />

          <ul className={styles["milestones__container"]}>
            {CLIENT_MILESTONES.map((client) => {
              return (
                <li key={client.id} className={styles["container__list-item"]}>
                  <div className={styles["list-item__top-content"]}>
                    <p>{client.date}</p>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className={styles["list-item__bottom-content"]}>
                    <p>{client.name}</p>
                    <>
                      <p className={styles["bottom-content__milestone"]}>
                        {client.milestone}
                      </p>
                    </>
                  </div>
                </li>
              );
            })}
          </ul>
        </DashboardCard>
      </div>
      <div className={styles["side-content"]}>
        <DashboardCard
          title="Client Information"
          flexDirection="direction-column"
        >
          <div className={styles["side-content__information-container"]}>
            <hr />
            <ListControls
              title="Today's workouts"
              value={3}
              isOpen={toggleCaretWorkout}
              handleClick={handleCaretClick}
            />
            {toggleCaretWorkout ? (
              <ul className={styles["information-container__client-list"]}>
                <ClientWorkoutStatusCard
                  clientName="Jimmy the Slimmy"
                  workoutName="Strength Workout A"
                  clientImage={jimmy}
                  workoutFinished={true}
                />
                <ClientWorkoutStatusCard
                  clientName="Marathon Molly"
                  workoutName="Hybrid Conditioning"
                  clientImage={molly}
                  workoutFinished={false}
                />
                <ClientWorkoutStatusCard
                  clientName="Benching Brion"
                  workoutName="Powerlifting Taper"
                  clientImage={brion}
                  workoutFinished={false}
                />
              </ul>
            ) : (
              <p>Don't forget to schedule workouts</p>
            )}
            <ListControls
              title="Needs attention"
              value={2}
              isOpen={toggleCaretAdherence}
              handleClick={handleCaretClick}
            />
            {toggleCaretAdherence && (
              <ul className={styles["information-container__client-list"]}>
                <ClientWorkoutStatusCard
                  clientName="Hank the Tank"
                  adherenceInfo="30 day adherence dropped"
                  clientImage={hank}
                  adherence="75%"
                />
                <ClientWorkoutStatusCard
                  clientName="Marathon Molly"
                  adherenceInfo="30 day adherence dropped"
                  clientImage={molly}
                  workoutFinished={false}
                  adherence="33%"
                />
              </ul>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
