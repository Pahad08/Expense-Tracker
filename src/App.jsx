import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./route";

function App() {
  return (
    <>
      <Router>
        <AppRouter></AppRouter>
      </Router>
    </>
  );
}

export default App;
