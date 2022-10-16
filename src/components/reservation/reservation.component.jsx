import { useContext, useEffect, useState } from "react";
import ContainerDiv from "../../container/container-div";
import TitleComponent from "../../shared/component/title.component";
import ReservationCalendarComponent from "./reservation-calendar/reservation-calendar.component";
import ReserVationListComponent from "./reservation-list/reservation-list.component";
import PlusIcon from "../../assets/icons/plus.svg";
import { Button, ConfigProvider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Modal from "react-bootstrap/Modal";
import ReservationCreateModal from "../reservation/reservation-calendar/create-reservation.component";
import { UserContext } from "../../pages/dashboard/dashboard";
import { useTranslation } from "react-i18next";

const ReservationComponent = () => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right");
  const [view, setView] = useState("calendar");
  const [showCreate, setShowCreate] = useState(false);
  const [fetchListData, setFetchListData] = useState(false);
  const { t } = useTranslation();

  const viewChangeHandler = (event) => {
    setView(event.target.value);
  };

  const onhideModal = () => {
    setShowCreate(false);
  };

  const onCreateReservationButtonClick = () => {
    setShowCreate(true);
    setFetchListData(false);
  };

  const onSuccessCreateReservation = () => {
    setShowCreate(false);
    setFetchListData(true);
  };

  useEffect(()=>{
    setChangeAlignment(userContextData.selectedLanguage === "en" ? "left" : "right");
  }, [userContextData.selectedLanguage]);

  return (
    <ConfigProvider direction={changeAlignment === "right" ? "rtl" : "ltr"}>
    <ContainerDiv>
      <div className="overflow-hidden mx-2">
        <div className={"float-" + (changeAlignment === "right" ? "right" : "left")}>
        <TitleComponent title={t("reservation-component-title")} />
        </div>
        <div className={"select-status float-" + (changeAlignment === "right" ? "left d-flex flex-row-reverse" : "right")}>
          {view === "list" ? (
            // <Button
            //   className="reservation-create-btn"
            //   type="text"
            //   icon={
            //     <img
            //       src={PlusIcon}
            //       alt=""
            //       style={{
            //         width: '10px',
            //         marginRight: '5px',
            //       }}
            //     />
            //   }
            //   size="medium"
            //   onClick={onCreateReservationButtonClick}
            // >
            //   Create New Reservation
            // </Button>


            <Button className="mr-4 ml-3 mt-3"
              onClick={onCreateReservationButtonClick}
              icon={
                <img src={PlusIcon} alt=""
                  style={{
                    width: "10px",
                    marginRight: "5px",
                  }}
                />
              }
              style={{
                background: "#8D131E",
                border: "#8D131E",
                borderRadius: "5px",
              }}
            >
              <span style={{ color: "#fff", marginRight: "5px" }}>{t("reservation-component-button-text")}</span>
            </Button>
          ) : null}
          <select className={changeAlignment === "right" ? "select-option-calendar-rtl text-right" : "select-option-calendar"}
          onChange={viewChangeHandler}>
            <option value="calendar">{t("reservation-component-select-option-1")}</option>
            <option value="list">{t("reservation-component-select-option-2")}</option>
          </select>
        </div>
      </div>
      


      <div className={"overflow-auto p-4 dashboard-box-shadow" + (changeAlignment === "right" ? " responsive-direction" : "")}>
        {view === "list" ? (
          <ReserVationListComponent fetchListData={fetchListData} />
        ) : (
          <div className="d-block mt-5">
          <ReservationCalendarComponent fetchListData={fetchListData} />
          </div>
        )}
        {/* {view === "calendar" && <ReservationCalendarComponent />} */}
      </div>
      <div className="modal-text">
        <Modal show={showCreate} onHide={onhideModal} centered="true">
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="ml-3">
                <div className="title-with-rfq-id">
                  {t("create-reservation-modal-title-create")}
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-text ml-3">
              <>
                <ReservationCreateModal
                  showCreate={setShowCreate}
                  confirmCallback={onSuccessCreateReservation}
                  mode="CREATE"
                />
              </>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </ContainerDiv>
    </ConfigProvider>
  );
};

export default ReservationComponent;
