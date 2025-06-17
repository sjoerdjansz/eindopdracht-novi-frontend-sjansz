import styles from "./CreateExercisePage.module.css";
import { Modal } from "../../components//modal/Modal.jsx";
import { Link } from "react-router-dom";
import { InputField } from "../../components/inputField/InputField.jsx";
import { useState } from "react";
import { Button } from "../../components/button/Button.jsx";

export function CreateExercisePage() {
  const [formData, setFormData] = useState({
    exerciseName: "",
    bodypart: "",
    movement: "",
    muscles: "",
    videoUrl: "",
  });

  function getEmbedUrl(youtubeUrl) {
    const match = youtubeUrl.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    );
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  }

  function handleChange(e) {
    let value = e.target.value;
    let name = e.target.name;

    setFormData((previous) => {
      return { ...previous, [name]: value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <div className={styles["create-exercise__container"]}>
      <Modal title="Create Exercise">
        <form className={styles["create-exercise-form"]}>
          <div className={styles["form__wrapper"]}>
            <InputField
              label="Exercise name"
              name="exerciseName"
              id="exerciseName"
              type="text"
              value={formData.exerciseName}
              handleChange={handleChange}
            />
          </div>
          <div className={styles["form__wrapper"]}>
            <InputField
              label="Bodypart"
              name="bodypart"
              id="bodypart"
              type="text"
              value={formData.bodypart}
              handleChange={handleChange}
            />
          </div>
          <div className={styles["form__wrapper"]}>
            <InputField
              label="Movement"
              name="movement"
              id="movement"
              type="text"
              value={formData.movement}
              handleChange={handleChange}
            />
          </div>
          <div className={styles["form__wrapper"]}>
            <InputField
              label="Video URL"
              name="videoUrl"
              id="videoUrl"
              type="text"
              value={formData.videoUrl}
              handleChange={handleChange}
            />
          </div>
          <div className={styles["form__wrapper"]}>
            <Button
              buttonType="primary"
              buttonSize="medium"
              label="Save exercise"
              type="submit"
              handleClick={handleSubmit}
            />
          </div>
          {formData.videoUrl && (
            <iframe
              src={getEmbedUrl(formData.videoUrl)}
              title="Exercise demo video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </form>
      </Modal>
    </div>
  );
}
