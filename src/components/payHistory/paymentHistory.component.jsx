import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../pages/dashboard/dashboard";
import ContainerDiv from "../../container/container-div";
import TitleComponent from "../../shared/component/title.component";
import { getData } from "../../shared/http-request-handler";
import { Table, ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import "antd/dist/antd.css";
import "./css/paymentHistory.css";

const PaymentHistoryComponent = (props) => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const { t } = useTranslation();
  const columns = [
    {
      title: "Payment Date",
      align: changeAlignment,
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => {
        if (date) {
          return <Moment format="MMM D, YYYY">{date}</Moment>;
        } else {
          return <p className="payment-history-table-cell">-</p>;
        }
      },
    },
    {
      title: "Subscription Plan Name",
      align: changeAlignment,
      dataIndex: "subscription_plan",
      key: "subscription_plan",
      render: (data) => {
        if (data === 1) {
          return <>Premium Plan</>;
        } else {
          return <>Free Plan</>;
        }
      },
    },
    {
      title: "Renew Date",
      align: changeAlignment,
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => {
        if (date) {
          return <Moment format="MMM D, YYYY">{date}</Moment>;
        } else {
          return <p className="payment-history-table-cell">-</p>;
        }
      },
    },
    {
      title: "Expired Date",
      align: changeAlignment,
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => {
        if (date) {
          return (
            <span>
              <Moment className="expired-date payment-history-table-cell" format="MMM D, YYYY">
                {date}
              </Moment>
            </span>
          );
        } else {
          return <p className="payment-history-table-cell">-</p>;
        }
      },
    },
    {
      title: "Amount",
      align: changeAlignment,
      dataIndex: "fees",
      key: "fees",
      render: (fee) => {
        return <span>$ {fee}</span>;
      },
    },
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    getData(process.env.REACT_APP_PAYMENT_HISTORY_URL, userContextData.token)
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  useEffect(() => {
    fetchData();
    setChangeAlignment(
      userContextData.selectedLanguage === "en" ? "left" : "right"
    );
  }, [userContextData.selectedLanguage]);

  return (
    <ConfigProvider direction={changeAlignment === "right" ? "rtl" : "ltr"}>
      <ContainerDiv>
        <div className="overflow-hidden">
        <div className={"text-" + changeAlignment}>
          <TitleComponent title={t("payment-history-title")} />
        </div>
        </div>
        <div className="overflow-auto p-4 payment-history-box-shadow">
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  // console.log("on row Click ---- ", record, rowIndex);
                },
              };
            }}
            columns={columns}
            dataSource={data}
            onChange={onChange}
            pagination={false}
            loading={loading}
          />
        </div>
      </ContainerDiv>
    </ConfigProvider>
  );
};

export default PaymentHistoryComponent;
