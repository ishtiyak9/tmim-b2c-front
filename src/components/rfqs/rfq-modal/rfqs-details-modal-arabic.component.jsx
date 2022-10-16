import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";



import "./modal.css";
import "../css/rfqs.css";


function RFQsDetailsModalArabicComponent() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="content-top-margin">
      <div className="c-app">
        <div className="c-wrapper c-fixed-component">
          <>
            <Button variant="primary" onClick={() => setShow(true)}>
              Custom Width Modal
            </Button>

            <Modal show={show} onHide={() => setShow(false)} centered="true">
              <Modal.Header closeButton>
                <Modal.Title>
                  <div>
                    <h3>Details view of RFQ #005887</h3>
                    <h6 className="text-muted ">Dec 2, 2020 | Time: 9:42PM</h6>
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-text">
                  {/* <div>
                    <h2>Details view of RFQ #005887</h2>
                    <p className="text-muted">Dec 2, 2020 | Time: 9:42PM</p>
                  </div> */}
                  <div>
                    <i className="fa fa-hashtag mr-3" aria-hidden="true"></i>
                    <p className="d-inline">
                      <span className="rfq-details-text">RFQ ID: </span>#005887
                    </p>
                  </div>
                  <div className="pb-2">
                    <i className="fa fa-user-o mr-3" aria-hidden="true"></i>
                    <p className="d-inline">
                      <span className="rfq-details-text">Name: </span>Esther
                      Howard
                    </p>
                  </div>
                  <div className="pb-2">
                    <i className="fa fa-envelope-o mr-3" aria-hidden="true"></i>
                    <p className="d-inline">
                      <span className="rfq-details-text">Email: </span>
                      alma.lawson@example.com
                    </p>
                  </div>
                  <div className="pb-2">
                    <i className="fa fa-phone mr-3" aria-hidden="true"></i>
                    <p className="d-inline">
                      <span className="rfq-details-text">Phone Number: </span>{" "}
                      (505) 555-0125
                    </p>
                  </div>
                  <div className="pb-2">
                    <i className="fa fa-calendar mr-3" aria-hidden="true"></i>
                    <p className="d-inline">
                      <span className="rfq-details-text">Occasion Date: </span>
                      January 22, 2021
                    </p>
                  </div>
                  <div className="pb-2">
                    <i className="fa fa-clock-o mr-3" aria-hidden="true"></i>
                    <p className="d-inline">
                      <span className="rfq-details-text">Occasion Time: </span>
                      10 AM - 5 PM
                    </p>
                  </div>
                  <div>
                    <i
                      className="fa fa-volume-control-phone mr-3"
                      aria-hidden="true"
                    ></i>
                    <p className="d-inline">
                      <span className="rfq-details-text">Contact Method: </span>
                      Phone Number
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4>Message:</h4>
                    <p className="rfq-details-para">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In ut ullamcorper leo, egeteuismod orci. Cum sociis
                      natoque penatibus et magnis dis parturient montes
                      nascetur. eget euismod orci. Cum sociis natoque penatibus
                      et magnis dis parturient montes nascetur.
                    </p>
                  </div>
                  <div>
                    <input
                      type="button"
                      value="Make a Quotation"
                      className="btn btn-danger mr-3"
                    />
                    <input
                      type="button"
                      value="Decline"
                      className="btn btn-outline-primary"
                    />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        </div>
      </div>
    </div>
  );
}

export default RFQsDetailsModalArabicComponent;
