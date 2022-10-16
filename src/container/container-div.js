import Footer from "./Footer";

const ContainerDiv = (props) => {
  return (
    <>
      <div className="content-top-margin mb-5">
      {/* <div className="mb-5"> */}
        <div className="c-app">
          <div className="c-wrapper c-fixed-component">
            {props.children}
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default ContainerDiv;
