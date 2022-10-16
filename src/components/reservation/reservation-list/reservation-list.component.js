import Moment from "react-moment";
import "antd/dist/antd.css";
import { Table, Select } from "antd";
import { useState, useContext, useEffect } from "react";
import { CSVLink } from "react-csv";
import moment from "moment";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getDataWithParams } from "../../../shared/http-request-handler";
import { UserContext } from "../../../pages/dashboard/dashboard";
import { thousandSeparator } from "../../../shared/utility/utility";
import { useTranslation } from "react-i18next";


const ReserVationListComponent = (props) => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right");

  const { t } = useTranslation();
  const [viewAsFilter, setViewAsFilter] = useState("month");
  const [viewAsFilterData, setViewAsFilterData] = useState({
    year: moment().year(),
    month: moment().month() + 1,
    quarter: moment().quarter(),
  });
  const [filterText, setFilterText] = useState("Next Month");
  const { Option } = Select;
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reservationData, setReservationData] = useState([]);


const columns = [
  {
    title: "Reservation ID",
    dataIndex: "reservation_code",
    align: changeAlignment,
    key: "id",
    render: (id) => <span>#{id}</span>,
  },
  {
    title: "Reservation Date",
    align: changeAlignment,
    dataIndex: "reservation_date",
    key: "reservation_date",
    render: (date) => <Moment format="MMM D, YYYY">{date}</Moment>,
  },
  {
    title: "Name",
    dataIndex: "customer",
    key: "customer",
    align: changeAlignment,
    render: (c, row) => {
      return (
        <>
          {row.is_for_walkin === true ? (
            <span>{row.name}</span>
          ) : (
            <span>
              {(c ? c.first_name : "") + " " + (c ? c.last_name : "")}
            </span>
          )}
        </>
      );
    },
  },
  {
    title: "Preferred Contact",
    dataIndex: "quotation",
    key: "quotation",
    align: changeAlignment,
    render: (quotation, row) => {
      return (
        <>
          {row.is_for_walkin === true ? (
            <span>{row.phone}</span>
          ) : quotation && quotation.preferred_contact ? (
            <span>{quotation.preferred_contact}</span>
          ) : (
            <p>-</p>
          )}
        </>
      );
    },
  },
  {
    title: "Amount",
    align: changeAlignment,
    dataIndex: "total_amount",
    key: "total_amount",
    render: (fee) => {
      return <span>$ {fee}</span>;
    },
  },
];

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
        month: moment().month() + 1,
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
        return {
          year: prevState.year,
          month: prevState.month + 1,
        };
      });
    } else if (viewAsFilter === "quarter") {
      setViewAsFilterData((prevState) => {
        return {
          year: prevState.year,
          month: prevState.month,
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
        return {
          year: prevState.year,
          month: prevState.month - 1,
        };
      });
    } else if (viewAsFilter === "quarter") {
      setViewAsFilterData((prevState) => {
        return {
          year: prevState.year,
          month: prevState.month,
          quarter: prevState.quarter - 1,
        };
      });
    }
  };

  const fetchReservation = async () => {
    // console.log("test ---------------", props.fetchListData);
    setLoading(true);
    const params = {};
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
      process.env.REACT_APP_RESERVATION_ALL_URL,
      userContextData.token,
      params
    )
      .then((res) => {
        setLoading(false);
        setReservationData(res);
        setTotalAmount(0);
        if (res) {
        let total = 0;
          res.forEach((element) => {
          total += Number(element.total_amount);
          setTotalAmount(total);
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  useEffect(() => {
    fetchReservation();
    setChangeAlignment(userContextData.selectedLanguage === "en" ? "left" : "right");
  }, [viewAsFilter, viewAsFilterData, props.fetchListData, userContextData.selectedLanguage]);

  // if (props.fetchListData) {
  //   fetchReservation();
  // }

  //headers of csv
  const headers = [
    {
      label: "Reservation ID",
      key: "id",
    },
    {
      label: "Reservation Date",
      key: "reservation_date",
    },
    {
      label: "Name",
      key: "customer",
    },
    {
      label: "Prefferd Contact",
      key: "quatation",
    },
    {
      label: "Amount",
      key: "total_amount",
    },
  ];

  const csvReport = {
    filename: "Reservation-report.csv",
    headers: headers,
    data: reservationData,
  };

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={reservationData}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => { },
          };
        }}
      />


      <div className={(changeAlignment === "right" ? "" : "d-none ")}>
        <div className="d-flex mt-4">

          {/* <div className="ml-auto"> */}
          <div className="">
            <div className="d-inline font-weight-bold">
              ${thousandSeparator(totalAmount)} : {t("quotaion-total")}
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

              <span className="d-inline mr-2">{""}: {t("quotaion-view-as")}</span>
            </div>
          </div>
        </div>
      </div>



      <div className={(changeAlignment === "left" ? "" : "d-none")}>
        <div className="d-flex mt-4">
          <div className="d-flex">
            <div className="d-inline">
              <span className="d-inline mr-2">{t("quotaion-view-as")} :{""}</span>
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
              {t("quotaion-total")}: ${thousandSeparator(totalAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="d-flex mt-4">
        <div className="d-flex">
          <div className="d-inline mt-3">
            <span className="d-inline mr-2">View As : </span>
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
          <div className="d-inline mx-3 pagination">
            <div className="select-year mt-3">
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
        <div className="ml-auto mt-2">
          <div className="d-inline mx-3">
            <CSVLink
              {...csvReport}
              className="quatation-button custom-btn tmm-btn-text pt-2.5 pr-2"
            >
              <i
                className="fa fa-download px-1"
                aria-hidden="true"
                style={{ color: "#fff" }}
              ></i>{" "}
              Download
            </CSVLink>
          </div>
          <div className="d-inline font-weight-bold">
            Total: ${thousandSeparator(totalAmount)}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default ReserVationListComponent;
