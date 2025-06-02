// CSS
import "./App.css";

// Images
import sweatDaddyHeroImage from "./assets/sweat-daddy-hero-image.png";

// Pages
import { Signup } from "./pages/signup/Signup.jsx";
import { Dashboard } from "./pages/dashboard/Dashboard.jsx";
import { Clients } from "./pages/clients/Clients.jsx";
import { Workouts } from "./pages/workouts/Workouts.jsx";

// Layout Component
import { Layout } from "./layouts/Layout.jsx";

function App() {
  return (
    <>
      <Layout>
        {/*<Signup image={sweatDaddyHeroImage} />*/}
        {/*<Dashboard />*/}
        {/*<Clients />*/}
        <Workouts />
      </Layout>
    </>
  );
}

export default App;
