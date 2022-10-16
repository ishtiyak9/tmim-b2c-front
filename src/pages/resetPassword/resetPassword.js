import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import LockerIcon from "../../assets/icons/locker.svg";
import EyeCloseIcon from "../../assets/icons/eye_close.svg";
import EyeOpenIcon from "../../assets/icons/eye_open.svg";
import ValidateMessageComponent from "../../shared/component/validation/validationerror.component";
import LoadingComponent from "../../shared/component/loading/loading";
import "./css/resetPassword.css";
import { useTranslation } from "react-i18next";
import EnFlag from "../../assets/icons/flag-en.svg";
import ArabicFlag from "../../assets/images/flag-ua.svg";
import { LanguageContext } from "../login/login";
function ResetPassword() {
  const contextType = LanguageContext;
  const engFlagLoc = "/static/media/flag-en.f2b03646.svg";
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [token, setToken] = useState();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(contextType._currentValue.currentLanguage);
  const [changeAlignment, setChangeAlignment] = useState(
    contextType._currentValue.currentLanguage === "en" ? "left" : "right"
  );
  const [flagType, setFlagType] = useState(
    contextType._currentValue.currentLanguage === "en" ? EnFlag : ArabicFlag
  );

  const onFinish = (values) => {
    setLoading(true);
    const reqData = {
      token: token,
      password: values.confirm_password,
    };

    const params = {
      token: token,
    };

    axios
      .post(process.env.REACT_APP_RESET_PASSWORD_URL, reqData, {
        params: params,
      })
      .then((res) => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password Reset completed",
          // confirmButtonText: `Continue to Login`,
        }).then((result) => {
          if (result.isConfirmed) {
            // history.push("/login");
          }
        });
      })
      .catch((e) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Opps...",
          text: e.response.data.password,
        });
      });
  };

  const languageChangeHandler = (e) => {
    if (e.target.value === "en") {
      setFlagType(EnFlag);
      setLang(e.target.value);
      changeLanguage(e.target.value);
      setChangeAlignment("left");
    } else {
      setFlagType(ArabicFlag);
      changeLanguage(e.target.value);
      setLang(e.target.value);
      setChangeAlignment("right");
    }
  };

  const changeLanguage = (data) => {
    // setLang(data);
    i18n.changeLanguage(data);
  };

  // useEffect(() => {
  //   console.log('reset language---',contextType._currentValue);
  //   // setLang(contextType._currentValue.currentLanguage);

  // },[contextType._currentValue.currentLanguage]);

  useEffect(() => {
    console.log("reset-pass");
    const data = queryString.parse(location.search);
    setToken(data.token);
  }, []);

  return (
    <div
      className={"text-" + changeAlignment}
      dir={changeAlignment === "right" ? "rtl" : "ltr"}
    >
      <div className="row mr-0">
        <div className="col-md-6">
          {/* language-change */}
          <div className="reset-select-div">
            {/* <div
              className={
                "d-inline " +
                (flagType === engFlagLoc
                  ? "reset-select-div"
                  : "reset-select-div")
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
                  {t("reset-password")}
                  {/* Reset Password */}
                </p>
              </div>
              <div>{loading ? <LoadingComponent /> : <></>}</div>
              <Form form={form} name="control-hooks" onFinish={onFinish}>
                <label htmlFor="email" className="field-label">
                  {t("reset-new-password")}
                  {/* New password */}
                </label>

                <Form.Item
                  name="new_password"
                  type="password"
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
                      message: (
                        <ValidateMessageComponent
                          message={
                            t("reset-please-enter-password")
                            // "Please enter password"
                          }
                        />
                      ),
                    }
                    // {
                    //   required: true,
                    //   min: 8,
                    //   message: (
                    //     <ValidateMessageComponent
                    //       message={
                    //         t("reset-please-enter-password")
                    //         // 'Please enter password'
                    //       }
                    //     />
                    //   ),
                    // },
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="************"
                    prefix={
                      <img
                        src={LockerIcon}
                        style={{
                          width: "1.6rem",
                          marginRight: ".5rem",
                        }}
                      />
                    }
                    iconRender={(visible) =>
                      visible ? (
                        <img
                          src={EyeOpenIcon}
                          style={{
                            width: "1.2rem",
                            marginRight: ".5rem",
                            marginLeft: ".15rem",
                          }}
                        />
                      ) : (
                        <img
                          src={EyeCloseIcon}
                          style={{
                            width: "1.2rem",
                            marginRight: ".5rem",
                            marginLeft: ".15rem",
                          }}
                        />
                      )
                    }
                  />
                </Form.Item>
                <div className="d-flex justify-content-between">
                  <div>
                    <label htmlFor="password" className="field-label">
                      {t("reset-confirm-password")}
                      {/* Confirm password */}
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <Form.Item
                    name="confirm_password"
                    type="password"
                    rules={[
                      {
                        required: true,
                        pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
                        message: (
                          <ValidateMessageComponent
                            message={
                              t("reset-please-enter-password")
                              // "Please enter password"
                            }
                          />
                        ),
                      },
                      // {
                      //   required: true,
                      //   min: 8,
                      //   message: (
                      //     <ValidateMessageComponent
                      //       message={
                      //         t("reset-please-enter-password")
                      //         // 'Please enter password'
                      //       }
                      //     />
                      //   ),
                      // },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("new_password") === value
                          ) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error(
                              t("reset-password-doesnt-match")
                              // "Password doesn't match"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="************"
                      prefix={
                        <img
                          src={LockerIcon}
                          style={{
                            width: "1.6rem",
                            marginRight: ".5rem",
                          }}
                        />
                      }
                      iconRender={(visible) =>
                        visible ? (
                          <img
                            src={EyeOpenIcon}
                            style={{
                              width: "1.2rem",
                              marginRight: ".5rem",
                              marginLeft: ".15rem",
                            }}
                          />
                        ) : (
                          <img
                            src={EyeCloseIcon}
                            style={{
                              width: "1.2rem",
                              marginRight: ".5rem",
                              marginLeft: ".15rem",
                            }}
                          />
                        )
                      }
                    />
                  </Form.Item>
                </div>

                <div>
                  <button className={"login-btn tmm-btn login-btn-text"}>
                    {t("reset-password")}
                    {/* Reset password */}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="content-center p-3">
            <div className="reset-pass-cover-img"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
