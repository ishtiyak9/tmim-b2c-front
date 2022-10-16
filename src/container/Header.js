import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getData, putData } from "../shared/http-request-handler";
// import { messaging } from "../pages/login/login";
import { messaging } from "../components/dashboard/dashboard.component";
import { Popover } from "antd";
import SpinnerComponent from "../shared/component/spinner/spinner.component";

import NewNotificationIcon from "../assets/icons/notification.svg";
import NotificationIcon from "../assets/icons/Notification-2.svg";
import EnFlag from "../assets/icons/flag-en.svg";
import ArabicFlag from "../assets/images/flag-ua.svg";
import BrandLogo from "../assets/icons/brand_logo.svg";
import "./Header.css";
import { useHistory } from "react-router-dom";
import { CenterFocusStrong } from "@material-ui/icons";
import { LanguageContext } from "../pages/login/login";
export const notificationArr = [];
// const engFlagLoc = '/static/media/flag-en.f2b03646.svg';
// const engFlagLoc = "/static/media/flag-ua.6950ba3e.svg";
const engFlagLoc = "/static/media/flag-ua";    //Server icon url

// const engFlagLoc = "/static/media/flag-ua.6950ba3e.svg";    //Local icon url

const Header = (props) => {
  const contextType = LanguageContext;
  const { t } = useTranslation();
  const [flagType, setFlagType] = useState(
    contextType._currentValue.currentLanguage === "en" ? EnFlag : ArabicFlag
  );
  const [notificationContent, setNotificationContent] = useState();
  const [notificationCount, setNotificationCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [lang, setLang] = useState(
    LanguageContext._currentValue.currentLanguage
  );
  const [changeAlignment, setChangeAlignment] = useState(
    LanguageContext._currentValue.currentLanguage === "en" ? "left" : "right"
  );

  const getNotificationCount = () => {
    getData(
      process.env.REACT_APP_NOTIFICATION_LIST_URL,
      localStorage.getItem("token")
    )
      .then((res) => {
        setNotificationCount(res.data.count);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getNotificationList = () => {
    if (!visible) {
      setLoading(true);
      getData(
        process.env.REACT_APP_NOTIFICATION_LIST_URL,
        localStorage.getItem("token")
      )
        .then((res) => {
          setLoading(false);
          setNotificationCount(res.data.count);
          const data = (
            <div className="notification-content">
              <h3 className="notification-header">Notifications</h3>

              {res.data.notification_data.length > 0 ? (
                res.data.notification_data.map((n) => {
                  if (!n.is_read) {
                    return (
                      <a onClick={() => readNotification(n)}>
                        {/* */}
                        <div>
                          <p className="notification-content__info">
                            <div>
                              <div className="notification-content__info-title">
                                {n.title}
                              </div>
                              <div className="notification-content__info-title-body">
                                {n.body}
                              </div>
                              <span className="unread"></span>
                            </div>
                          </p>
                        </div>
                      </a>
                    );
                  } else {
                    return (
                      // <div>
                      //   <div>
                      //     <p className="notification-content__info">
                      //       <div className="notification-content__info-title">
                      //         {n.title}
                      //       </div>
                      //       <div className="notification-content__info-title-body">
                      //         {n.body}
                      //       </div>
                      //     </p>
                      //   </div>
                      // </div>

                      <a onClick={() => readNotification(n)}>
                        <div>
                          <p className="notification-content__info">
                            <div>
                              <div className="notification-content__info-title">
                                {n.title}
                              </div>
                              <div className="notification-content__info-title-body">
                                {n.body}
                              </div>
                            </div>
                          </p>
                        </div>
                      </a>
                    );
                  }
                })
              ) : (
                <div>
                  <p>No Data found</p>
                </div>
              )}
            </div>
          );
          setNotificationContent(data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setVisible(false);
    }
  };

  const readNotification = (n) => {
    if (!n.is_read) {
      putData(
        process.env.REACT_APP_READ_NOTIFICATION_URL + n.id,
        localStorage.getItem("token")
      )
        .then((res) => {
          getNotificationList();
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (n.notification_type === 1 || n.notification_type === 7) {
      history.push("/dashboard/rfqs");
    } else if (n.notification_type === 2 || n.notification_type === 6) {
      history.push("/dashboard/quotation");
    } else if (n.notification_type === 3 || n.notification_type === 4) {
      history.push("/dashboard/reservation");
    } else if (n.notification_type === 8) {
      history.push("/dashboard/review");
    }
    setVisible(false);
    // setNotificationVisible(false);
  };

  const handleVisibleChange = (visibility) => {
    setVisible(visibility);
    if (!visibility) {
      setNotificationContent(
        <div>
          <SpinnerComponent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "100px",
            }}
          />
        </div>
      );
    }
  };

  messaging.onMessage((payload) => {
    setNotificationCount((prevCount) => prevCount + 1);
  });

  const languageChangeHandler = (e) => {
    props.languageChangeHandler(e.target.value);
    if (e.target.value === "en") {
      setFlagType(EnFlag);
      setLang(e.target.value);
      contextType._currentValue.currentLanguage = e.target.value;
      setChangeAlignment("left");
    } else {
      setFlagType(ArabicFlag);
      setLang(e.target.value);
      contextType._currentValue.currentLanguage = e.target.value;
      setChangeAlignment("right");
    }
  };

  useEffect(() => {
    setNotificationContent(
      <div>
        <SpinnerComponent
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "60px",
          }}
        />
      </div>
    );
    getNotificationCount();
  }, []);

  return (
    <div dir={flagType.includes(engFlagLoc) ? "rtl" : "ltr"}>
      <div className="header-box header-shadow fixed-top">
        <div
          className={
            "d-inline " +
            (flagType.includes(engFlagLoc) ? "float-right" : "float-left")
          }
        >
          <img src={BrandLogo} />
        </div>

        <div
          className={
            flagType.includes(engFlagLoc) ? "header-right float-left" : "float-right"
          }
        >
          <div className="d-inline">
            <div
              className="d-inline"
              style={{
                marginLeft: "20px",
                clear: "both",
                whiteSpace: "nowrap",
              }}
            >
              <Popover
                // className="notification-popover"
                placement="bottom"
                trigger="click"
                // overlayStyle={{
                //   width: '54vh',
                // }}
                overlayClassName="overlayCustomClass"
                content={notificationContent}
                visible={visible}
                onVisibleChange={handleVisibleChange}
              >
                {notificationCount > 0 ? (
                  <img
                    className="mr-4"
                    src={NewNotificationIcon}
                    alt="Notification"
                    onClick={getNotificationList}
                  />
                ) : (
                  <img
                    className="mr-4"
                    src={NotificationIcon}
                    alt="Notification"
                    onClick={getNotificationList}
                  />
                )}
              </Popover>
            </div>
          </div>

          <div
            className={
              "d-inline " + (flagType.includes(engFlagLoc) ? "select-div" : "")
            }
          >
            <img
              src={flagType}
              alt="En flag"
              style={{
                marginRight: "0.4rem",
                height: "35px",
                width: "35px",
                borderRadius: "10px",
              }}
            />
            <select
              style={
                {
                  // outline: 'none'
                }
              }
              aria-label="Default select lsnguage"
              value={lang}
              onChange={languageChangeHandler}
            >
              <option value="en" selected>
                {t("language-en")}
              </option>
              <option value="arab">{t("language-arabic")}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
