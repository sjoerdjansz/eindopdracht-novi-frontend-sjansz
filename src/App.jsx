// CSS
import "./App.css";

// Images
import sweatDaddyHeroImage from "./assets/sweat-daddy-hero-image.png";

// Pages
import { Signup } from "./pages/signup/Signup.jsx";

function App() {
  return (
    <>
      <Signup image={sweatDaddyHeroImage} />
    </>
  );
}

export default App;
