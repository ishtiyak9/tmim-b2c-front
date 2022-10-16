import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../pages/dashboard/dashboard";
import { getData } from "../../shared/http-request-handler";
import { RESERVATION_CHART_JSON_KEYS } from "../../shared/utility/chart-constant";
import SpinnerComponent from "../../shared/component/spinner/spinner.component";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./css/reservation.css";
import { useTranslation } from "react-i18next";

const ReservationChartComponent = () => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const [chartData, setChartData] = useState([]);
  const [chartDataCount, setChartDataCount] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("day");

  const fetchData = async () => {
    setLoading(true);
    const url = `${
      process.env.REACT_APP_RESERVATION_BAR_CHART_URL + "?" + filter
    }`;
    getData(url, localStorage.getItem("token"))
      .then((res) => {
        setLoading(false);
        if (res[RESERVATION_CHART_JSON_KEYS[filter]] && res.total_count) {
          let dataSet = [];
          res[RESERVATION_CHART_JSON_KEYS[filter]].forEach((element) => {
            const obj = {
              // x_label: filter === "day" ? element["days"] : element[filter],
              x_label:
                filter === "day"
                  ? new Date(element["days"]).getDate()
                  : filter === "year"
                  ? element[filter]
                  : new Date(element[filter]).getDate(),
              Reservation: element.counts,
            };
            // console.log('DataSet::: ' + filter);
            dataSet.push(obj);
          });
          dataSet.sort((a, b) => a.x_label - b.x_label);
          setChartData(dataSet);
          setChartDataCount(res.total_count);
        } else {
          setChartData([]);
          setChartDataCount(0);
        }

        // console.log(chartData);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const filterValueChangeHandler = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === "en" ? "left" : "right"
    );
    fetchData();
  }, [filter, userContextData.selectedLanguage]);

  const CustomizedMostPopularLabel = (props) => {
    const { x, y, value } = props;
    return (
      <g>
        <text x={x} y={y} fill="#000"></text>
      </g>
    );
  };

  return (
    <div className="dashboard-box-shadow">
      <div className="d-flex justify-content-between dashboard-select space-bottom">
        <p className="reservation-chart-text ml-3 mb-3 pr-3">
          {" "}
          <span className="dashboard-reservation-dot mx-1"></span>
          {t("dashboard-card-reservation-text")}: {chartDataCount}{" "}
        </p>

        <span className="overflow-hidden ml-3">
          <select
            className={
              "mr-3 " +
              (changeAlignment === "right"
                ? "select-option-rtl"
                : "select-option")
            }
            onChange={filterValueChangeHandler}
            value={filter}
          >
            <option value="day">
              {t("dashboard-card-reservation-dropdown-option-1")}
            </option>
            <option value="month">
              {t("dashboard-card-reservation-dropdown-option-2")}
            </option>
            <option value="year">
              {t("dashboard-card-reservation-dropdown-option-3")}
            </option>
          </select>
        </span>
      </div>
      {loading ? (
        <SpinnerComponent />
      ) : (
        <ResponsiveContainer width="100%" height={355}>
          <BarChart width={600} height={300} data={chartData} barSize={45}>
            <Bar dataKey="Reservation" fill="#4CA6A8">
              <LabelList
                dataKey="Reservation"
                position="insideTop"
                fill="#ffffff"
                offset={15}
                fontSize={12}
              />
            </Bar>
            <XAxis
              dataKey="x_label"
              axisLine={false}
              sclaeToFit="true"
              interval={0}
              orientation="bottom"
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            {/* <Tooltip cursor={{ fill: "transparent" }} /> */}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ReservationChartComponent;
