import { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EditIcon from "../../../assets/icons/edit.svg";
import Modal from "react-bootstrap/Modal";
import ReservationDetailsModal from "./reservation-details.modal.component";
import ReservationCreateModal from "./create-reservation.component";
import { getData } from "../../../shared/http-request-handler";
import { UserContext } from "../../../pages/dashboard/dashboard";
import SpinnerComponent from "../../../shared/component/spinner/spinner.component";
import CustomToolbar from "./custom-toolbar";
import { useTranslation } from "react-i18next";

const localizer = momentLocalizer(moment);
const views = ["day", "month"];

const ReservationCalendarComponent = (props) => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [eventDateOver, setEventDateOver] = useState();
  const [fetchListData, setFetchListData] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentReservationId, setCurrentReservationId] = useState({});
  const [currentReservationCode, setCurrentReservationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [mode, setMode] = useState("CREATE");

  const fetchReservation = async () => {
    setLoading(true);
    getData(process.env.REACT_APP_RESERVATION_ALL_URL, userContextData.token)
      .then((res) => {
        const dateArr = [];
        res.forEach((element) => {
          const date = element.reservation_date;
          const start_time = element.reservation_start_time;
          const end_time = element.reservation_end_time;
          if (date && start_time && end_time) {
            const data = {
              start: moment(new Date(date + " " + start_time)).toDate(),
              end: moment(new Date(date + " " + end_time)).toDate(),
              title: "#" + element.reservation_code,
              code: 128,
              id: element.id,
            };
            dateArr.push(data);
          }
        });
        setLoading(false);
        setEvents(dateArr);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const reservationDetails = (event) => {
    // console.log(event);
    setEventDateOver(
      moment(event.start, "YYYY-MM-DD").isSameOrAfter(
        moment().format("YYYY-MM-DD")
      )
    );
    setCurrentReservationId(event.id);
    setCurrentReservationCode(event.title);
    setShow(true);
  };

  const createReservation = (event) => {
    if (
      moment(event.start, "YYYY-MM-DD").isSameOrAfter(
        moment().format("YYYY-MM-DD")
      )
    ) {
      setSelectedDate(event.start);
      setShowCreate(true);
      setShow(false);
      setMode("CREATE");
    }
  };

  const editReservation = (event) => {
    setSelectedDate(event.start);
    setShowCreate(true);
    setShow(false);
    setMode("EDIT");
  };

  const onUpdateReservationButtonClick = (event) => {
    setSelectedDate(event.start);
    setShowCreate(true);
    setFetchListData(false);
  };

  const onhideModal = () => {
    setShowCreate(false);
    setMode("CREATE");
  };

  const onSuccessCreateReservation = () => {
    setShowCreate(false);
    fetchReservation();
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === "en" ? "left" : "right"
    );
    fetchReservation();
  }, [userContextData.selectedLanguage]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    var style = {
      backgroundColor: "#e3fdff",
      color: "#4ca6a8",
      borderRadius: "0px",
      opacity: 0.9,
      borderLeft: "5px solid",
      borderColor: "#4ca6a8",
      display: "block",
      fontWeight: "600",
      padding: "5px",
    };
    return {
      style: style,
    };
  };

  return (
    <>
      {loading ? (
        <SpinnerComponent />
      ) : (
        <>
          <Calendar
            views={views}
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={events}
            style={{ height: "185vh" }}
            onSelectEvent={(event) => reservationDetails(event)}
            onSelectSlot={(event) => createReservation(event)}
            selectable={true}
            eventPropGetter={eventStyleGetter}
            popup={true}
            language={userContextData.selectedLanguage}
            // components={{
            //   toolbar: CustomToolbar,
            // }}
            components={{
              toolbar: (props) => (
                <CustomToolbar
                  {...props}
                  language={userContextData.selectedLanguage}
                />
              ),
            }}
          />
          <>
            <div className="modal-text">
              <Modal
                dir={changeAlignment === "right" ? "rtl" : "ltr"}
                show={show}
                onHide={() => {
                  setShow(false);
                  setMode("CREATE");
                }}
                centered="true"
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    <div className="ml-3">
                      <div className="title-with-rfq-id pt-1">
                        {currentReservationCode}
                      </div>
                    </div>
                  </Modal.Title>
                  <div
                    className={
                      "pt-1 " +
                      (!eventDateOver ? "d-none" : "d-inline") +
                      (changeAlignment === "right" ? " mr-auto" : " ml-auto")
                    }
                  >
                    <img
                      onClick={(event) => editReservation(event)}
                      src={EditIcon}
                      style={{
                        marginLeft: "12px",
                        marginRight: "12px",
                        // width: "1.4rem",
                        // marginLeft: "22.5rem",
                      }}
                    />
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <div className="modal-text">
                    <div style={{ height: "600" }}>
                      <ReservationDetailsModal
                        reservationId={currentReservationId}
                      />
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </>
          <>
            <div className="modal-text">
              <Modal
                show={showCreate}
                onHide={onhideModal}
                centered="true"
                dir={changeAlignment === "right" ? "rtl" : "ltr"}
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    <div className="ml-3">
                      <div className="title-with-rfq-id create-reservation-modal-title">
                        {mode === "CREATE"
                          ? t("create-reservation-modal-title-create")
                          : t("create-reservation-modal-title-update")}
                      </div>
                    </div>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="modal-text ml-3">
                    <>
                      <ReservationCreateModal
                        reservationId={currentReservationId}
                        showCreate={setShowCreate}
                        selectedDate={selectedDate}
                        confirmCallback={onSuccessCreateReservation}
                        mode={mode}
                      />
                    </>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </>
        </>
      )}
    </>
  );
};

export default ReservationCalendarComponent;
