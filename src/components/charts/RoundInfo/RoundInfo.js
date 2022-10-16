import { useTranslation } from "react-i18next";
import "./RoundInfo.css";

const RoundInfo = (props) => {
  const { t } = useTranslation();
  return (
    <div className="box-circle">
      <div className="rfq-chart-text">
        <p>
          <h1>{props.chartData}</h1>{t("dashboard-rfq-round-text")}
        </p>
      </div>
    </div>
  );
};

export default RoundInfo;
