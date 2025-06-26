import styles from "./CreateExercisePage.module.css";
import { Modal } from "../../components//modal/Modal.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { useEffect, useState } from "react";
import { Button } from "../../components/button/Button.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { BODYPARTS, MOVEMENTS } from "../../data/workoutFilterOptions.js";
import { MUSCLE_GROUPS } from "../../data/muscleGroups.js";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/api.js";

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

  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    id && getSingleExercise(id);
  }, []);

  // function getEmbedUrl(youtubeUrl) {
  //   const match = youtubeUrl.match(
  //     /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
  //   );
  //   if (match && match[1]) {
  //     return `https://www.youtube.com/embed/${match[1]}`;
  //   }
  //   return null;
  // }

  async function getSingleExercise(id) {
    try {
      const { data } = await axios.get(`${API_ENDPOINTS.exercises}/${id}`, {
        headers: { "novi-education-project-id": import.meta.env.VITE_API_KEY },
      });

      setFormData({
        exerciseName: data.name,
        bodypart: data.bodypart,
        movement: data.movement,
        videoUrl: data.videoURL,
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
      console.log(response.data);
      setShowSnackbar({
        open: true,
        message: `Exercise ${formData.exerciseName} has been edited`,
        status: "success",
      });
    } catch (error) {
      console.error(`Error in edit exercise catch: ${error}`);
      setShowSnackbar({
        open: true,
        message: "Failed to edit exercise.",
        status: "warning",
      });
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

      console.log(response.data);
      setShowSnackbar({
        open: true,
        message: `Exercise ${formData.exerciseName} has been added`,
        status: "success",
      });

      setFormData({
        exerciseName: "",
        bodypart: "",
        movement: "",
        primaryMuscle: "",
        instructions: "",
        videoUrl: "",
      });
    } catch (error) {
      console.log(error);
      setShowSnackbar({
        open: true,
        message: "Failed to add exercise",
        status: "warning",
      });
    }
  }

  async function checkIfDuplicate(exerciseName) {
    try {
      const { data } = await axios.get(API_ENDPOINTS.exercises, {
        headers: { "novi-education-project-id": import.meta.env.VITE_API_KEY },
      });

      return data.some((exercise) => {
        return (
          exerciseName.toLowerCase().trim() ===
          exercise.name.toLowerCase().trim()
        );
      });
    } catch (error) {
      console.error("Error in catch from getAllExercises");
      console.log(error);
    }
  }

  function handleChange(e) {
    let value = e.target.value;
    let name = e.target.name;

    setFormData((previous) => {
      return { ...previous, [name]: value };
    });
  }

  async function handleSubmit(e, id, exerciseName) {
    e.preventDefault();

    if (id) {
      await editExercise(id);
    } else {
      if (await checkIfDuplicate(exerciseName)) {
        setShowSnackbar({
          open: true,
          message: "Exercise already exists",
          status: "error",
        });
      } else {
        await addExercise();
      }
    }
  }

  return (
    <div className={styles["create-exercise__container"]}>
      {showSnackbar.open && (
        <Snackbar
          message={showSnackbar.message}
          open={showSnackbar.open}
          status={showSnackbar.status}
          durationVisible={3000}
          onClose={() => setShowSnackbar(false)}
        />
      )}
      <Modal title={id ? "Update Exercise" : "Create New Exercise"}>
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
              buttonType={id ? "secondary" : "primary"}
              buttonSize="medium"
              label={id ? "Save changes" : "Create exercise"}
              type="submit"
              handleClick={(e) => handleSubmit(e, id, formData.exerciseName)}
            />
          </form>
        </div>
      </Modal>
    </div>
  );
}
