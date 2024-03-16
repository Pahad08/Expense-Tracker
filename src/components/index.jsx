import { useState, useReducer, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Card from "../card";
import Swal from "sweetalert2";

const reducer = (
  state,
  { action, name, amount, object, budget, index, myExpense }
) => {
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

      const tempExpense = parseFloat(amount) + parseFloat(myExpense);

      localStorage.setItem(
        "total_expense",
        JSON.stringify({ amount: tempExpense })
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
    default:
      return [];
  }
};

export default function Index() {
  const [expenses, dispatch] = useReducer(reducer, []);
  const [expenseName, handleExpenseName] = useState("");
  const [amount, handleAmount] = useState(0);
  const [budget, handleBudget] = useState(0);
  const [myExpense, handleExpense] = useState({ amount: 0 });
  const btn = useRef();

  useEffect(() => {
    const newBudget = JSON.parse(localStorage.getItem("budget"))
      ? JSON.parse(localStorage.getItem("budget")).amount
      : 0;
    handleBudget(newBudget);

    const newExpense = JSON.parse(localStorage.getItem("total_expense"))
      ? JSON.parse(localStorage.getItem("total_expense")).amount
      : 0;

    handleExpense((myExpense) => {
      return {
        ...myExpense,
        amount: newExpense,
      };
    });
  }, [expenses]);

  useEffect(() => {
    const pushLocalStorageData = () => {
      for (let index = 0; index < localStorage.length; index++) {
        const object = JSON.parse(
          localStorage.getItem(localStorage.key(index))
        );

        const objKey = localStorage.key(index);

        if (objKey !== "budget" && objKey !== "total_expense") {
          dispatch({ action: "addList", object: object });
        }
      }
    };

    pushLocalStorageData();
  }, []);

  useEffect(() => {
    const clear = () => {
      localStorage.clear();
      dispatch({});
      console.log("clciked");
    };

    btn.current.addEventListener("click", clear);

    return () => {
      btn.current.removeEventListener("click", clear);
    };
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
              myExpense: myExpense.amount,
            });
          }}
        >
          Add
        </button>
      </form>

      <div className="cards">
        <Card id="budget" title="Budget" amount={budget} />
        <Card id="expenses" title="Total Expenses" amount={myExpense.amount} />
        <button className="clear" ref={btn}>
          Clear
        </button>
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
