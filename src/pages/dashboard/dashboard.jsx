import React, { useContext, useEffect, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import SubscriptionComponent from "../../components/subscription/subscription.component";
import PaymentHistoryComponent from "../../components/payHistory/paymentHistory.component";
import UpdateProfileComponent from "../../components/updateProfile/updateProfile.component";
import PaymentComponent from "../../components/payment/payment.component";
import ReservationComponent from "../../components/reservation/reservation.component";
import DashboardComponent from "../../components/dashboard/dashboard.component";
import UpdatePasswordComponent from "../../components/updatePassword/updatePassword.component";
import ReviewsAndRatingsComponent from "../../components/reviewsAndRatings/reviewsAndRatings.component";
import UnderDevelopmentComponent from "../../shared/component/under-development-page/under-development";
import RFQsComponent from "../../components/rfqs/rfqs.component";
import Sidebar from "../../container/Sidebar";
import { Route, Switch } from "react-router-dom";
import MakeQuotationComponent from "../../components/rfqs/make-quotation.component";
import QuotationComponent from "../../components/quotation/quotation.component";
import { useHistory } from "react-router-dom";
import "./css/dashboard.css";
import "./css/main.css";
import "../../i18n/i18n_config";
import SidebarRight from "../../container/SidebarRight";
import { NavLink } from "react-router-dom";
import ArrowDown from "../../assets/icons/arrow-down.svg";
import ArrowDownWhite from "../../assets/icons/arrow-down-white.svg";
import ArrowUp from "../../assets/icons/arrow-up.svg";
import ArrowUpWhite from "../../assets/icons/arrow-up-white.svg";
import { LanguageContext } from "../login/login";
import LogoutIcon from "../../assets/icons/logout.svg";
import CompanyImage from "../../assets/images/company-pic.svg";
import { getData } from "../../shared/http-request-handler";
export const UserContext = React.createContext();

const Header = React.lazy(() => import("../../container/Header"));

const Dashboard = () => {
  const contextType = LanguageContext;
  const userContextData = useContext(UserContext);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [sidebarHide, setSidebarHide] = useState(false);
  const [plan, setPlan] = useState();
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [lang, setLang] = useState(contextType._currentValue.currentLanguage);
  const [subscriptionStatus, setSubscriptionStatus] = useState("0");
  const [mediaNumber, setMediaNumber] = useState(0);
  const [mediaSize, setMediaSize] = useState(0);
  const [adminPrivileges, setAdminPrivileges] = useState("False");
  const [availableReservation, setAvailableReservation] = useState("False");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSubscriptionMenu, setShowSubscriptionMenu] = useState(false);
  const [currentPath, setCurrentPath] = useState("/dashboard");
  // const [adminPrivileges, setAdminPrivileges] = useState('False');
  const [profilePhoto, setProfilePhoto] = useState();
  const [companyName, setCompanyName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const history = useHistory();

  const sidebarHideShow = () => {
    setSidebarHide(!sidebarHide);
  };

  const setProviderValue = () => {
    setPlan(localStorage.getItem("subscription_plan"));
    setToken(localStorage.getItem("token"));
    setUserId(localStorage.getItem("id"));
    setSubscriptionStatus(localStorage.getItem("Subscription_status"));
    setMediaNumber(localStorage.getItem("media_number"));
    setMediaSize(localStorage.getItem("media_size"));
    setAdminPrivileges(localStorage.getItem("is_admin_privileges"));
    setAvailableReservation(localStorage.getItem("is_available_reservation"));
    
  };

  const fetchProfileDate = () => {
    getData(
      process.env.REACT_APP_PROFILE_GET_URL + "/" + localStorage.getItem("id"),
      localStorage.getItem("token")
    )
      .then((res) => {
        if (res.data.company_name) {
          setCompanyName(res.data.company_name);
        }
        if (res.data.profile_photo) {
          setImageUrl(
            res.data.profile_photo ? res.data.profile_photo : CompanyImage
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const changeLanguage = (data) => {
    setLang(data);
    i18n.changeLanguage(data);
  };

  const logout = () => {
    localStorage.clear();
    history.push("/login");
  };

  const [navClass, setNavClass] = useState("topnav");
  const myNavFunction = () => {
    if (navClass === "topnav") {
      setNavClass("topnav responsive");
    } else {
      setNavClass("topnav");
    }
    // console.log(navClass);

    // var x = document.getElementById("myTopnav");
    // if (x.className === "topnav") {
    //   x.className += " responsive";
    // } else {
    //   x.className = "topnav";
    // }
  };

  useEffect(() => {
    // console.log('Dashboard Use Effect ----- ');
    setProviderValue();
    fetchProfileDate();
    // console.log("profilePhoto:: " + profilePhoto);
  }, []);
  return (
    <>
      {token && plan && userId ? (
        <UserContext.Provider
          value={{
            token: token,
            plan: plan,
            userId: userId,
            selectedLanguage: lang,
            subscriptionStatus: subscriptionStatus,
            subscriptionPlan: subscriptionStatus,
            mediaNumber: mediaNumber,
            mediaSize: mediaSize,
            adminPrivileges: adminPrivileges,
            availableReservation: availableReservation,
            onChangeSetProviderValue: setProviderValue,
            //set vendor_id
          }}
        >
          <div className="overflow-hidden">
            <div>
              <Suspense fallback={<div></div>}>
                <Header languageChangeHandler={changeLanguage} click={logout} />
              </Suspense>
            </div>
            <div className="top-navbar-margin show-navbar">
              <div className={navClass} id="myTopnav">
                {subscriptionStatus === "1" ? (
                  <>
                    <a href="#home">&nbsp;</a>
                    <a
                      href="#home"
                      class={currentPath === "/dashboard" ? "active" : ""}
                    >
                      <NavLink
                        exact
                        to="/dashboard"
                        activeClassName="selected"
                        isActive={(m, l) => {
                          setCurrentPath(l.pathname);
                        }}
                      >
                        <span
                          className={
                            currentPath === "/dashboard"
                              ? "active-nav-text"
                              : ""
                          }
                        >
                          {t("navbar-dashboard-text")}
                        </span>
                      </NavLink>
                    </a>
                    <a onClick={() => setShowProfileMenu(!showProfileMenu)}>
                      <span
                        className={
                          currentPath == "/dashboard/update-details" ||
                          currentPath == "/dashboard/update-password"
                            ? "active-nav-text"
                            : ""
                        }
                      >
                        {t("navbar-manage-profile-text")}
                      </span>
                      <img
                        src={
                          showProfileMenu
                            ? currentPath == "/dashboard/update-details" ||
                              currentPath == "/dashboard/update-password"
                              ? ArrowUp
                              : ArrowUp
                            : currentPath == "/dashboard/update-details" ||
                              currentPath == "/dashboard/update-password"
                            ? ArrowDown
                            : ArrowDown
                        }
                        className="nav-arrow-icon"
                      />
                    </a>
                    <div className={showProfileMenu ? "" : "d-none"}>
                      <a>
                        <NavLink
                          exact
                          to="/dashboard/update-details"
                          activeClassName="selected"
                          isActive={(m, l) => {
                            setCurrentPath(l.pathname);
                          }}
                        >
                          <span
                            className={
                              currentPath === "/dashboard/update-details"
                                ? "active-nav-text"
                                : ""
                            }
                          >
                            {t("navbar-update-details-text")}
                          </span>
                        </NavLink>
                      </a>
                      <a>
                        <NavLink
                          exact
                          to="/dashboard/update-password"
                          activeClassName="selected"
                          isActive={(m, l) => {
                            setCurrentPath(l.pathname);
                          }}
                        >
                          <span
                            className={
                              currentPath === "/dashboard/update-password"
                                ? "active-nav-text"
                                : ""
                            }
                          >
                            {t("navbar-update-password-text")}
                          </span>
                        </NavLink>
                      </a>
                    </div>
                    <a>
                      <NavLink
                        exact
                        to="/dashboard/rfqs"
                        activeClassName="selected"
                        isActive={(m, l) => {
                          setCurrentPath(l.pathname);
                        }}
                      >
                        <span
                          className={
                            currentPath === "/dashboard/rfqs"
                              ? "active-nav-text"
                              : ""
                          }
                        >
                          {t("navbar-rfqs-text")}
                        </span>
                      </NavLink>
                    </a>
                    <a href="#contact">
                      <NavLink
                        exact
                        to="/dashboard/quotation"
                        activeClassName="selected"
                        isActive={(m, l) => {
                          setCurrentPath(l.pathname);
                        }}
                      >
                        <span
                          className={
                            currentPath === "/dashboard/quotation"
                              ? "active-nav-text"
                              : ""
                          }
                        >
                          {t("navbar-quotation-text")}
                        </span>
                      </NavLink>
                    </a>
                    <a>
                      <NavLink
                        exact
                        to="/dashboard/reservation"
                        activeClassName="selected"
                        isActive={(m, l) => {
                          setCurrentPath(l.pathname);
                        }}
                      >
                        <span
                          className={
                            currentPath === "/dashboard/reservation"
                              ? "active-nav-text"
                              : ""
                          }
                        >
                          {t("navbar-reservation-text")}
                        </span>
                      </NavLink>
                    </a>
                    <a>
                      <NavLink
                        exact
                        to="/dashboard/review"
                        activeClassName="selected"
                        isActive={(m, l) => {
                          setCurrentPath(l.pathname);
                        }}
                      >
                        <span
                          className={
                            currentPath === "/dashboard/review"
                              ? "active-nav-text"
                              : ""
                          }
                        >
                          {t("navbar-review-text")}
                        </span>
                      </NavLink>
                    </a>
                  </>
                ) : null}
                {/* -------------------------------------- */}

                <a
                  onClick={() => setShowSubscriptionMenu(!showSubscriptionMenu)}
                >
                  <span
                    className={
                      currentPath == "/dashboard/subscribe" ||
                      currentPath == "/dashboard/payment-history"
                        ? "active-nav-text"
                        : ""
                    }
                  >
                    {t("navbar-subscription-text")}
                  </span>
                  <img
                    src={
                      showSubscriptionMenu
                        ? currentPath == "/dashboard/subscribe" ||
                          currentPath == "/dashboard/payment-history"
                          ? ArrowUp
                          : ArrowUp
                        : currentPath == "/dashboard/subscribe" ||
                          currentPath == "/dashboard/payment-history"
                        ? ArrowDown
                        : ArrowDown
                    }
                    className="nav-arrow-icon"
                  />
                </a>
                <div className={showSubscriptionMenu ? "" : "d-none"}>
                  <a>
                    <NavLink
                      exact
                      to="/dashboard/subscribe"
                      activeClassName="selected"
                      isActive={(m, l) => {
                        setCurrentPath(l.pathname);
                      }}
                    >
                      <span
                        className={
                          currentPath === "/dashboard/subscribe"
                            ? "active-nav-text"
                            : ""
                        }
                      >
                        {subscriptionStatus == "1"
                          ? t("navbar-subscribe-status-text")
                          : t("navbar-subscribe-text")}
                      </span>
                    </NavLink>
                  </a>
                  {/* ----------------------------------- */}
                  {subscriptionStatus === "1" ? (
                    <a>
                      <NavLink
                        exact
                        to="/dashboard/payment-history"
                        activeClassName="selected"
                        isActive={(m, l) => {
                          setCurrentPath(l.pathname);
                        }}
                      >
                        <span
                          className={
                            currentPath === "/dashboard/payment-history"
                              ? "active-nav-text"
                              : ""
                          }
                        >
                          {t("navbar-payment-history-text")}
                        </span>
                      </NavLink>
                    </a>
                  ) : null}

                  {/* ----------------------------------- */}
                </div>

                <a>
                  <div className="d-flex justify-content-center circle-icon-margin">
                    <div className="circle-icon">
                      <img
                        src={imageUrl}
                        alt="Company Logo"
                        style={{
                          height: "80px",
                          width: "80px",
                          borderRadius: "50%",
                        }}
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

                  {/* <NavLink
                    exact
                    to="/dashboard/rfqs"
                    activeClassName="selected"
                    isActive={(m, l) => {
                      setCurrentPath(l.pathname);
                    }}
                  >
                    <span
                      className={
                        currentPath === "/dashboard/rfqs"
                          ? "active-nav-text"
                          : ""
                      }
                    >
                      {t("navbar-rfqs-text")}
                    </span>
                  </NavLink> */}
                </a>

                <a className="icon" onClick={() => myNavFunction()}>
                  <i
                    className={
                      navClass === "topnav" ? "fa fa-bars" : "fa fa-times"
                    }
                  ></i>
                </a>
              </div>
            </div>

            <div>
              <div className={lang === "en" ? "sidebar-show-hide" : "d-none"}>
                <Sidebar
                  subscriptionStatus={subscriptionStatus}
                  profilePhoto={profilePhoto}
                  companyName={companyName}
                />
              </div>
              <div
                className={
                  lang === "en" ? "content-margin" : "content-margin-right"
                }
              >
                <div className="container-fluid">
                  <Switch>
                    <Route
                      exact
                      path="/dashboard"
                      component={DashboardComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/subscribe"
                      component={SubscriptionComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/payment-history"
                      component={PaymentHistoryComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/update-details"
                      render={() => (
                        <UpdateProfileComponent
                          setProfilePhoto={setProfilePhoto}
                          setCompanyName={setCompanyName}
                        />
                      )}
                      // render={() => <UpdateProfileComponent myCallback={setProfilePhoto}}
                      // component={UpdateProfileComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/update-password"
                      // component={UnderDevelopmentComponent}
                      component={UpdatePasswordComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/reservation"
                      // component={UnderDevelopmentComponent}
                      component={ReservationComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/rfqs"
                      component={RFQsComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/quotation"
                      component={QuotationComponent}
                      // component={UnderDevelopmentComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/review"
                      component={ReviewsAndRatingsComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/payment/:id"
                      component={PaymentComponent}
                    />
                    <Route
                      exact
                      path="/dashboard/rfq/make-quotation/:rfqId"
                      component={MakeQuotationComponent}
                    />
                  </Switch>
                </div>
              </div>

              <div className={lang !== "en" ? "sidebar-show-hide" : "d-none"}>
                <SidebarRight
                  subscriptionStatus={subscriptionStatus}
                  profilePhoto={profilePhoto}
                  companyName={companyName}
                />
              </div>
            </div>
          </div>
        </UserContext.Provider>
      ) : null}{" "}
    </>
  );
};

export default Dashboard;
