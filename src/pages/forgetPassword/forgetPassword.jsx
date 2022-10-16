import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingComponent from "../../shared/component/loading/loading";
import EmailIcon from "../../assets/icons/email.svg";
import "./css/forgetPassword.css";
import { useTranslation } from "react-i18next";
import EnFlag from "../../assets/icons/flag-en.svg";
import ArabicFlag from "../../assets/images/flag-ua.svg";
import { LanguageContext } from "../login/login";
function ForgetPassword() {
  const contextType = LanguageContext;
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const engFlagLoc = "/static/media/flag-en.f2b03646.svg";
  const [lang, setLang] = useState(contextType._currentValue.currentLanguage);
  const [changeAlignment, setChangeAlignment] = useState(
    contextType._currentValue.currentLanguage === "en" ? "left" : "right"
  );
  const [flagType, setFlagType] = useState(
    contextType._currentValue.currentLanguage === "en" ? EnFlag : ArabicFlag
  );

  const languageChangeHandler = (e) => {
    if (e.target.value === "en") {
      setFlagType(EnFlag);
      setLang(e.target.value);
      changeLanguage(e.target.value);
      setChangeAlignment("left");
    } else {
      setFlagType(ArabicFlag);
      setLang(e.target.value);
      changeLanguage(e.target.value);
      setChangeAlignment("right");
    }
  };

  const changeLanguage = (data) => {
    // setLang(data);
    i18n.changeLanguage(data);
  };

  useEffect(() => {
    console.log("forget pass");
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: (values) => {
      const errors = {};
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
        errors.email = t("forget-error-msg-email");
      // "Please enter a valid email!";
      return errors;
    },
    onSubmit: (values) => {
      setLoading(true);
      axios({
        method: "post",
        url: process.env.REACT_APP_FORGOT_PASSWORD_URL,
        data: values,
      })
        .then((data) => {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Password reset mail sent",
          }).then((result) => {
            if (result.isConfirmed) {
              // history.push("/login");
            }
          });
        })
        .catch((err) => {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oopps...",
            text: "No user found with this email",
          });
        });
    },
  });

  return (
    <div
      className={"text-" + changeAlignment}
      dir={changeAlignment === "right" ? "rtl" : "ltr"}
    >
      <div className="overflow-hidden">
        <div className="row mb-5">
          <div className="col-lg-6 col-md-12">
            {/* language-change */}
            <div className="forget-select-div">
              {/* <div
                className={
                  "d-inline " +
                  (flagType === engFlagLoc
                    ? "forget-select-div"
                    : "forget-select-div")
                }
              > */}
                <img
                  src={flagType}
                  alt="En flag"
                  style={{
                    marginRight: ".4rem",
                    height: "35px",
                    width: "35px",
                    borderRadius: "10px",
                  }}
                />
                <select
                  style={{ outline: "none" }}
                  aria-label="Default select lsnguage"
                  value={lang}
                  onChange={languageChangeHandler}
                >
                  <option value="en" selected>
                    {t("language-en")}
                  </option>
                  <option value="arab">{t("language-arabic")}</option>
                </select>
              {/* </div> */}
            </div>
            <div className="content-center">
              <div className="text-center w-75">
                <div className="mb-4">
                  <p className="h-text">
                    {t("forget-header-text")}
                    {/* Forgot your password? */}
                  </p>
                  <p className="p-text">
                    {t("forget-p-text")}
                    {/* Lost your password? Please enter your email address. You will
                  receive a link to create a new password via email. */}
                  </p>
                </div>
                <div>{loading ? <LoadingComponent /> : <></>}</div>
                <form onSubmit={formik.handleSubmit}>
                  <label for="email" className="field-label">
                    {t("forget-company-email")}
                    {/* Company email */}
                  </label>
                  <div className="field mb-2">
                    <img src={EmailIcon} alt="" className="icon-style-sm" />
                    <input
                      type="email"
                      name="email"
                      onChange={formik.handleChange}
                      placeholder="felicia.reid@example.com"
                    />
                  </div>
                  <div>
                    {formik.errors.email && (
                      <label
                        htmlFor="error"
                        className="ml-2 mb-0 error"
                        style={{ float: "left" }}
                      >
                        {formik.errors.email}
                      </label>
                    )}
                  </div>
                  <div className="field space">
                    <input
                      type="submit"
                      value={t("forget-reset-password")}
                      // "Reset password"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 hide-image">
            <div className="content-center p-3">
              <div className="forgot-password-img"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
