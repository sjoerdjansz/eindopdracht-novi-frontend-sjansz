// CSS
import "./App.css";

// Images
import sweatDaddyHeroImage from "./assets/sweat-daddy-hero-image.png";

// Pages
import { Signup } from "./pages/signup/Signup.jsx";
import { Dashboard } from "./pages/dashboard/Dashboard.jsx";

// Layout Component
import { Layout } from "./layouts/Layout.jsx";

function App() {
  return (
    <>
      <Layout>
        {/*<Signup image={sweatDaddyHeroImage} />*/}
        <Dashboard />
      </Layout>
    </>
  );
}

export default App;
