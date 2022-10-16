import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import ValidateMessageComponent from "../../shared/component/validation/validationerror.component";
import axios from "axios";
import { UserContext } from "../../pages/dashboard/dashboard";
import { Form, Input, DatePicker, Upload, TimePicker, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { showErrorDialog } from "../../shared/utility/utility";
import moment from "moment";
import "./css/rfqs.css";
import RfqEnglishDetailsComponent from "./rfq-modal/rfq-english-details-component";
import RfqArabicDetailsComponent from "./rfq-modal/rfq-arabic-details-component";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import LoadingComponent from "../../shared/component/loading/loading";

// const format = "HH:mm:ss";
const format = "h:m A";
const { TextArea } = Input;

const MakeQuotationComponent = () => {
  const history = useHistory();
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const params = useParams();
  const [details, setDetails] = useState([]);
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileList, setSelectedFileList] = useState([]);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [allDay, setAllDay] = useState(false);

  const fetchRfqDetails = () => {
    setLoading(true);
    axios({
      method: "get",
      url: process.env.REACT_APP_RFQ_DETAILS + params.rfqId,
      headers: {
        Authorization: "Bearer " + userContextData.token,
      },
    })
      .then((res) => {
        setLoading(false);
        setDetails(res.data);
        form.setFieldsValue({
          date: moment(res.data.date),
          start_time: moment(res.data.start_time, "HH:mm:ss"),
          end_time: moment(res.data.end_time, "HH:mm:ss"),
        });
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const onFinish = (values) => {
    // console.log(values, moment(values.end_time).format("hh:mm"));
    setLoading(true);
    const bodyFormData = new FormData();
    bodyFormData.append("price", values.price);
    bodyFormData.append("date", moment(values.date).format("YYYY-MM-DD"));
    bodyFormData.append(
      "start_time",
      moment(values.start_time).format("HH:mm")
    );
    bodyFormData.append("end_time", moment(values.end_time).format("HH:mm"));
    bodyFormData.append("message", values.message);
    if (selectedFile && selectedFile.originFileObj) {
      bodyFormData.append("attachment", selectedFile.originFileObj);
    }
    axios({
      method: "post",
      url: `${process.env.REACT_APP_QUOTATION_CREATE_URL + "/" + params.rfqId}`,
      data: bodyFormData,
      headers: {
        Authorization: "Bearer " + userContextData.token,
      },
    })
      .then((res) => {
        setLoading(false);
        if (res) {
          Swal.fire({
            title: "Created Successfully !!!",
            confirmButtonText: `Continue`,
          }).then((result) => {
            if (result.isConfirmed) {
              history.push("/dashboard/rfqs");
            }
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        showErrorDialog(e.response.data.message);
      });
  };

  const fileUploadHandler = (info) => {
    let file = {};
    let fileList = [];
    switch (info.file.status) {
      case "uploading":
        fileList = [info.file];
        break;
      case "done":
        file = info.file;
        fileList = [info.file];
        break;
      default:
        file = null;
        fileList = [];
    }
    setSelectedFile(file);
    setSelectedFileList(fileList);
  };

  const fileRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === "en" ? "left" : "right"
    );
    fetchRfqDetails();
  }, [userContextData.selectedLanguage]);

  // const checkBoxHandeler = (e) => {
  //   form.setFieldsValue(
  //     (details.start_time = '9:00:00'),
  //     (details.end_time = '21:00:00')
  //   );
  // };

  return (
    <div
      className="content-top-margin mb-5 ml-2"
      dir={changeAlignment === "right" ? "rtl" : "ltr"}
    >
      <div
        className={
          "c-app " + (changeAlignment === "right" ? "text-right" : "text-left")
        }
      >
        <div className="c-wrapper c-fixed-component">
          <div className={changeAlignment === "right" ? "text-right" : ""}>
            <span className="title">{t("rfq-make-quotation-title")}</span>
          </div>
          <div className="content-make-quotation dashboard-box-shadow p-4">
            <div className={changeAlignment === "right" ? "d-none" : ""}>
              <RfqEnglishDetailsComponent {...details} />
            </div>
            <div className={changeAlignment === "right" ? "" : "d-none"}>
              <RfqArabicDetailsComponent {...details} />
            </div>

            <hr />
            <Form form={form} name="control-hooks" onFinish={onFinish}>
              <div className="row mt-4">
                <div className="col-md-11">
                  <div className="row">
                    <div className="col-md-4">
                      <label
                        htmlFor="quotation_amount"
                        className="rfq-details-label"
                      >
                        {t("rfq-make-quotation-input-amount")}
                      </label>
                      <div className="mb-4">
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
                            min={0}
                            max={1000000}
                            type="number"
                            style={{ width: "100%" }}
                            size="large"
                            // placeholder="$5,980"
                            placeholder={t("rfq-make-quotation-input-amount")}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor="quotation_date"
                        className="rfq-details-label"
                      >
                        {t("rfq-make-quotation-input-date")}
                      </label>
                      <div className="mb-4">
                        <Form.Item
                          name="date"
                          rules={[
                            {
                              required: true,
                              message: (
                                <ValidateMessageComponent
                                  message={"Date is required"}
                                />
                              ),
                            },
                          ]}
                        >
                          <DatePicker
                            format="D/MM/YYYY"
                            size="large"
                            style={{ width: "100%" }}
                            placeholder={t("rfq-make-quotation-input-date")}
                            disabled
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="start_time" className="rfq-details-label">
                        {t("rfq-make-quotation-input-start-time")}
                      </label>
                      <div className="mb-4">
                        <Form.Item
                          name="start_time"
                          rules={[
                            {
                              required: true,
                              message: (
                                <ValidateMessageComponent
                                  message={"Start Time is required"}
                                />
                              ),
                            },
                          ]}
                        >
                          <TimePicker
                            placeholder={t(
                              "rfq-make-quotation-input-start-time"
                            )}
                            defaultOpenValue={moment("00:00", "HH:mm")}
                            size="large"
                            format={format}
                            disabled
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="end_time" className="rfq-details-label">
                        {t("rfq-make-quotation-input-end-time")}
                      </label>
                      <div className="mb-4 ">
                        <Form.Item
                          name="end_time"
                          rules={[
                            {
                              required: true,
                              message: (
                                <ValidateMessageComponent
                                  message={"End Time is required"}
                                />
                              ),
                            },
                          ]}
                        >
                          <TimePicker
                            placeholder={t("rfq-make-quotation-input-end-time")}
                            defaultOpenValue={moment("00:00", "HH:mm")}
                            size="large"

                            format={format}
                            disabled
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-1">
                  <div className="">
                    <label className="rfq-details-label ">
                      {t("rfq-make-quotation-input-all-day")}
                    </label>
                    <div
                      className="make-quotation-checkbox"
                      onClick={() => setAllDay(!allDay)}
                    >
                      <input
                        type="checkbox"
                        checked={allDay}
                        // className="quatation-checkbox"
                      />
                      <span class="checkmark"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group message-field-margin">
                <label for="quotation-message" className="rfq-details-label">
                  {t("rfq-make-quotation-message")}
                </label>
                <Form.Item
                  name="message"
                  rules={[
                    {
                      required: true,
                      message: (
                        <ValidateMessageComponent
                          message={"Message is required"}
                        />
                      ),
                    },
                  ]}
                >
                  <TextArea
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    placeholder={t("rfq-make-quotation-message")}
                  />
                </Form.Item>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <Upload
                    fileList={selectedFileList}
                    customRequest={fileRequest}
                    onChange={fileUploadHandler}

                    // rules={[
                    //   {
                    //     required: true,
                    //     message: (
                    //       <ValidateMessageComponent
                    //         message={'File is required'}
                    //       />
                    //     ),
                    //   },
                    // ]}
                  >
                    <Button icon={<UploadOutlined />}>
                      {t("rfq-make-quotation-input-choose-file")}
                    </Button>
                  </Upload>
                  <br />
                  <br />
                  <br />
                </div>
              </div>
              <div>{loading ? <LoadingComponent /> : <></>}</div>
              <div className="row">
                <div className="col-md-3">
                  <button className="custom-btn tmm-btn tmm-btn-text w-100">
                    {t("rfq-make-quotation-button-submit")}
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeQuotationComponent;
