import { useState, useContext, useEffect } from "react";
import PremiumSubscriptionImage from "../../assets/images/premium-package-img.svg";
import PremiumSubscriptionLogo from "../../assets/images/permium-subscription-logo.svg";
import CheckedLogo from "../../assets/icons/checkmark.svg";
import ContainerDiv from "../../container/container-div";
import TitleComponent from "../../shared/component/title.component";
import { UserContext } from "../../pages/dashboard/dashboard";
import { showErrorDialog } from "../../shared/utility/utility";
import ButtonComponent from "../../shared/component/button/button.component";
import {
  getData,
  paymentRequestData,
  deleteData,
  putData,
} from "../../shared/http-request-handler";
import { v4 as uuidv4 } from "uuid";
import "./css/subscription.css";
import SpinnerComponent from "../../shared/component/spinner/spinner.component";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import Moment from "react-moment";

const SubscriptionComponent = () => {
  const { t } = useTranslation();
  const [plan, setPlan] = useState({});
  const [currentPlan, setCurrentPlan] = useState({});
  const userContextData = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const uuid = uuidv4();
  const history = useHistory();

  /**
   * Fetch Plan List
   */
  const fetchPlan = () => {
    setLoading(true);
    getData(process.env.REACT_APP_SUBSCRIPTION_PLAN_URL, userContextData.token)
      .then((res) => {
        // console.log('fetch plan res------------',res);
        setLoading(false);
        res.forEach((element) => {
          if (element.subscription_plan === "premium") {
            setPlan(element);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchCurrentPlan = () => {
    setLoading(true);
    getData(
      process.env.REACT_APP_CURRENT_SUBSCRIPTION_PLAN_URL,
      userContextData.token
    )
      .then((res) => {
        setLoading(false);
        // console.log('fetch current plan res------------',res);
        setCurrentPlan(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleProceed = (event) => {
    event.preventDefault();
    if (!plan) {
      showErrorDialog("No plan found !!!");
    } else {
      // Request body
      const reqData = {
        profile_id: process.env.REACT_APP_PAYMENT_PROFILE_ID,
        tran_type: "sale",
        tran_class: "ecom",
        cart_id: uuid,
        cart_currency: "SAR",
        cart_amount: plan.fees,
        paypage_lang: "en",
        hide_shipping: true,
        /**
         * Important Note !!!
         * cart description data format is fixed , please don't change the format
         * format is === "{'id':'6', 'plan': '2', 'fees': '2500.00'}"
         *  If needed, then also change backend code to parse new data format
         */
        cart_description: `{'id':'${userContextData.userId}', 'plan': '${plan.id}', 'fees': '${plan.fees}'}`,

        /**
         * Todo
         * Replace Customer details from env file whenever it is final
         */
        customer_details: {
          name: "Mostafizur Rahman",
          email: "moudud@batworld.com",
          phone: "01765458095",
          street1: "Dhaka",
          city: "Dhaka",
          state: "Dhaka",
          country: "BD",
          zip: "1207",
          ip: "1.1.1.1",
        },

        /**
         * Callback is for server-server communication
         * after successfull payment paytabs will post data at defined callback url
         */
        callback: process.env.REACT_APP_PAYMENT_CALLBACK_API_URL,

        /**
         * return url is after payment where paytabs should return
         */
        return: `http://${window.location.host}/dashboard/payment/${uuid}`,
      };
      paymentRequestData(
        process.env.REACT_APP_PAYMENT_API_URL,
        process.env.REACT_APP_PAYMENT_SERVER_KEY,
        reqData
      )
        .then((data) => {
          window.location.replace(data.data.redirect_url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleFreeSubscription = (event) => {
    event.preventDefault();
    getData(
      process.env.REACT_APP_FREE_SUBSCRIPTION_URL + userContextData.userId,
      userContextData.token
    )
      .then((res) => {
        localStorage.setItem(
          "Subscription_status",
          res.data.Subscription_status
        );
        localStorage.setItem("payment_status", String(res.data.payment_status));
        localStorage.setItem(
          "subscription_plan",
          String(res.Subscriptions_plan_info.subscription_plan)
        );
        Swal.fire({
          title: "Free Subscription !!!",
          confirmButtonText: `Continue`,
        }).then((result) => {
          if (result.isConfirmed) {
            userContextData.onChangeSetProviderValue();
            history.push("/dashboard");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancelSubscription = (event) => {
    event.preventDefault();
    putData(
      process.env.REACT_APP_CANCEL_SUBSCRIPTION_URL,
      userContextData.token
    )
      .then((res) => {
        localStorage.setItem("payment_status", String(res.data.payment_status));
        localStorage.setItem(
          "subscription_plan",
          String(res.data.subscription_plan_info.subscription_plan)
        );
        Swal.fire({
          title: "Free Subscription !!!",
          confirmButtonText: `Continue`,
        }).then((result) => {
          if (result.isConfirmed) {
            userContextData.onChangeSetProviderValue();
            history.push("/dashboard");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === "en" ? "left" : "right"
    );
    fetchPlan();
    fetchCurrentPlan();
  }, [userContextData.selectedLanguage]);

  return (
    <>
      {loading ? (
        <SpinnerComponent />
      ) : (
        <div>
          {userContextData.plan === "free" ? (
            <ContainerDiv>
              <div dir={changeAlignment === "right" ? "rtl" : "ltr"}>
                <div className={"text-" + changeAlignment}>
                  <TitleComponent title={t("subscribe-title")} />
                </div>
                <div className="row subscription-box-shadow">
                  <div className="col-md-4 mt-4">
                    <img
                      src={PremiumSubscriptionImage}
                      alt="subscripton_photo"
                      width="90%"
                      height="90%"
                    />
                  </div>
                  <div className="col-md-8 mt-4">
                    <div className="d-flex p-0">
                      <div>
                        <img
                          src={PremiumSubscriptionLogo}
                          alt="Premium subcription logo"
                          width="100px"
                          height="100px"
                        />
                      </div>
                      <div className="mx-2">
                        <p
                          className={
                            "premium-title " + " text-" + changeAlignment
                          }
                        >
                          {t("subscribe-plan")}
                        </p>
                        <p className={"text-" + changeAlignment}>
                          {" "}
                          ${plan ? plan.fees : "0"} /{"Year"}{" "}
                        </p>
                      </div>
                    </div>
                    <div className={"mt-4 text-" + changeAlignment}>
                      <p>
                        <img
                          src={CheckedLogo}
                          alt="Checked logo"
                          className={
                            "d-inline " +
                            (changeAlignment === "left" ? "mr-2" : "ml-2")
                          }
                        />
                        {t("subscribe-description-1")}
                      </p>
                      <p>
                        <img
                          src={CheckedLogo}
                          alt="Checked logo"
                          className={
                            "d-inline " +
                            (changeAlignment === "left" ? "mr-2" : "ml-2")
                          }
                        />
                        {t("subscribe-description-2")}
                      </p>
                      <p>
                        <img
                          src={CheckedLogo}
                          alt="Checked logo"
                          className={
                            "d-inline " +
                            (changeAlignment === "left" ? "mr-2" : "ml-2")
                          }
                        />
                        {t("subscribe-description-3")}
                      </p>
                      <p>
                        <img
                          src={CheckedLogo}
                          alt="Checked logo"
                          className={
                            "d-inline " +
                            (changeAlignment === "left" ? "mr-2" : "ml-2")
                          }
                        />
                        {t("subscribe-description-4")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center text-center mt-4 sub-btn">
                  <div>
                    <ButtonComponent
                      text={t("subscribe-continue-button")}
                      outline="no"
                      click={handleProceed}
                    />
                  </div>
                  {userContextData.subscriptionStatus === "0" ? (
                    <div className="sub-btn-content">
                      <p className="pr-2">Or</p>
                      <a
                        href="#"
                        className="sub-p"
                        onClick={handleFreeSubscription}
                      >
                        {t("subscribe-continue-free")}
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </ContainerDiv>
          ) : (
            <ContainerDiv>
              <div dir={changeAlignment === "right" ? "rtl" : "ltr"}>
                <div className={"text-" + changeAlignment}>
                  <TitleComponent title={t("subscribe-title-plan")} />
                </div>
                <div className="row subscription-box-shadow">
                  <div className="col-md-4 mt-4">
                    <img
                      src={PremiumSubscriptionImage}
                      alt="subscripton_photo"
                      width="90%"
                      height="90%"
                    />
                  </div>
                  <div className="col-md-8 mt-4">
                    <div className="d-flex p-0">
                      <div className="mx-2">
                        <p
                          className={
                            "premium-title " + " text-" + changeAlignment
                          }
                        >
                          {t("subscribe-plan-premium")}
                        </p>
                      </div>
                    </div>
                    <div className={"mt-4 text-" + changeAlignment}>
                      <p>
                        {t("subscribe-current-plan-text1")}
                        <strong>{t("subscribe-current-plan-text2")}</strong>
                        {t("subscribe-current-plan-text3")}
                      </p>
                      <p>
                        {t("subscribe-current-plan-text4")}
                        <strong>{currentPlan.fees}</strong>
                        {t("subscribe-current-plan-text5")}
                        <strong>
                          {
                            <Moment format="MMM D, YYYY">
                              {currentPlan.end_date}
                            </Moment>
                          }
                        </strong>
                      </p>
                      <br />
                      <br />
                      <ButtonComponent
                        text={t("subscribe-cancel-button")}
                        outline="no"
                        click={handleCancelSubscription}
                      />
                      <ButtonComponent
                        text={t("subscribe-renew-button")}
                        outline="no"
                        click={handleProceed}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ContainerDiv>
          )}
        </div>
      )}
    </>
  );
};

export default SubscriptionComponent;
