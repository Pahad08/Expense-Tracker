import { Route, Routes } from "react-router-dom";
import Index from "./components/index";
import AddBudget from "./components/addbudget";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/addbudget" element={<AddBudget />} />
    </Routes>
  );
};

export default AppRouter;
