import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddBudget() {
  const [budget, handleBudget] = useState({ budget: "budget", amount: 0 });

  return (
    <>
      <div className="title">
        <p className="title-text" draggable="false">
          Add Budget
        </p>
      </div>

      <div className="router">
        <Link to="/" className="link">
          Go Back
        </Link>
      </div>

      <form className="budget-form">
        <div className="input-container">
          <input
            type="number"
            id="expense-name"
            placeholder="Expense Name"
            onChange={(e) => {
              const currBudget = JSON.parse(localStorage.getItem("budget"));

              if (currBudget) {
                handleBudget((budget) => {
                  return {
                    ...budget,
                    budget: "budget",
                    amount: parseFloat(e.target.value) + currBudget.amount,
                  };
                });
              } else {
                handleBudget((budget) => {
                  return {
                    ...budget,
                    budget: "budget",
                    amount: parseFloat(e.target.value),
                  };
                });
              }
            }}
          />
          <label htmlFor="expense-name" id="expense-label">
            Expense Name
          </label>
        </div>

        <button
          className="add-btn"
          onClick={(e) => {
            e.preventDefault();
            if (budget.amount == 0 || budget.amount == null) {
              Swal.fire({
                title: "Empty Amount!",
                text: "Enter an amount",
                icon: "info",
              });

              return;
            }

            localStorage.setItem("budget", JSON.stringify(budget));

            Swal.fire({
              title: "Budget Added!",
              icon: "success",
            });
          }}
        >
          Add
        </button>
      </form>
    </>
  );
}
