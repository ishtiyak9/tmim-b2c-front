const ValidateMessageComponent = ({ message }) => {
  return (
    <div className="d-flex mt-2">
      <i className="fa fa-exclamation-triangle mr-1 mt-1 text-danger"></i>
      <p className="text-danger">{message}</p>
    </div>
  );
};

export default ValidateMessageComponent;
