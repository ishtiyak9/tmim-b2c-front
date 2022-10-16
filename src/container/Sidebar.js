import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import LogoutIcon from "../assets/icons/logout.svg";
import DashboardIcon from "../assets/icons/sidebar_dashboard.svg";
import DashboardWhiteIcon from "../assets/icons/sidebar_dashboard_white.svg";
import ReservationIcon from "../assets/icons/sidebar_reservation.svg";
import ReservationWhiteIcon from "../assets/icons/sidebar_reservation_white.svg";
import QuotationIcon from "../assets/icons/sidebar_quotation.svg";
import QuotationWhiteIcon from "../assets/icons/sidebar_quotation_white.svg";
import RfqIcon from "../assets/icons/sidebar_rfq.svg";
import RfqWhiteIcon from "../assets/icons/sidebar_rfq_white.svg";
import RatingIcon from "../assets/icons/sidebar_rating.svg";
import RatingWhiteIcon from "../assets/icons/sidebar_rating_white.svg";
import SubscriptionIcon from "../assets/icons/sidebar_subscription.svg";
import SubscriptionWhiteIcon from "../assets/icons/sidebar_subscription_white.svg";
import ProfileIcon from "../assets/icons/sidebar_profile.svg";
import ProfileWhiteIcon from "../assets/icons/sidebar_profile_white.svg";
import UpdateDetailsIcon from "../assets/icons/sidebar_update_details.svg";
import UpdateDetailsRedIcon from "../assets/icons/sidebar_update_details_white.svg";
import UpdatePasswordIcon from "../assets/icons/sidebar_update_password.svg";
import UpdatePasswordRedIcon from "../assets/icons/sidebar_update_password_white.svg";
import PaymentHistoryIcon from "../assets/icons/sidebar_payment_history.svg";
import PaymentHistoryRedIcon from "../assets/icons/sidebar_payment_history_red.svg";
import SubscribeIcon from "../assets/icons/sidebar_subscribe.svg";
import SubscribeRedIcon from "../assets/icons/sidebar_subscribe_red.svg";
import ArrowDown from "../assets/icons/arrow-down.svg";
import ArrowDownWhite from "../assets/icons/arrow-down-white.svg";
import ArrowUp from "../assets/icons/arrow-up.svg";
import ArrowUpWhite from "../assets/icons/arrow-up-white.svg";
import { UserContext } from "../pages/dashboard/dashboard";
import { getData } from "../shared/http-request-handler";
import "./Sidebar.css";
import { useHistory } from "react-router-dom";
import { clearLocalStorage } from "../shared/utility/utility";
import CompanyImage from "../assets/images/company-pic.svg";

