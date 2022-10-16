import { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { TimePicker, Collapse } from "antd";
import { Form, Input, DatePicker } from "antd";
import HashIcon from "./../../assets/icons/hash.svg";
import ProfileIcon from "./../../assets/icons/profile.svg";
import EmailIcon from "./../../assets/icons/email.svg";
import PhoneIcon from "./../../assets/icons/call.svg";
import CalenderIcon from "./../../assets/icons/calendar.svg";
import ClockIcon from "./../../assets/icons/clock.svg";
import CallingIcon from "./../../assets/icons/calling.svg";
import moment from "moment";
import { right } from "@popperjs/core";
import { UpOutlined } from "@ant-design/icons";
import ButtonComponent from "../../shared/component/button/button.component";
import ValidateMessageComponent from "../../shared/component/validation/validationerror.component";
import Moment from "react-moment";
import { UserContext } from "../../pages/dashboard/dashboard";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function QuotationModalComponent(props) {
  console.log(props);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [form] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";
  const { Panel } = Collapse;
  const { TextArea } = Input;
  const userContextData = useContext(UserContext);

  const resubmitQuotation = (formData) => {
    const reqResubmitData = {
      status: 1,
      price: formData.price,
      message: formData.message,
      date: moment(formData.quotation_date).format("YYYY-MM-DD"),
      start_time: moment(formData.quotation_start_time).format("HH:mm:ss"),
      end_time: moment(formData.quotation_end_time).format("HH:mm:ss"),
    };
    axios({
      method: "post",
      url: process.env.REACT_APP_QUOTATION_UPDATE_URL + props.quotationId,
      data: reqResubmitData,
      headers: {
        Authorization: "Bearer " + userContextData.token,
      },
    })
      .then((res) => {
        if (res) {
          Swal.fire({
            title: "Updated Successfully",
            confirmButtonText: `Continue`,
          }).then((result) => {
            if (result.isConfirmed) {
              props.show(false);
              props.fetchData();
            }
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const declineEvent = () => {
    const reqDeclineQuotation = {
      status: 2,
    };
    axios({
      method: "post",
      url: process.env.REACT_APP_QUOTATION_UPDATE_URL + props.quotationId,
      data: reqDeclineQuotation,
      headers: {
        Authorization: "Bearer " + userContextData.token,
      },
    })
      .then((res) => {
        if (res) {
          Swal.fire({
            title: "Updated Successfully",
            confirmButtonText: `Continue`,
          }).then((result) => {
            if (result.isConfirmed) {
              props.show(false);
              props.fetchData();
            }
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onChangeDate = (date, dateString) => {};
  const onTimeChange = (time, timeString) => {};

  useEffect(() => {
    form.setFieldsValue({
      quotation_date: moment(props.modalData.date),
      quotation_start_time: moment(props.modalData.start_time, "HH:mm:ss"),
      quotation_end_time: moment(props.modalData.end_time, "HH:mm:ss"),
    });
  }, []);

  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="ml-3">
            <div className="title-with-rfq-id">
              Details view of Quotation # {props.quotationId}
            </div>
            <div className="title-with-date">
              <Moment format="MMM D, YYYY">{props.modalData.created_at}</Moment>
              {" | Time: "}
              <Moment format="h:mm a">{props.modalData.created_at}</Moment>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-text ml-3">
          <Collapse
            bordered={false}
            defaultActiveKey={["0"]}
            expandIconPosition={right}
            expandIcon={({ isActive }) => (
              <UpOutlined rotate={isActive ? 0 : 180} />
            )}
          >
            <>
              {props.modalData.logs
                ? props.modalData.logs.map((md, index) => (
                    <Panel
                      header={
                        <div className="py-1">
                          <div className="d-inline">
                            <img
                              src={CalenderIcon}
                              className="modal-icons ml-0"
                            />
                          </div>
                          <div className="d-inline mt-3">
                            <span className="rfq-details-label">
                              {"Date: "}
                            </span>
                            <span className="rfq-details-data">
                              {moment(md.created_at).format("MMMM D, YYYY") +
                                " | Time: " +
                                moment(md.created_at).format("h:mm a")}
                            </span>
                          </div>
                        </div>
                      }
                      key={index}
                    >
                      <div>
                        <div className="mb-3">
                          <img src={HashIcon} className="modal-icons" />
                          <p className="d-inline">
                            <span className="rfq-details-label">
                              Quotation ID:{" "}
                            </span>
                            <span className="rfq-details-data">
                              {/*                               {props.modalData.id} */}

                              {props.quotationId}
                            </span>
                          </p>
                        </div>
                        <div className="mb-3">
                          <img src={HashIcon} className="modal-icons" />
                          <p className="d-inline">
                            <span className="rfq-details-label">RFQ ID: </span>
                            <span className="rfq-details-data">
                              {" "}
                              #{props.modalData.rfq_code}
                            </span>
                          </p>
                        </div>
                        <div className="mb-3">
                          <img src={ProfileIcon} className="modal-icons" />
                          <p className="d-inline">
                            <span className="rfq-details-label">Name: </span>
                            <span className="rfq-details-data">
                              {props.modalData.name}
                            </span>
                          </p>
                        </div>
                        <div className="mb-3">
                          <img src={EmailIcon} className="modal-icons" />
                          <p className="d-inline">
                            <span className="rfq-details-label">Email: </span>
                            <span className="rfq-details-data">
                              {props.modalData.email}
                            </span>
                          </p>
                        </div>
                        <div className="mb-3">
                          <img src={PhoneIcon} className="modal-icons" />
                          <p className="d-inline">
                            <span className="rfq-details-label">
                              Phone Number:{" "}
                            </span>{" "}
                            <span className="rfq-details-data">
                              {props.modalData.phone}
                            </span>
                          </p>
                        </div>
                        <div className="mb-3">
                          <img src={CalenderIcon} className="modal-icons" />
                          <p className="d-inline">
                            <span className="rfq-details-label">
                              Occasion Date:{" "}
                            </span>
                            <span className="rfq-details-data">
                              <Moment format="MMMM D, YYYY">{md.date}</Moment>
                            </span>
                          </p>
                        </div>
                        <div className="mb-3">
                          <img src={ClockIcon} className="modal-icons" />
                          <p className="d-inline">
                            <span className="rfq-details-label">
                              Occasion Time:{" "}
                            </span>
                            <span className="rfq-details-data">
                              {moment(md.date + " " + md.start_time).format(
                                "h:m A"
                              ) + " - "}
                              {moment(md.date + " " + md.end_time).format(
                                "h:m A"
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="mb-3">
                          <img src={CallingIcon} className="modal-icons" />
                          <p className="d-inline">
                            <span className="rfq-details-label">
                              Contact Method:{" "}
                            </span>
                            <span className="rfq-details-data">
                              {props.modalData.preferred_contact === 1
                                ? "Email"
                                : "Phone Number"}
                            </span>
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="rfq-details-label mb-2">Message:</div>
                          <p className="rfq-details-para">
                            {props.modalData.logs[index].message}
                            {/* {props.modalData.message} */}
                          </p>
                        </div>
                      </div>
                    </Panel>
                  ))
                : ""}
            </>
          </Collapse>
          {/* <div className="mt-4">
            <div className="rfq-details-label mb-2">
              Message:
            </div>
            <p className="rfq-details-para">
              {props.modalData.message}
            </p>
          </div> */}
          <Form form={form} name="control-hooks" onFinish={resubmitQuotation}>
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label for="price" className="field-label">
                    {t("Quotation Amount")}
                  </label>
                  <div className="">
                    <Form.Item
                      name="price"
                      rules={[
                        {
                          required: true,
                          message: (
                            <ValidateMessageComponent
                              message={"Quotation amount is required"}
                            />
                          ),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder={t("Quotation Amount")}
                        type="number"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label for="quotation_date" className="rfq-details-label">
                    Date
                  </label>
                  <div className="mb-4">
                    <Form.Item
                      // disabled
                      name="quotation_date"
                      rules={[
                        {
                          required: false,
                          message: (
                            <ValidateMessageComponent
                              message={"Quotation date is required"}
                            />
                          ),
                        },
                      ]}
                    >
                      <DatePicker
                        size="large"
                        style={{ width: "100%" }}
                        // defaultValue={moment("2020/12/15")}
                        format={dateFormat}
                        placeholder="Date"
                        onChange={onChangeDate}
                        // disabled={true}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label for="quotation_start_time" className="field-label">
                    Start Time
                  </label>
                  <div className="mb-4">
                    <Form.Item
                      // disabled
                      name="quotation_start_time"
                      rules={[
                        {
                          required: false,
                          message: (
                            <ValidateMessageComponent
                              message={"Quotation start time is required"}
                            />
                          ),
                        },
                      ]}
                    >
                      <TimePicker
                        size="large"
                        onChange={onTimeChange}
                        // defaultValue={moment("12:30", "HH:mm")}
                        format="HH:mm"
                        style={{ width: "100%" }}
                        placeholder="Start Time"
                        // disabled={true}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label for="quotation_end_time" className="field-label">
                    End Time
                  </label>
                  <div className="mb-4">
                    <Form.Item
                      // disabled
                      name="quotation_end_time"
                      rules={[
                        {
                          required: false,
                          message: (
                            <ValidateMessageComponent
                              message={"Quotation end time is required"}
                            />
                          ),
                        },
                      ]}
                    >
                      <TimePicker
                        size="large"
                        onChange={onTimeChange}
                        // defaultValue={moment("17:45", "HH:mm")}
                        format="HH:mm"
                        style={{ width: "100%" }}
                        placeholder="End Time"
                        // disabled={true}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label for="message">{"Message"}</label>
              <Form.Item name="message">
                <TextArea
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  // placeholder="Write your message..."
                  placeholder="Message"
                />
              </Form.Item>
            </div>
            <div className="d-flex justify-content-center">
              {props.modalData.status === 1 || props.modalData.status === 4 ? (
                <div className="d-inline mr-3">
                  <ButtonComponent
                    text={t("quotation-detail-modal-resubmit")}
                    outline="no"
                  />
                </div>
              ) : null}
              {props.modalData.status === 1 ? (
                <div className="d-inline mr-3">
                  <ButtonComponent
                    text={t("quotation-detail-modal-decline")}
                    outline="yes"
                    click={() => declineEvent()}
                  />
                </div>
              ) : null}
            </div>
          </Form>
        </div>
      </Modal.Body>
    </div>
  );
}

export default QuotationModalComponent;
