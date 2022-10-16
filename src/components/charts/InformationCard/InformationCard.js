import SpinnerComponent from "../../../shared/component/spinner/spinner.component";

const InformationCard = (props) => {
  return (
    <div className="card pt-3 dashboard-box-shadow pl-3">
      {props.isLoading ? (
        <SpinnerComponent />
      ) : (
        <>
          <p className="dashboard-card-header">
            {props.title}
          </p>
          <p className="dashboard-card-value">
            {props.data}
          </p>
          <p className="dashboard-card-month">
            <span className={props.valueColor}>
              {props.value}
            </span>{' '}
            {props.desc}
          </p>
        </>
      )}
    </div>
  );
};

export default InformationCard;
