import { useEffect, useState, useContext } from "react";
import RfqChartComponent from "../rfq-chart/RfqChart.component";
import QuotationChartComponent from "../quotationTable/QuotationChart.component";
import ReservationChartComponent from "../reservation-chart/ReservationChart.component";
import InformationCard from "../charts/InformationCard/InformationCard";
import { getData } from "../../shared/http-request-handler";
import ContainerDiv from "../../container/container-div";
import { UserContext } from "../../pages/dashboard/dashboard";
import { thousandSeparator } from "../../shared/utility/utility";
import { postData } from '../../shared/http-request-handler';
import "./css/dashboard.css";
import { useTranslation } from "react-i18next";
import firebase from 'firebase/app';
import 'firebase/messaging';
/**
 * Firebase push notification configure
 */
const firebaseConfig = {
  apiKey: 'AIzaSyBlENf-G26iIvrV8mY-B6UsTy4RIvt1WRY',
  authDomain: 'python-firebase-2208f.firebaseapp.com',
  databaseURL: 'https://python-firebase-2208f-default-rtdb.firebaseio.com',
  projectId: 'python-firebase-2208f',
  storageBucket: 'python-firebase-2208f.appspot.com',
  messagingSenderId: '308142962690',
  appId: '1:308142962690:web:ff69351cf49b63a7714f1b',
  measurementId: 'G-8XJYW0VTRV',
};

firebase.initializeApp(firebaseConfig);

export const messaging = firebase.messaging();
// export const getToken = () => {
//   console.log("calling-1");
//   return messaging
//     .getToken({
//       vapidKey:
//         'BPrOg5Qvr2NUM-JDRFXxkCzFHLbP4aHOlUWZyKY6AuEBbYHQu76f_y2jm7g0gDyhetYFm8K0ygKebt2cz9QRx_4',
//     })
//     .then((currentToken) => {
//       console.log("calling-2");
//       if (currentToken) {
//         console.log("calling-3");
//         localStorage.setItem('firebase_token', currentToken);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };



const DashboardComponent = () => {

  const { t } = useTranslation();
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right");
  const [activeQuotation, setActiveQuotation] = useState({});
  const [declinedQuotation, setDeclinedQuotation] = useState({});
  const [totalReservation, setTotalReservation] = useState({});
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    console.log("calling-1");
    return messaging
      .getToken({
        vapidKey:
          'BPrOg5Qvr2NUM-JDRFXxkCzFHLbP4aHOlUWZyKY6AuEBbYHQu76f_y2jm7g0gDyhetYFm8K0ygKebt2cz9QRx_4',
      })
      .then((currentToken) => {
        console.log("calling-2");
        if (currentToken) {
          console.log("calling-3");
          localStorage.setItem('firebase_token', currentToken);
          postFirebaseRegistartionToken();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const postFirebaseRegistartionToken = () => {
    const data = {
      registration_token: localStorage.getItem('firebase_token'),
    };
    postData(
      process.env.REACT_APP_POST_FIREBASE_TOKEN_URL,
      localStorage.getItem('token'),
      data
    )
      .then((res) => {})
      .catch((e) => {
        console.log(e);
      });
  };


  useEffect(()=> {
    getToken();
  }, []);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    Promise.all([
      getData(process.env.REACT_APP_ACTIVE_QUOTATION_URL, token),
      getData(process.env.REACT_APP_DECLINED_QUOTATION_URL, token),
      getData(process.env.REACT_APP_TOTAL_RESERVATION_URL, token),
    ])
      .then(([res1, res2, res3]) => Promise.all([res1, res2, res3]))
      .then(([data1, data2, data3]) => {
        setActiveQuotation(data1);
        setDeclinedQuotation(data2);
        setTotalReservation(data3);
        setLoading(false);
      });
    setChangeAlignment(userContextData.selectedLanguage === "en" ? "left" : "right");
  }, [userContextData.selectedLanguage]);

  return (
    <ContainerDiv>
      <div className={"row mb-2 text-" + (changeAlignment === "right" ? "right" : "left")}>
        <div className="col dashboard-title">{t("dashboard-title")}</div>
      </div>

      <div className={"row mb-4 text-" + changeAlignment} dir={changeAlignment === "right" ? "rtl" : "ltr"}>
        <div className="col-md-4 card-margin">
          <InformationCard
            title={t("dashboard-card-quotation-total-text")}
            data={t("dashboard-card-information-sar") + ` ${thousandSeparator(
              activeQuotation.active_quotation_amount
            )}`}
            value={changeAlignment === "right" ? (`${thousandSeparator(
              activeQuotation.active_quotation_amount_sum_yearly
            )} ` + t("dashboard-card-information-sar")) : 
            (t("dashboard-card-information-sar") + ` ${thousandSeparator(
              activeQuotation.active_quotation_amount_sum_yearly
            )}`)
              }
            desc={t("dashboard-card-information-text")}
            valueColor={"active-quotation"}
            isLoading={loading}
          />
        </div>

        <div className="col-md-4 card-margin">
          <InformationCard
            title={t("dashboard-card-reservation-total-text")}
            data={`SAR ${thousandSeparator(
              totalReservation.reservation_sum_as_of_today
            )}`}
            value={changeAlignment === "right" ? (`${thousandSeparator(
              totalReservation.reservation_sum_current_year
            )} ` + t("dashboard-card-information-sar")) : 
            (t("dashboard-card-information-sar") + ` ${thousandSeparator(
              totalReservation.reservation_sum_current_year
            )}`)
              }
            desc={t("dashboard-card-information-text")}
            valueColor={"total-reservation"}
            isLoading={loading}
          />
        </div>

        <div className="col-md-4">
          <InformationCard
            title={t("dashboard-card-declined-total-text")}
            data={`SAR ${thousandSeparator(
              declinedQuotation.quotation_declined_sum_as_of_today
            )}`}
            value={changeAlignment === "right" ? (`${thousandSeparator(
              declinedQuotation.quotation_declined_sum_yearly
            )} ` + t("dashboard-card-information-sar")) : 
            (t("dashboard-card-information-sar") + ` ${thousandSeparator(
              declinedQuotation.quotation_declined_sum_yearly
            )}`)
              }
            // value={`SAR ${thousandSeparator(
            //   declinedQuotation.quotation_declined_sum_yearly
            // )}`}
            desc={t("dashboard-card-information-text")}
            valueColor={"declined-quotaiton"}
            isLoading={loading}
          />
        </div>
      </div>

      <div className={"text-" + changeAlignment} dir={changeAlignment === "right" ? "rtl" : "ltr"}>
        <div className="row mb-4">
          <div className="col-md-6 card-margin">
            <div>
              <h4 className="chart-header mb-2">{t("dashboard-reservation-title")}</h4>
              <div className="card p-0">
                <ReservationChartComponent />
              </div>
            </div>
          </div>
          <div className="col-md-6 card-margin">
            <div>
              <h4 className="chart-header mb-2">{t("dashboard-quotation-title")}</h4>
              <div className="card p-0">
                <QuotationChartComponent />
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div>
            <h4 className="chart-header mb-2">{t("dashboard-rfq-title")}</h4>
            <div className="card p-0">
              <RfqChartComponent />
            </div>
          </div>
        </div>
      </div>
    </ContainerDiv>
  );
};

export default DashboardComponent;
