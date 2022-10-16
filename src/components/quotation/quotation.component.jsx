import { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../../pages/dashboard/dashboard";
import { useTranslation } from "react-i18next";
import QuotationModalComponent from "./quotation-modal.component";

import { Form, Button, Table, Select, ConfigProvider, Tooltip } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ContainerDiv from "../../container/container-div";
import axios from "axios";
import { CSVLink } from "react-csv";
import TitleComponent from "../../shared/component/title.component";
import Moment from "react-moment";
import moment from "moment";
import "./css/quotation.css";
import { getDataWithParams } from "../../shared/http-request-handler";
import { thousandSeparator } from "../../shared/utility/utility";
import QuotationModalArabicComponent from "./quotation-modal-arabic.component";

const QuotationComponent = () => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [form] = Form.useForm();
  const { Option } = Select;

  const columns = [
    {
      title: "Quotation ID",
      align: changeAlignment,
      dataIndex: "id",
      key: "id",
      render: (text) => <span>#{text}</span>,
    },
    {
      title: "Date",
      align: changeAlignment,
      dataIndex: "updated_at",
      key: "date",
      render: (date) => {
        if (date) {
          return <Moment format="MMM D, YYYY">{date}</Moment>;
        } else {
          return <p>----</p>;
        }
      },
    },
    {
      title: "RFQ ID",
      align: changeAlignment,
      dataIndex: "rfq_code",
      key: "rfq_code",
      render: (text) => <>#{text}</>,
    },
    {
      title: "Name",
      align: changeAlignment,
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Preferred Contact Details ",
      align: changeAlignment,
      dataIndex: "preferred_contact",
      key: "preferred_contact",
    },
    {
      title: "Quotation Amount",
      align: changeAlignment,
      dataIndex: "price",
      key: "price",
      render: (price) => <>{price ? "$" + price : "0"}</>,
    },
    // {
    //   title: "",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <>
    //       <span className="d-inline pr-3">{getStatusType(status)}</span>
    //     </>
    //   ),
    // },

    {
      title: "",
      align: changeAlignment,
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <>
          <Tooltip placement={changeAlignment} title={getStatusType(status)}>
            <span
              className={statusCircleClass(status)}
              // title={getStatusType(status)}
            ></span>
          </Tooltip>
        </>
      ),
    },
  ];

  const statusType = [
    { id: 1, value: "Pending" },
    { id: 2, value: "Closed" },
    { id: 3, value: "Accepted" },
    { id: 4, value: "Denied" },
  ];

  // const userContextData = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [data, SetData] = useState([]);
  const [totalQuotationAmount, SetTotalQuotationAmount] = useState([]);
  const [filterDate, SetFilterData] = useState(data);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [qid, setQID] = useState("");
  const [filter, setFilter] = useState("0");
  const [viewAsFilter, setViewAsFilter] = useState("month");
  const [viewAsFilterData, setViewAsFilterData] = useState({
    year: moment().year(),
    month: moment().month() + 1,
    quarter: moment().quarter(),
  });
  const [filterText, setFilterText] = useState("Next Month");

  const fetchData = async () => {
    const params = {};
    setLoading(true);
    if (filter !== "0") {
      params["status"] = filter;
    }
    if (viewAsFilter === "year") {
      params["year"] = viewAsFilterData.year;
    } else if (viewAsFilter === "month") {
      params["year"] = viewAsFilterData.year;
      params["month"] = viewAsFilterData.month;
    } else if (viewAsFilter === "quarter") {
      params["year"] = viewAsFilterData.year;
      params["month"] = viewAsFilterData.month;
      params["quarter"] = viewAsFilterData.quarter;
    }
    getDataWithParams(
      process.env.REACT_APP_QUOTATION_ALL_URL,
      userContextData.token,
      params
    )
      .then((res) => {
        setLoading(false);
        SetData(res.quotations);
        SetTotalQuotationAmount(res.total);
        SetFilterData(res.quotations);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const fetchQuotationDetails = async (quotationId) => {
    setQID(quotationId);
    setLoading(true);
    axios({
      method: "get",
      url: process.env.REACT_APP_QUOTATION_DETAILS_URL + quotationId,
      headers: {
        Authorization: "Bearer " + userContextData.token,
      },
    })
      .then((res) => {
        setShow(true);
        setModalData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const statusCircleClass = (sType) => {
    if (sType === 1) {
      return "pending-dot";
    } else if (sType === 2) {
      return "closed-dot";
    } else if (sType === 3) {
      return "accepted-dot";
    } else if (sType === 4) {
      return "deny-dot";
    }
  };

  const getStatusType = (sType) => {
    if (sType === 1) {
      return "Pending";
    } else if (sType === 2) {
      return "Closed";
    } else if (sType === 3) {
      return "Accepted";
    } else if (sType === 4) {
      return "Denied";
    }
  };

  const rowEvent = (rowValue) => {
    fetchQuotationDetails(rowValue.id);
  };

  const handleOnChangeSelect = (value) => {
    if (value === "year") {
      setViewAsFilter(value);
      setViewAsFilterData({ year: moment().year() });
      setFilterText("Next Year");
    } else if (value === "month") {
      setViewAsFilter(value);
      setViewAsFilterData({
        year: moment().year(),
        month: moment().month() + 1,
      });
      setFilterText("Next Month");
    } else if (value === "quarter") {
      setViewAsFilter(value);
      setViewAsFilterData({
        year: moment().year(),
        quarter: moment().quarter(),
      });
      setFilterText("Next Quarter");
    }
  };

  const onNextButtonPress = () => {
    if (viewAsFilter === "year") {
      setViewAsFilterData((prevState) => {
        return { year: prevState.year + 1 };
      });
    } else if (viewAsFilter === "month") {
      setViewAsFilterData((prevState) => {
        if (prevState.month === 12) {
          setViewAsFilterData({
            year: prevState.year + 1,
            month: 1,
          });
        }
        return {
          year: prevState.year,
          month: prevState.month + 1,
        };
      });
    } else if (viewAsFilter === "quarter") {
      setViewAsFilterData((prevState) => {
        if (prevState.quarter === 4) {
          setViewAsFilterData({
            year: prevState.year + 1,
            quarter: 1,
          });
        }
        return {
          year: prevState.year,
          quarter: prevState.quarter + 1,
        };
      });
    }
  };

  const onPreviousButtonPress = () => {
    if (viewAsFilter === "year") {
      setViewAsFilterData((prevState) => {
        return { year: prevState.year - 1 };
      });
    } else if (viewAsFilter === "month") {
      setViewAsFilterData((prevState) => {
        if (prevState.month === 1) {
          setViewAsFilterData({
            year: prevState.year - 1,
            month: 12,
          });
        }
        return {
          year: prevState.year,
          month: prevState.month - 1,
        };
      });
    } else if (viewAsFilter === "quarter") {
      setViewAsFilterData((prevState) => {
        if (prevState.quarter === 1) {
          setViewAsFilterData({
            year: prevState.year - 1,
            quarter: 4,
          });
        }
        return {
          year: prevState.year,
          quarter: prevState.quarter - 1,
        };
      });
    }
  };

  const filterValueChangeHandler = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    fetchData();
    setChangeAlignment(
      userContextData.selectedLanguage === "en" ? "left" : "right"
    );
    // setViewAsFilterData({
    //   year: moment().year(),
    //   month: moment().month() + 1,
    //   quarter: moment().quarter(),
    // });
  }, [
    filter,
    viewAsFilter,
    viewAsFilterData,
    userContextData.selectedLanguage,
  ]);

  //headers of csv
  const headers = [
    {
      label: "Quotation ID",
      key: "id",
    },
    {
      label: "Date",
      key: "date",
    },
    {
      label: "RFQ ID",
      key: "rfq_code",
    },
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Contact Details",
      key: "preferred_contact",
    },
    {
      label: "Quotation Amount",
      key: "price",
    },
    {
      label: "status",
      key: "status",
    },
  ];

  const csvReport = {
    filename: "Qutation-report.csv",
    headers: headers,
    data: filterDate,
  };

  return (
    <ConfigProvider direction={changeAlignment === "right" ? "rtl" : "ltr"}>
      <ContainerDiv>
        <div className="overflow-hidden">
          <div
            className={
              "mx-2 float-" + (changeAlignment === "right" ? "right" : "left")
            }
          >
            <TitleComponent title={t("quotaion-title")} />
          </div>
          <div
            className={
              "mx-2 float-" + (changeAlignment === "right" ? "left" : "right")
            }
          >
            <div className="mt-2 select-status">
              <select
                name="status"
                id="status"
                onChange={filterValueChangeHandler}
              >
                <option value="0" selected>
                  Filter by status
                </option>
                {statusType.map((d, index) => (
                  <option value={d.id} key={index}>
                    {d.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          className={
            "overflow-auto p-4 dashboard-box-shadow mb-5" +
            (changeAlignment === "right" ? " responsive-direction" : "")
          }
        >
          <Table
            loading={loading}
            columns={columns}
            dataSource={filterDate}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  rowEvent(record);
                },
              };
            }}
          />
          <>
            <div className="modal-text">
              <Modal
                show={show}
                onHide={() => setShow(false)}
                centered="true"
                // size="lg"
              >
                <div className={changeAlignment === "right" ? "d-none" : ""}>
                  <QuotationModalComponent
                    modalData={modalData}
                    quotationId={qid}
                    show={setShow}
                    fetchData={() => fetchData()}
                  />
                </div>

                <div className={changeAlignment === "right" ? "" : "d-none"}>
                  <QuotationModalArabicComponent
                    modalData={modalData}
                    quotationId={qid}
                    show={setShow}
                    fetchData={() => fetchData()}
                  />
                </div>
              </Modal>
            </div>
          </>

          {/* <div className="row mt-5">
            <div className="col-md-6">
              <div className="d-inline">
                <span className="mr-2">View As :{""}</span>
                <Select
                  onChange={handleOnChangeSelect}
                  className="view-as-select"
                  value={viewAsFilter}
                >
                  <Option value="month">Monthly </Option>
                  <Option value="quarter">Quaterly</Option>
                  <Option value="year">Yearly</Option>
                </Select>
              </div>
              <div className="d-inline select-year mx-4">
                <Button
                  type="primary"
                  style={{
                    background: "white",
                    borderColor: "white",
                  }}
                  icon={<LeftOutlined />}
                  size="dafault"
                  onClick={onPreviousButtonPress}
                />
                <p className="d-inline mx-3">{filterText}</p>
                <Button
                  type="primary"
                  style={{
                    background: "white",
                    borderColor: "white",
                  }}
                  icon={<RightOutlined />}
                  size="default"
                  onClick={onNextButtonPress}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="float-right">

                <CSVLink
                  {...csvReport}
                  className="quatation-button custom-btn tmm-btn-text pt-2.5 pr-2">
                  <i
                    className="fa fa-download px-1 "
                    aria-hidden="true"
                    style={{ color: "#fff" }}
                  ></i>{" "}
                  Download
                </CSVLink>
                <div className="d-inline font-weight-bold mx-3">
                  Total: ${thousandSeparator(totalQuotationAmount)}
                </div>
              </div>
            </div>
          </div> */}

          <div className={changeAlignment === "right" ? "" : "d-none "}>
            <div className="d-flex mt-4">
              {/* <div className="ml-auto"> */}
              <div className="">
                <div className="d-inline font-weight-bold">
                  ${thousandSeparator(totalQuotationAmount)} :{" "}
                  {t("quotaion-total")}
                </div>
                <div className="d-inline mx-3">
                  <CSVLink
                    {...csvReport}
                    className="quatation-button custom-btn tmm-btn-text pt-2.5 pr-2"
                  >
                    {t("quotaion-download")}
                    <i
                      className="fa fa-download px-1 "
                      aria-hidden="true"
                      style={{ color: "#fff" }}
                    ></i>{" "}
                  </CSVLink>
                </div>
              </div>

              <div className="d-flex mt-2 ml-auto">
                <div className="mx-3 pagination">
                  <div className="select-year">
                    <div className="col-md-2">
                      <Button
                        type="primary"
                        style={{
                          background: "white",
                          borderColor: "white",
                        }}
                        icon={<LeftOutlined />}
                        size="small"
                        onClick={onPreviousButtonPress}
                      />
                    </div>
                    <div className="col-md-8 text-center">
                      <p>{filterText}</p>
                    </div>
                    <div className="col-md-2">
                      <Button
                        type="primary"
                        style={{
                          background: "white",
                          borderColor: "white",
                        }}
                        icon={<RightOutlined />}
                        size="small"
                        onClick={onNextButtonPress}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-inline">
                  <Select
                    onChange={handleOnChangeSelect}
                    className="view-as-select"
                    value={viewAsFilter}
                  >
                    <Option value="month">Monthly </Option>
                    <Option value="quarter">Quaterly</Option>
                    <Option value="year">Yearly</Option>
                  </Select>

                  <span className="d-inline mr-2">
                    {""}: {t("quotaion-view-as")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={changeAlignment === "left" ? "" : "d-none"}>
            <div className="d-flex mt-4">
              <div className="d-flex">
                <div className="d-inline">
                  <span className="d-inline mr-2">
                    {t("quotaion-view-as")} :{""}
                  </span>
                  <Select
                    onChange={handleOnChangeSelect}
                    className="view-as-select"
                    value={viewAsFilter}
                  >
                    <Option value="month">Monthly </Option>
                    <Option value="quarter">Quaterly</Option>
                    <Option value="year">Yearly</Option>
                  </Select>
                </div>
                <div className="mx-3 pagination">
                  <div className="select-year">
                    <div className="col-md-2">
                      <Button
                        type="primary"
                        style={{
                          background: "white",
                          borderColor: "white",
                        }}
                        icon={<LeftOutlined />}
                        size="small"
                        onClick={onPreviousButtonPress}
                      />
                    </div>
                    <div className="col-md-8 text-center">
                      <p>{filterText}</p>
                    </div>
                    <div className="col-md-2">
                      <Button
                        type="primary"
                        style={{
                          background: "white",
                          borderColor: "white",
                        }}
                        icon={<RightOutlined />}
                        size="small"
                        onClick={onNextButtonPress}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <div className="d-inline mx-3">
                  <CSVLink
                    {...csvReport}
                    className="quatation-button custom-btn tmm-btn-text pt-2.5 pr-2"
                  >
                    <i
                      className="fa fa-download px-1 "
                      aria-hidden="true"
                      style={{ color: "#fff" }}
                    ></i>{" "}
                    {t("quotaion-download")}
                  </CSVLink>
                </div>
                <div className="d-inline font-weight-bold">
                  {t("quotaion-total")}: $
                  {thousandSeparator(totalQuotationAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerDiv>
    </ConfigProvider>
  );
};

export default QuotationComponent;
