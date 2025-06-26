import styles from "./CreateExercisePage.module.css";
import { Modal } from "../../components//modal/Modal.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { useEffect, useState } from "react";
import { Button } from "../../components/button/Button.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { BODYPARTS } from "../../data/workoutFilterOptions.js";
import { MOVEMENTS } from "../../data/workoutFilterOptions.js";
import { MUSCLE_GROUPS } from "../../data/muscleGroups.js";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/api.js";
import { getLabelForUi } from "../../utils/getLabelForUi.js";

export function CreateExercisePage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    exerciseName: "",
    bodypart: "",
    movement: "",
    primaryMuscle: "",
    instructions: "",
    videoUrl: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    id && getSingleExercise(id);
  }, []);

  function getEmbedUrl(youtubeUrl) {
    const match = youtubeUrl.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    );
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  }

  async function getSingleExercise(id) {
    try {
      const { data } = await axios.get(`${API_ENDPOINTS.exercises}/${id}`, {
        headers: { "novi-education-project-id": import.meta.env.VITE_API_KEY },
      });

      console.log(data.movement.toLowerCase().trim());

      setFormData({
        exerciseName: data.name,
        bodypart: data.bodypart.toLowerCase().trim(),
        movement: data.movement.toLowerCase().trim(),
        videoUrl: data.videoURL.toLowerCase().trim(),
        primaryMuscle: data.primaryMuscle,
        instructions: data.instructions,
      });
    } catch (error) {
      console.error(`Error in get single exercise catch: ${error}`);
    }
  }

  async function editExercise(id) {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.exercises}/${id}`,
        {
          id: id,
          name: formData.exerciseName,
          bodypart: formData.bodypart,
          movement: formData.movement,
          primaryMuscle: formData.primaryMuscle,
          instructions: formData.instructions,
          videoURL: formData.videoUrl,
        },
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("log from EDIT exercise:");
      console.log(response.data);
    } catch (error) {
      console.error(`Error in edit exercise catch: ${error}`);
    }
  }

  async function addExercise() {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.exercises}`,
        {
          name: formData.exerciseName,
          bodypart: formData.bodypart,
          movement: formData.movement,
          primaryMuscle: formData.primaryMuscle,
          instructions: formData.instructions,
          videoURL: formData.videoUrl,
        },
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        },
      );

      console.log("log from ADD exercise:");
      console.log(response.data);
    } catch (error) {
      console.log("Add exercise error message");
      console.log(error);
    }
  }

  function handleChange(e) {
    let value = e.target.value;
    let name = e.target.name;

    console.log(value);

    setFormData((previous) => {
      return { ...previous, [name]: value };
    });
  }

  async function handleSubmit(e, id) {
    e.preventDefault();
    setShowSnackbar(true);

    if (id) {
      await editExercise(id);
    } else {
      await addExercise();
    }
    setShowSnackbar(true);
  }

  return (
    <div className={styles["create-exercise__container"]}>
      {showSnackbar && (
        <Snackbar
          message="Exercise already in exercise library"
          open={showSnackbar}
          status="warning"
          durationVisible={3000}
          onClose={() => setShowSnackbar(false)}
        />
      )}
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
                id="primaryMuscle"
                name="primaryMuscle"
                label="Primary muscle"
                options={MUSCLE_GROUPS}
                title="Select primary muscle"
                required={true}
                // button={true}
                // onButtonClick={onAddMuscleClick}
                buttonLabel="Add"
                value={formData.primaryMuscle}
                handleChange={handleChange}
              />
            </InputWrapper>
            <InputWrapper direction="column">
              <textarea
                name="instructions"
                id="instructions"
                placeholder="Exercise instructions"
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
            <Button
              buttonType="primary"
              buttonSize="medium"
              label="Save exercise"
              type="submit"
              handleClick={handleSubmit}
            />
          </form>
          {/*<div className={styles["container__selected-items"]}>*/}
          {/*  <p>Selected Muscles</p>*/}
          {/*  <ul className={styles["selected-muscles__list"]}>*/}
          {/*    {formData.primaryMuscle.map((muscle) => {*/}
          {/*      console.log();*/}
          {/*      return (*/}
          {/*        <li key={muscle}>*/}
          {/*          <FontAwesomeIcon icon={faXmark} />*/}
          {/*          {muscle}*/}
          {/*        </li>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*  </ul>*/}
          {/*  {formData.videoUrl && (*/}
          {/*    <>*/}
          {/*      <p>Video Preview</p>*/}
          {/*      <iframe*/}
          {/*        className={styles["create-exercise__iframe"]}*/}
          {/*        src={getEmbedUrl(formData.videoUrl)}*/}
          {/*        title="Exercise demo video"*/}
          {/*        frameBorder="0"*/}
          {/*        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"*/}
          {/*      />*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>
      </Modal>
    </div>
  );
}
