import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../pages/dashboard/dashboard";
import { getData } from "../../../shared/http-request-handler";
import HashIcon from "./../../../assets/icons/hash.svg";
import ProfileIcon from "./../../../assets/icons/profile.svg";
import EmailIcon from "./../../../assets/icons/email.svg";
import PhoneIcon from "./../../../assets/icons/call.svg";
import CalenderIcon from "./../../../assets/icons/calendar.svg";
import MoneyIcon from "./../../../assets/icons/money.svg";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { convertTime24to12 } from "../../../shared/utility/utility";

function ReservationDetailsModal(props) {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const url =
    process.env.REACT_APP_RESERVATION_DETAILS_URL + props.reservationId;
  const { t } = useTranslation();

  const [reservationDetailsData, setReservationDetailsData] = useState({});

  const fetchData = async () => {
    getData(url, userContextData.token)
      .then((response) => {
        const res = response ? response[0] : {};
        if (res) {
          const data = {
            reservationId: res.id,
            quotationId: res.quotation ? res.quotation.id : "",
            name:
              res.is_for_walkin === true
                ? res.name
                : res.customer
                ? res.customer.first_name + " " + res.customer.last_name
                : "",
            email:
              res.is_for_walkin === true
                ? res.email
                : res.customer
                ? res.customer.email
                : "",
            phoneNumber:
              res.is_for_walkin === true
                ? res.phone
                : res.customer
                ? res.customer.phone
                : "",
            ocationDate:
              moment(
                res.reservation_date + " " + res.reservation_start_time
              ).format("MMMM D, YYYY") +
              " (" +
              convertTime24to12(res.reservation_start_time) +
              " - " +
              convertTime24to12(res.reservation_end_time) +
              ")",

            deposite: res.deposite_amount,
            total: res.total_amount,
            reservationCode: res.reservation_code,
          };
          setReservationDetailsData(data);
        } else {
          setReservationDetailsData({});
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === "en" ? "left" : "right"
    );
    fetchData();
  }, [userContextData.selectedLanguage]);

  return (
    // <div dir={changeAlignment === "right" ? "rtl" : "ltr"} className={changeAlignment === "right" ? "text-right" : ""}>
    <div className={changeAlignment === "right" ? "text-right" : ""}>
      <div className={changeAlignment === "right" ? "d-none" : ""}>
        <div style={{ padding: ".75rem", height: "380px" }}>
          <div className="mb-3 mt-3">
            <img src={HashIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">Reservation ID: </span>
              <span className="rfq-details-data">
                #{reservationDetailsData.reservationCode}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={HashIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">Quotation ID: </span>
              <span className="rfq-details-data">
                {reservationDetailsData.quotationId}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={ProfileIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">Name: </span>
              <span className="rfq-details-data">
                {reservationDetailsData.name}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={EmailIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">Email: </span>
              <span className="rfq-details-data">
                {reservationDetailsData.email}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={PhoneIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">Phone Number: </span>{" "}
              <span className="rfq-details-data">
                {reservationDetailsData.phoneNumber}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={CalenderIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">
                Occasion Date {"&"} Time:{" "}
              </span>
              <span className="rfq-details-data">
                {reservationDetailsData.ocationDate}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={MoneyIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">Diposite Amount: </span>
              <span className="rfq-details-data">
                {reservationDetailsData.deposite}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={MoneyIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">Total Amount: </span>
              <span className="rfq-details-data">
                {reservationDetailsData.total}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className={changeAlignment === "right" ? "" : "d-none"}>
        <div style={{ padding: ".75rem", height: "380px" }}>
          <div className="mb-3 mt-3">
            <img src={HashIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">
                {t("reservation-details-modal-reservation-id") + ": "}
              </span>
              <span className="rfq-details-data">
                #{reservationDetailsData.reservationCode}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={HashIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-data">
                {reservationDetailsData.quotationId}
              </span>
              <span className="rfq-details-label">
                {t("reservation-details-modal-quotation-id") + ": "}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={ProfileIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">
                {t("reservation-details-modal-name") + ": "}
              </span>
              <span className="rfq-details-data">
                {reservationDetailsData.name}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={EmailIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">
                {t("reservation-details-modal-email") + ": "}
              </span>
              <span className="rfq-details-data">
                {reservationDetailsData.email}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={PhoneIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">
                {t("reservation-details-modal-phone-number") + ": "}
              </span>
              <span className="rfq-details-data">
                {reservationDetailsData.phoneNumber}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={CalenderIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">
                {t("reservation-details-modal-occasion-date-time") + ": "}
              </span>
              <span className="rfq-details-data">
                {reservationDetailsData.ocationDate}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={MoneyIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">
                {t("reservation-details-modal-diposite-amount") + ": "}
              </span>
              <span className="rfq-details-data">
                {reservationDetailsData.deposite}
              </span>
            </p>
          </div>
          <div className="mb-3">
            <img src={MoneyIcon} className="modal-icons" />
            <p className="d-inline">
              <span className="rfq-details-label">
                {t("reservation-details-modal-total-amount") + ": "}
              </span>
              <span className="rfq-details-data">
                {reservationDetailsData.total}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetailsModal;
