import styles from "./CreateExercisePage.module.css";
import { Modal } from "../../components//modal/Modal.jsx";
import { Link } from "react-router-dom";
import { InputField } from "../../components/inputField/InputField.jsx";
import { useState } from "react";
import { Button } from "../../components/button/Button.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { BODYPARTS } from "../../data/workoutFilterOptions.js";
import { MOVEMENTS } from "../../data/workoutFilterOptions.js";
import { MUSCLE_GROUPS } from "../../data/muscleGroups.js";

export function CreateExercisePage() {
  const [formData, setFormData] = useState({
    exerciseName: "",
    bodypart: "",
    movement: "",
    muscles: [],
    instructions: "",
    videoUrl: "",
  });

  const [selectedMuscle, setSelectedMuscle] = useState("");

  function getEmbedUrl(youtubeUrl) {
    const match = youtubeUrl.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    );
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  }

  // TODO: De select field en bijbehorende functies beter leren begrijpen. Is complex.
  //  En uitvogelen of de multi select niet handiger is.
  function onAddMuscleClick() {
    if (selectedMuscle && !formData.muscles.includes(selectedMuscle)) {
      setFormData((prev) => ({
        ...prev,
        muscles: [...prev.muscles, selectedMuscle],
      }));
      setSelectedMuscle([]);
    }
  }

  function handleChange(e) {
    let value = e.target.value;
    let name = e.target.name;

    if (name === "muscles") {
      setSelectedMuscle(value);
    } else {
      setFormData((previous) => {
        return { ...previous, [name]: value };
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <div className={styles["create-exercise__container"]}>
      <Modal title="Create Exercise">
        <div className={styles["container__layout"]}>
          <form className={styles["create-exercise-form"]}>
            <InputWrapper direction="column">
              <InputField
                label="Exercise name"
                name="exerciseName"
                id="exerciseName"
                type="text"
                value={formData.exerciseName}
                handleChange={handleChange}
                required={true}
              />
            </InputWrapper>
            <InputWrapper direction="column">
              <SelectField
                id="bodypart"
                name="bodypart"
                label="Bodypart"
                options={BODYPARTS}
                title="Select bodypart"
                required={true}
                value={formData.bodypart}
                handleChange={handleChange}
              />
            </InputWrapper>
            <InputWrapper direction="column">
              <SelectField
                id="movement"
                name="movement"
                label="Movement"
                options={MOVEMENTS}
                title="Select movement"
                required={true}
                value={formData.movement}
                handleChange={handleChange}
              />
            </InputWrapper>
            <InputWrapper direction="column">
              <SelectField
                id="muscles"
                name="muscles"
                label="Primary muscles"
                options={MUSCLE_GROUPS}
                title="Select primary muscles"
                required={true}
                button={true}
                onAddMuscleClick={onAddMuscleClick}
                buttonLabel="Add"
                value={selectedMuscle}
                handleChange={(e) => setSelectedMuscle(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper direction="column">
              <textarea
                name="instructions"
                id="instructions"
                cols="20"
                rows="4"
                value={formData.instructions}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></textarea>
            </InputWrapper>
            <InputWrapper direction="column">
              <InputField
                label="Video URL"
                name="videoUrl"
                id="videoUrl"
                type="text"
                value={formData.videoUrl}
                handleChange={handleChange}
              />
            </InputWrapper>
            <InputWrapper width="medium">
              <Button
                buttonType="primary"
                buttonSize="medium"
                label="Save exercise"
                type="submit"
                handleClick={handleSubmit}
              />
            </InputWrapper>
          </form>
          <div className={styles["container__selected-items"]}>
            <p>Selected Muscles</p>
            <ul className={styles["selected-muscles__list"]}>
              {formData.muscles.map((muscle) => {
                return (
                  <li key={muscle}>
                    <FontAwesomeIcon icon={faXmark} />
                    {muscle}
                  </li>
                );
              })}
            </ul>
            {formData.videoUrl && (
              <>
                <p>Video Preview</p>
                <iframe
                  className={styles["create-exercise__iframe"]}
                  src={getEmbedUrl(formData.videoUrl)}
                  title="Exercise demo video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
