import { memo } from "react";

function Input({
  type,
  inputId,
  placeholder,
  label,
  labelId,
  labelName,
  functionHandle,
}) {
  return (
    <>
      <input
        type={type}
        id={inputId}
        placeholder={placeholder}
        onChange={(e) => functionHandle(e.target.value)}
      />
      <label htmlFor={label} id={labelId}>
        {labelName}
      </label>
    </>
  );
}

export default memo(Input);