const Sidebar = (props) => {
  const userContextData = useContext(UserContext);
  const history = useHistory();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [serviceClass, setActive] = useState(false);
  const [featureClass, setFeatureClass] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [currentPath, setCurrentPath] = useState("/dashboard");

  const handleFeatureToggle = () => {
    setFeatureClass(!featureClass);
  };
  const handleServiceToggle = () => {
    setActive(!serviceClass);
  };

  const logout = () => {
    clearLocalStorage();
    history.push("/login");
    
  };

  const onCLickCheckAuth = () => {
    if(!localStorage.getItem('currentUser')){
      history.push("/login");
    }
  }


  const fetchProfileDate = () => {
    getData(
      process.env.REACT_APP_PROFILE_GET_URL + "/" + userContextData.userId,
      userContextData.token
    )
      .then((res) => {        
        // setCompanyName(res.data.company_name);
        // setImageUrl(res.data.profile_photo);
        if (!props.companyName) {
          setCompanyName(res.data.company_name);
        }
        if (!props.profilePhoto) {
          setImageUrl(res.data.profile_photo ? res.data.profile_photo : CompanyImage);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // console.log(props.profilePhoto);
    setImageUrl(props.profilePhoto);
    setCompanyName(props.companyName);
    // console.log(
    //   "Sidebar re-render called ------ ====== ",
    //   props.subscriptionStatus,
    //   userContextData.subscriptionStatus
    // );
    fetchProfileDate();
  }, [props.subscriptionStatus, props.profilePhoto, props.companyName]);

  const content = (
    <nav className="sidebar" onClick={onCLickCheckAuth}>
      <div>
        <ul>
          {userContextData.subscriptionStatus === "1" ? (
            <>
              <li className="d-none">
                <span
                  className={
                    "left-border d-inline" +
                    (currentPath == "/dashboard" ? " active-left-border " : "")
                  }
                >
                  &nbsp;
                </span>
                <div className="d-inline pl-3 flex-grow-1">
                  <NavLink
                    exact
                    to="/dashboard"
                    activeClassName="selected"
                    isActive={(m, l) => {
                      setCurrentPath(l.pathname);
                    }}
                  >
                    <img
                      src={
                        currentPath == "/dashboard"
                          ? DashboardWhiteIcon
                          : DashboardIcon
                      }
                      width="25"
                      height="25"
                      className="pr-2"
                    />
                    {t("navbar-dashboard-text")}
                  </NavLink>
                </div>
              </li>
              <li
                className={
                  "active d-flex ml-3" +
                  (currentPath == "/dashboard" ? " selected " : "")
                }
              >
                <span
                  className={
                    "left-border d-inline" +
                    (currentPath == "/dashboard" ? " active-left-border " : "")
                  }
                >
                  &nbsp;
                </span>
                <div className="d-inline pl-3 flex-grow-1">
                  <NavLink exact to="/dashboard" activeClassName="selected">
                    <img
                      src={
                        currentPath == "/dashboard"
                          ? DashboardWhiteIcon
                          : DashboardIcon
                      }
                      width="25"
                      height="25"
                      className="pr-2"
                    />
                    {t("navbar-dashboard-text")}
                  </NavLink>
                </div>
              </li>
              <li
                className={
                  "active d-flex ml-3" +
                  (currentPath == "/dashboard/update-details" ||
                  currentPath == "/dashboard/update-password"
                    ? " selected "
                    : "")
                }
              >
                <span
                  className={
                    "left-border d-inline" +
                    (currentPath == "/dashboard/update-details" ||
                    currentPath == "/dashboard/update-password"
                      ? " active-left-border "
                      : "")
                  }
                >
                  &nbsp;
                </span>
                <a
                  href="#"
                  className={
                    "serv-btn" +
                    (currentPath == "/dashboard/update-details" ||
                    currentPath == "/dashboard/update-password"
                      ? " selected-text-color-white "
                      : "")
                  }
                  onClick={handleServiceToggle}
                >
                  <img
                    src={
                      currentPath == "/dashboard/update-details" ||
                      currentPath == "/dashboard/update-password"
                        ? ProfileWhiteIcon
                        : ProfileIcon
                    }
                    width="18"
                    height="18"
                    className="ml-3 mr-2"
                  />
                  {t("navbar-manage-profile-text")}
                  {/* <span className="fa fa-caret-down second"></span> */}
                  <img
                    src={
                      serviceClass
                        ? currentPath == "/dashboard/update-details" ||
                          currentPath == "/dashboard/update-password"
                          ? ArrowUpWhite
                          : ArrowUp
                        : currentPath == "/dashboard/update-details" ||
                          currentPath == "/dashboard/update-password"
                        ? ArrowDownWhite
                        : ArrowDown
                    }
                    className="arrow-icon"
                  />
                </a>
              </li>
              <ul className={"serv-show" + (serviceClass ? " show1" : "")}>
                <li className={"active d-flex ml-3"}>
                  <span className={"dropdown-left-border d-inline"}>
                    &nbsp;
                  </span>
                  <div className="d-inline pl-3 flex-grow-1">
                    <NavLink
                      exact
                      to="/dashboard/update-details"
                      activeClassName="dropdown-selected"
                    >
                      <img
                        src={
                          currentPath == "/dashboard/update-details"
                            ? UpdateDetailsRedIcon
                            : UpdateDetailsIcon
                        }
                        width="18"
                        height="18"
                        className="ml-1 mr-2"
                      />
                      {t("navbar-update-details-text")}
                    </NavLink>
                  </div>
                </li>

                <li className={"active d-flex ml-3"}>
                  <span className={"dropdown-left-border d-inline"}>
                    &nbsp;
                  </span>
                  <div className="d-inline pl-3 flex-grow-1">
                    <NavLink
                      exact
                      to="/dashboard/update-password"
                      activeClassName="dropdown-selected"
                    >
                      <img
                        src={
                          currentPath == "/dashboard/update-password"
                            ? UpdatePasswordRedIcon
                            : UpdatePasswordIcon
                        }
                        width="18"
                        height="18"
                        className="ml-1 mr-2"
                      />
                      {t("navbar-update-password-text")}
                    </NavLink>
                  </div>
                </li>
              </ul>
              <li
                className={
                  "active d-flex ml-3" +
                  (currentPath == "/dashboard/rfqs" ? " selected " : "")
                }
              >
                <span
                  className={
                    "left-border d-inline" +
                    (currentPath == "/dashboard/rfqs"
                      ? " active-left-border "
                      : "")
                  }
                >
                  &nbsp;
                </span>
                <div className="d-inline pl-3 flex-grow-1">
                  <NavLink to="/dashboard/rfqs" activeClassName="selected">
                    <img
                      src={
                        currentPath == "/dashboard/rfqs"
                          ? RfqWhiteIcon
                          : RfqIcon
                      }
                      width="25"
                      height="25"
                      className="pr-2"
                    />
                    {t("navbar-rfqs-text")}
                  </NavLink>
                </div>
              </li>
              <li
                className={
                  "active d-flex ml-3" +
                  (currentPath == "/dashboard/quotation" ? " selected " : "")
                }
              >
                <span
                  className={
                    "left-border d-inline" +
                    (currentPath == "/dashboard/quotation"
                      ? " active-left-border "
                      : "")
                  }
                >
                  &nbsp;
                </span>
                <div className="d-inline pl-3 flex-grow-1">
                  <NavLink to="/dashboard/quotation" activeClassName="selected">
                    <img
                      src={
                        currentPath == "/dashboard/quotation"
                          ? QuotationWhiteIcon
                          : QuotationIcon
                      }
                      width="28"
                      height="28"
                      className="pr-2"
                    />
                    {t("navbar-quotation-text")}
                  </NavLink>
                </div>
              </li>
              <li
                className={
                  "active d-flex ml-3" +
                  (currentPath == "/dashboard/reservation" ? " selected " : "")
                }
              >
                <span
                  className={
                    "left-border d-inline" +
                    (currentPath == "/dashboard/reservation"
                      ? " active-left-border "
                      : "")
                  }
                >
                  &nbsp;
                </span>
                <div className="d-inline pl-3 flex-grow-1">
                  <NavLink
                    to="/dashboard/reservation"
                    activeClassName="selected"
                  >
                    <img
                      src={
                        currentPath == "/dashboard/reservation"
                          ? ReservationWhiteIcon
                          : ReservationIcon
                      }
                      width="25"
                      height="25"
                      className="pr-2"
                    />
                    {t("navbar-reservation-text")}
                  </NavLink>
                </div>
              </li>
              <li
                className={
                  "active d-flex ml-3" +
                  (currentPath == "/dashboard/review" ? " selected " : "")
                }
              >
                <span
                  className={
                    "left-border d-inline" +
                    (currentPath == "/dashboard/review"
                      ? " active-left-border "
                      : "")
                  }
                >
                  &nbsp;
                </span>
                <div className="d-inline pl-3 flex-grow-1">
                  <NavLink to="/dashboard/review" activeClassName="selected">
                    <img
                      src={
                        currentPath == "/dashboard/review"
                          ? RatingWhiteIcon
                          : RatingIcon
                      }
                      width="25"
                      height="25"
                      className="pr-2"
                    />
                    {t("navbar-review-text")}
                  </NavLink>
                </div>
              </li>
            </>
          ) : null}

          {/* --------------------------------------------- */}

          <li
            className={
              "active d-flex ml-3" +
              (currentPath == "/dashboard/subscribe" ||
              currentPath == "/dashboard/payment-history"
                ? " selected "
                : "")
            }
          >
            <span
              className={
                "left-border d-inline" +
                (currentPath == "/dashboard/subscribe" ||
                currentPath == "/dashboard/payment-history"
                  ? " active-left-border "
                  : "")
              }
            >
              &nbsp;
            </span>
            <a
              href="#"
              className={
                "feat-btn" +
                (currentPath == "/dashboard/subscribe" ||
                currentPath == "/dashboard/payment-history"
                  ? " selected-text-color-white "
                  : "")
              }
              onClick={handleFeatureToggle}
            >
              <img
                src={
                  currentPath == "/dashboard/subscribe" ||
                  currentPath == "/dashboard/payment-history"
                    ? SubscriptionWhiteIcon
                    : SubscriptionIcon
                }
                width="18"
                height="18"
                className="ml-3 mr-2"
              />
              {t("navbar-subscription-text")}
              {/* <span className="fa fa-caret-down first"></span> */}

              <img
                src={
                  featureClass
                    ? currentPath == "/dashboard/subscribe" ||
                      currentPath == "/dashboard/payment-history"
                      ? ArrowUpWhite
                      : ArrowUp
                    : currentPath == "/dashboard/subscribe" ||
                      currentPath == "/dashboard/payment-history"
                    ? ArrowDownWhite
                    : ArrowDown
                }
                className="arrow-icon"
              />
            </a>
          </li>
          <ul className={"feat-show" + (featureClass ? " show" : "")}>
            <li
              className={
                "active d-flex ml-3" +
                (currentPath == "/dashboard/subscribe"
                  ? " dropdown-selected "
                  : "")
              }
            >
              <span className={"dropdown-left-border d-inline"}>&nbsp;</span>
              <div className="d-inline pl-3 flex-grow-1">
                <NavLink
                  exact
                  to="/dashboard/subscribe"
                  activeClassName="dropdown-selected"
                >
                  <img
                    src={
                      currentPath == "/dashboard/subscribe"
                        ? SubscribeRedIcon
                        : SubscribeIcon
                    }
                    width="18"
                    height="18"
                    className="ml-1 mr-2"
                  />
                  {userContextData.subscriptionStatus == "1"
                    ? t("navbar-subscribe-status-text")
                    : t("navbar-subscribe-text")}
                </NavLink>
              </div>
            </li>
            {userContextData.subscriptionStatus === "1" ? (
              <li
                className={
                  "active d-flex ml-3" +
                  (currentPath == "/dashboard/payment-history"
                    ? " dropdown-selected "
                    : "")
                }
              >
                <span className={"dropdown-left-border d-inline"}>&nbsp;</span>
                <div className="d-inline pl-3 flex-grow-1">
                  <NavLink
                    exact
                    to="/dashboard/payment-history"
                    activeClassName="dropdown-selected"
                  >
                    <img
                      src={
                        currentPath == "/dashboard/payment-history"
                          ? PaymentHistoryRedIcon
                          : PaymentHistoryIcon
                      }
                      width="18"
                      height="18"
                      className="ml-1 mr-2"
                    />
                    {t("navbar-payment-history-text")}
                  </NavLink>
                </div>
              </li>
            ) : null}
          </ul>
        </ul>
      </div>
      {userContextData.subscriptionStatus === "1" ? (
        <div>
          <div className="d-flex justify-content-center circle-icon-margin">
            <div className="circle-icon">
              <img
                src={imageUrl}
                alt="Company Logo"
                style={{ height: "120px", width: "120px", borderRadius: "50%" }}
                // style={{ height: "120px", width: "120px", borderRadius: "50%", cursor: "pointer" }}
                // onClick={() => history.push('/dashboard/update-details')}
              />
            </div>
          </div>

          <div className="mt-3 mx-2">
            <div className="d-flex justify-content-between">
              <p className="d-inline pt-3 ml-2">
                {companyName ? companyName : "Company Name"}
              </p>
              <img
                className="logout-icon"
                src={LogoutIcon}
                alt=""
                onClick={logout}
              />
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );

  return <div>{content}</div>;
};

export default Sidebar;
