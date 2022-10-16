import "./button.component.css";

const ButtonComponent = (props) => {
  let buttonClass;
  if (props.outline === "yes") {
    buttonClass = "custom-btn-outline tmm-btn-outline";
  } else {
    buttonClass = "custom-btn tmm-btn";
  }
  return (
    <button className={buttonClass + " tmm-btn-text " + props.buttonWidthClass} onClick={props.click} >{props.text}</button>
    // <button className="custom-btn-outline tmm-btn-outline tmm-btn-text" onClick={() => declineEvent()}>Decline</button>
  );
};

export default ButtonComponent;
