import styles from "./Dashboard.module.css";
import jimmy from "../../assets/jimmy-profile-picture.png";
import molly from "../../assets/molly-profile-picture.png";
import hank from "../../assets/hank-profile-picture.png";
import brion from "../../assets/benching-brion-profile-picture.png";

import {
  faChartLine,
  faHandshake,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DashboardCard } from "../../components/dashboardCard/DashboardCard.jsx";
import { ListControls } from "../../components/listControls/ListControls.jsx";
import { useState } from "react";
import { ClientWorkoutStatusCard } from "../../components/clientWorkoutStatusCard/ClientWorkoutStatusCard.jsx";
import { Link } from "react-router-dom";
import { SmallCardDashContent } from "../../components/smallCardDashContent/SmallCardDashContent.jsx";

export function Dashboard() {
  const [toggleCaretWorkout, setToggleCaretWorkout] = useState(true);
  const [toggleCaretAdherence, setToggleCaretAdherence] = useState(true);

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

      <div className={styles["main-content"]}>main content</div>
      <div className={styles["side-content"]}>
        <DashboardCard
          title="Client information"
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
