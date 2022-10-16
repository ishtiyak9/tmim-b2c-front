import { useState, useEffect, useContext } from "react";
import { getData } from "../../shared/http-request-handler";
import { UserContext } from "../../pages/dashboard/dashboard";
import {
  QUOTATION_PIE_CHART_ACTIVE_JSON_KEYS,
  QUOTATION_PIE_CHART_PENDING_JSON_KEYS,
} from "../../shared/utility/chart-constant";
import SpinnerComponent from "../../shared/component/spinner/spinner.component";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import "./quotation-chart.css";

const data = [
  { name: "Active", value: 33 },
  { name: "Pending", value: 67 },
];

const COLORS = ["#5B93FF", "#F0C756"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={30}
      fontStyle="bold"
    >
      {`${value}`}
    </text>
  );
};

const QuotationChartComponent = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("one_month");
  const { t } = useTranslation();
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );

  const fetchData = async () => {
    setLoading(true);
    let filterData = filter;
    const url = `${
      process.env.REACT_APP_QUOTATIONS_PIE_CHART_URL + "?" + filterData
    }`;
    getData(url, localStorage.getItem("token"))
      .then((res) => {
        setLoading(false);
        const data = [
          {
            name: "Active",
            value: res[QUOTATION_PIE_CHART_ACTIVE_JSON_KEYS[filter]],
          },
          {
            name: "Pending",
            value: res[QUOTATION_PIE_CHART_PENDING_JSON_KEYS[filter]],
          },
        ];
        // console.log(data);
        setChartData(data);
      })
      .catch((e) => {
        setChartData();
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

  return (
    <div className="dashboard-box-shadow">
      <div className="d-flex justify-content-end space-bottom">
        <span className="overflow-hidden ml-3">
          <select
            className={
              "mb-5 mr-3" +
              (changeAlignment === "right"
                ? " select-option-quotation-chart-rtl"
                : " select-option-quotation-chart")
            }
            onChange={filterValueChangeHandler}
            value={filter}
          >
            <option value="one_month">
              {t("dashboard-card-quotation-dropdown-option-1")}
            </option>
            <option value="six_month">
              {t("dashboard-card-quotation-dropdown-option-2")}
            </option>
            <option value="alltime">
              {t("dashboard-card-quotation-dropdown-option-3")}
            </option>
          </select>
        </span>
      </div>

      {loading ? (
        <SpinnerComponent />
      ) : (
        <>
          {chartData && chartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={270}>
                <PieChart width={500} height={400}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="40%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="dot-flex">
                <span className="dashboard-quatation-dot2"></span>
                <span className="dashboard-quatation-dot1-span mx-2">
                  {t("dashboard-card-quotation-chart-status-pending")}
                </span>
                <span className="dashboard-quatation-dot1"></span>
                <span className="dashboard-quatation-dot1-span mx-2">
                  {t("dashboard-card-quotation-chart-status-active")}
                </span>
              </div>
            </>
          ) : (
            <p>No Data Found</p>
          )}
        </>
      )}
    </div>
  );
};

export default QuotationChartComponent;
