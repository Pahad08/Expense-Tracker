import { useState, useRef, useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../card";
import Swal from "sweetalert2";

const reducer = (state, { action, name, amount, object, budget, index }) => {
  switch (action) {
    case "add":
      if (budget == 0 || amount > budget) {
        Swal.fire({
          title: "No Budget!",
          text: "Add an Amount",
          icon: "error",
        });

        return state;
      }

      if (name == "" || amount == "") {
        Swal.fire({
          title: "Empty Inputs!",
          text: "Enter an input",
          icon: "info",
        });
        return state;
      }

      const currBudget = JSON.parse(localStorage.getItem("budget")).amount;

      localStorage.setItem(
        "budget",
        JSON.stringify({ budget: "budget", amount: currBudget - amount })
      );

      localStorage.setItem(
        name,
        JSON.stringify({ name: name, amount: amount })
      );

      Swal.fire({
        title: "Added Expense!",
        icon: "success",
      });

      return [{ name: name, amount: amount }, ...state];

    case "addList":
      return [...state, object];

    case "delete":
      localStorage.removeItem(name);

      state = state.filter((_, i) => {
        return i !== index;
      });

      return state;
  }
};

export default function Index() {
  const [expenses, dispatch] = useReducer(reducer, []);
  const [expenseName, handleExpenseName] = useState("");
  const [amount, handleAmount] = useState(0);
  const [budget, handleBudget] = useState(0);
  const [expense, handleExpense] = useState(0);

  useEffect(() => {
    const newBudget = JSON.parse(localStorage.getItem("budget"))
      ? JSON.parse(localStorage.getItem("budget")).amount
      : 0;
    handleBudget(newBudget);
  }, [expenses]);

  useEffect(() => {
    const pushLocalStorageData = () => {
      for (let index = 0; index < localStorage.length; index++) {
        const object = JSON.parse(
          localStorage.getItem(localStorage.key(index))
        );

        if (!object.budget) {
          dispatch({ action: "addList", object: object });
        }
      }
    };

    pushLocalStorageData();
  }, []);

  return (
    <>
      <div className="title">
        <p className="title-text" draggable="false">
          Expense Tracker
        </p>
      </div>

      <div className="router">
        <Link to="/addbudget">Add Budget</Link>
      </div>

      <form className="expense-form">
        <div className="input-container">
          <input
            type="text"
            id="expense-name"
            placeholder="Expense Name"
            onChange={(e) => {
              handleExpenseName(e.target.value);
            }}
          />
          <label htmlFor="expense-name" id="expense-label">
            Expense Name
          </label>
        </div>

        <div className="input-container">
          <input
            type="number"
            id="expense-amount"
            placeholder="Amount"
            onChange={(e) => {
              handleAmount(e.target.value);
            }}
          />
          <label htmlFor="expense-amount" id="amount-label">
            Amount
          </label>
        </div>

        <button
          className="add-btn"
          onClick={(e) => {
            e.preventDefault();
            dispatch({
              action: "add",
              name: expenseName,
              amount: amount,
              budget: budget,
            });
          }}
        >
          Add
        </button>
      </form>

      <div className="cards">
        <Card id="budget" title="Budget" amount={budget} />
        <Card id="balance" title="Balance" amount={500} />
        <Card id="expenses" title="Total Expenses" amount={500} />
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Expense Name</th>
            <th>Amount</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((element, index) => {
            return (
              <tr key={index}>
                <td>{element.name}</td>
                <td>{element.amount}</td>
                <td className="delete-btn">
                  <button
                    onClick={() => {
                      dispatch({
                        action: "delete",
                        name: element.name,
                        index: index,
                      });
                    }}
                  >
                    Delete
                  </button>
                </td>
                <td className="edit-btn">
                  <button>Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
