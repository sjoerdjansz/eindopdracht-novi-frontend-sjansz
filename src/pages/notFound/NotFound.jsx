import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/button/Button.jsx";

export function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Looks like you flexed the wrong muscle...</h1>
      <p>
        Url path:{" "}
        <code style={{ color: "hsl(342 92 56)" }}>{location.pathname}</code>{" "}
        doesn't exist (404)
      </p>
      <Button
        buttonType="secondary"
        buttonSize="small"
        type="button"
        label="Back to Dashboard"
        handleClick={() => navigate("/")}
      />
    </div>
  );
}
