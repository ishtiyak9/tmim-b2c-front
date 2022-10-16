import { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { Select, TimePicker, Collapse } from "antd";
import { Form, Input, DatePicker } from "antd";
import HashIcon from "./../../assets/icons/hash.svg";
import ProfileIcon from "./../../assets/icons/profile.svg";
import EmailIcon from "./../../assets/icons/email.svg";
import PhoneIcon from "./../../assets/icons/call.svg";
import CalenderIcon from "./../../assets/icons/calendar.svg";
import ClockIcon from "./../../assets/icons/clock.svg";
import CallingIcon from "./../../assets/icons/calling.svg";
import moment from "moment";
import { left } from "@popperjs/core";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import ButtonComponent from "../../shared/component/button/button.component";
import ValidateMessageComponent from "../../shared/component/validation/validationerror.component";
import Moment from "react-moment";
import { UserContext } from "../../pages/dashboard/dashboard";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";

import { useTranslation } from "react-i18next";

function QuotationModalArabicComponent(props) {
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
  const getFormattedDateTime = (value) => {
    const dateYear = moment(value).format("MMM DD, YYYY");
    const time = moment(value).format("h:mm a");
    return (
      time + " :" + t("quotation-detail-modal-time-text") + " | " + dateYear
    );
  };

  const getCollapseHeaderDateTime = (createdAt, dateStr) => {
    const dateYear = moment(dateStr).format("MMM DD, YYYY");
    const time = moment(createdAt).format("h:mm a");
    return (
      time + " :" + t("quotation-detail-modal-time-text") + " | " + dateYear
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      quotation_date: moment(props.modalData.date),
      quotation_start_time: moment(props.modalData.start_time, "HH:mm:ss"),
      quotation_end_time: moment(props.modalData.end_time, "HH:mm:ss"),
    });
  }, []);

  return (
    <div>
      <Modal.Header dir="rtl" closeButton>
        <Modal.Title>
          <div className="ml-3">
            <div className="title-with-rfq-id text-right">
              {t("quotation-detail-modal-header") + ": #" + props.quotationId}
            </div>
            <div dir="ltr" className="title-with-date text-right">
              {getFormattedDateTime(props.modalData.created_at)}
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-text ml-3">
          <Collapse
            bordered={false}
            defaultActiveKey={["0"]}
            expandIconPosition={left}
            expandIcon={({ isActive }) =>
              isActive ? <DownOutlined /> : <UpOutlined />
            }
          >
            <>
              {props.modalData.logs
                ? props.modalData.logs.map((md, index) => (
                    <Panel
                      header={
                        <div className="py-1 float-right">
                          <div className="d-inline">
                            <img
                              src={CalenderIcon}
                              className="modal-icons ml-0"
                            />
                          </div>

                          <div className="d-inline mt-3" dir="ltr">
                            {getCollapseHeaderDateTime(md.created_at, md.date)}
                            <span className="rfq-details-label mr-2">
                              {" :" + t("quotation-detail-modal-date")}
                            </span>
                          </div>
                        </div>
                      }
                      key={index}
                    >
                      <div className="text-right" dir="ltr">
                        <div className="mb-3">
                          <p className="d-inline">
                            <span className="rfq-details-data">
                              {props.quotationId + "#"}
                            </span>
                            <span className="rfq-details-label">
                              {" :" + t("quotation-detail-modal-quotation-id")}
                            </span>
                          </p>
                          <img src={HashIcon} className="modal-icons" />
                        </div>
                        <div className="mb-3">
                          <p className="d-inline">
                            <span className="rfq-details-data">
                              {props.modalData.rfq_code + "#"}
                            </span>
                            <span className="rfq-details-label">
                              {" :" + t("quotation-detail-modal-rfq-id")}
                            </span>
                          </p>
                          <img src={HashIcon} className="modal-icons" />
                        </div>
                        <div className="mb-3">
                          <p className="d-inline">
                            <span className="rfq-details-data">
                              {props.modalData.name + "#"}
                            </span>
                            <span className="rfq-details-label">
                              {" :" + t("quotation-detail-modal-name")}
                            </span>
                          </p>
                          <img src={ProfileIcon} className="modal-icons" />
                        </div>
                        <div className="mb-3">
                          <p className="d-inline">
                            <span className="rfq-details-data">
                              {props.modalData.email}
                            </span>
                            <span className="rfq-details-label">
                              {" :" + t("quotation-detail-modal-email")}
                            </span>
                          </p>
                          <img src={EmailIcon} className="modal-icons" />
                        </div>
                        <div className="mb-3">
                          <p className="d-inline">
                            <span className="rfq-details-data">
                              {props.modalData.phone}
                            </span>
                            <span className="rfq-details-label">
                              {" :" + t("quotation-detail-modal-phone")}
                            </span>{" "}
                          </p>
                          <img src={PhoneIcon} className="modal-icons" />
                        </div>
                        <div className="mb-3">
                          <p className="d-inline">
                            <span className="rfq-details-data">
                              <Moment format="MMMM D, YYYY">{md.date}</Moment>
                            </span>
                            <span className="rfq-details-label">
                              {" :" + t("quotation-detail-modal-occasion-date")}
                            </span>
                          </p>
                          <img src={CalenderIcon} className="modal-icons" />
                        </div>
                        <div className="mb-3">
                          <p className="d-inline">
                            <span className="rfq-details-data">
                              {moment(md.date + " " + md.start_time).format(
                                "h:m A"
                              ) + " - "}
                              {moment(md.date + " " + md.end_time).format(
                                "h:m A"
                              )}
                            </span>
                            <span className="rfq-details-label">
                              {" :" + t("quotation-detail-modal-occasion-time")}
                            </span>
                          </p>
                          <img src={ClockIcon} className="modal-icons" />
                        </div>
                        <div className="mb-3">
                          <p className="d-inline">
                            <span className="rfq-details-data">
                              {props.modalData.preferred_contact === 1
                                ? "Email"
                                : "Phone Number"}
                            </span>
                            <span className="rfq-details-label">
                              {" :" + t("quotation-detail-modal-contact")}
                            </span>
                            <img src={CallingIcon} className="modal-icons" />
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="rfq-details-label mb-2">
                            {":" + t("quotation-detail-modal-message")}
                          </div>
                          <p className="rfq-details-para text-right">
                            {props.modalData.logs[index].message}
                          </p>
                        </div>
                      </div>
                    </Panel>
                  ))
                : ""}
            </>
          </Collapse>
          <Form form={form} name="control-hooks" onFinish={resubmitQuotation}>
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label for="price" className="field-label">
                    {t("quotation-detail-modal-quotation-amount")}
                  </label>
                  <div className="">
                    <Form.Item
                      name="quotation_amount"
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
                        placeholder={t(
                          "quotation-detail-modal-quotation-amount"
                        )}
                        type="number"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group text-right">
                  <label for="quotation_date" className="rfq-details-label">
                    {t("quotation-detail-modal-date")}
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
                        format={dateFormat}
                        onChange={onChangeDate}
                        placeholder={t("quotation-detail-modal-date")}
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
                    {t("quotation-detail-modal-start-time")}
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
                        format="HH:mm"
                        style={{ width: "100%" }}
                        placeholder={t("quotation-detail-modal-start-time")}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label for="quotation_end_time" className="field-label">
                    {t("quotation-detail-modal-end-time")}
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
                        format="HH:mm"
                        style={{ width: "100%" }}
                        placeholder={t("quotation-detail-modal-end-time")}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group text-right">
              <label for="message">{t("quotation-detail-modal-message")}</label>
              <Form.Item name="message">
                <TextArea
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  // placeholder="Write your message..."
                  placeholder={t("quotation-detail-modal-message")}
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

export default QuotationModalArabicComponent;
