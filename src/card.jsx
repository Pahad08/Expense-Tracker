import { memo } from "react";

function Card(props) {
  return (
    <>
      <div className="card-container" id={props.id}>
        <p className="card-title">
          {props.title}:{props.amount}
        </p>
      </div>
    </>
  );
}

export default memo(Card);
