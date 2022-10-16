import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Form, Input, Select } from "antd";
import "antd/dist/antd.css";
import ButtonComponent from "../../shared/component/button/button.component";
import ValidateMessageComponent from "../../shared/component/validation/validationerror.component";
import EmailIcon from "../../assets/icons/email.svg";
import HomeIcon from "../../assets/icons/home.svg";
import LocationIcon from "../../assets/icons/location.svg";
import CallIcon from "../../assets/icons/call.svg";
import LockerIcon from "../../assets/icons/locker.svg";
import ZipIcon from "../../assets/icons/zip.svg";
import EyeCloseIcon from "../../assets/icons/eye_close.svg";
import EyeOpenIcon from "../../assets/icons/eye_open.svg";
import { getDataWithoutToken } from "../../shared/http-request-handler";
import LoadingComponent from "../../shared/component/loading/loading";
import "./css/register.css";
import { useTranslation } from "react-i18next";
import EnFlag from "../../assets/icons/flag-en.svg";
import ArabicFlag from "../../assets/images/flag-ua.svg";
import { LanguageContext } from "../login/login";
const Register = () => {
  const contextType = LanguageContext;
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [filteredCityList, setFilteredCityList] = useState([]);
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);

  const [lang, setLang] = useState(contextType._currentValue.currentLanguage);
  const [changeAlignment, setChangeAlignment] = useState(
    contextType._currentValue.currentLanguage === "en" ? "left" : "right"
  );
  const [flagType, setFlagType] = useState(
    contextType._currentValue.currentLanguage === "en" ? EnFlag : ArabicFlag
  );
  const engFlagLoc = "/static/media/flag-en.f2b03646.svg";

  const fetchData = () => {
    getDataWithoutToken(process.env.REACT_APP_COUNTRY_URL)
      .then((data) => {
        setCountryList(data.data.countryList);
        setCityList(data.data.cityList);
      })
      .catch((err) => {
        return err;
      });
  };

  const handleCountryOnChangeEvent = (value) => {
    if (value) {
      const filteredList = cityList.filter(
        (element) => element.country === parseInt(value)
      );
      setFilteredCityList(filteredList);
    }
  };

  const onFinish = (values) => {
    const { retype_password, remember_me, ...data } = values;
    if (agree) {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_REGISTER_URL, data)
        .then((data) => {
          setLoading(false);
          if (data) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Your account is under admin approval now",
              confirmButtonText: `Continue to Login`,
            }).then((result) => {
              if (result.isConfirmed) {
                history.push("/login");
              }
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          var error_data = err.response.data;
          for (const ed in error_data) {
            Swal.fire({
              icon: "error",
              title: "Oopps...",
              text: error_data[ed][0],
            });
          }
          console.log(err);
        });
    }
  };

  const languageChangeHandler = (e) => {
    if (e.target.value === "en") {
      setFlagType(EnFlag);
      setLang(e.target.value);
      changeLanguage(e.target.value);
      contextType._currentValue.currentLanguage = e.target.value;
      setChangeAlignment("left");
    } else {
      setFlagType(ArabicFlag);
      setLang(e.target.value);
      changeLanguage(e.target.value);
      contextType._currentValue.currentLanguage = e.target.value;
      setChangeAlignment("right");
    }
  };

  const changeLanguage = (data) => {
    // setLang(data);
    i18n.changeLanguage(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="row mb-3">
        <div className="col-lg-6 col-md-12 hide-background">
          <div className="content-center p-3">
            <div className="register-cover-img"></div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          {/* language-change */}
          <div className="registration-select-div">
            {/* <div
              className={
                "d-inline " +
                (flagType === engFlagLoc
                  ? "registration-select-div"
                  : "registration-select-div")
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

          <div className="mt-2 register-form-padding">
            <div className={"mr-5"}>
              <div className="mb-4">
                <p
                  className="h-text"
                  dir={changeAlignment === "right" ? "rtl" : "ltr"}
                  style={
                    changeAlignment === "left"
                      ? { textAlign: "left" }
                      : { textAlign: "center", marginTop: "50px" }
                  }
                >
                  {t("create-an-account")}
                  {/* Create an Account */}
                </p>
                <p
                  className="p-text"
                  dir={changeAlignment === "right" ? "rtl" : "ltr"}
                  style={
                    changeAlignment === "left"
                      ? { textAlign: "left" }
                      : { textAlign: "center" }
                  }
                >
                  {t("create-an-account-to-continue")}
                  {/* Create an account to continue */}
                </p>
              </div>
              <div
                className={"text-" + changeAlignment}
                dir={changeAlignment === "right" ? "rtl" : "ltr"}
              >
                <Form form={form} name="control-hooks" onFinish={onFinish}>
                  <div className="form-group">
                    <label for="name" className="field-label">
                      {t("company-name")}
                      {/* Company Name */}
                    </label>
                    <div className="mb-4">
                      <Form.Item
                        name="company"
                        rules={[
                          {
                            required: true,
                            message: (
                              <ValidateMessageComponent
                                message={
                                  t("register-error-msg-company-name")
                                  // "Please input your company name"
                                }
                              />
                            ),
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Company Name"
                          prefix={
                            <img
                              src={HomeIcon}
                              alt="avatar"
                              style={{
                                width: "1.3rem",
                                marginRight: ".75rem",
                              }}
                            />
                          }
                          // dir="ltr"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="email" className="field-label">
                      {t("company-email")}
                      {/* Company Email */}
                    </label>
                    <div className="mb-4">
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            type: "email",
                            message: (
                              <ValidateMessageComponent
                                message={
                                  t("register-error-msg-email-address")
                                  // "Please enter a valid email address"
                                }
                              />
                            ),
                          },
                          {
                            required: true,
                            message: (
                              <ValidateMessageComponent
                                message={
                                  t("register-error-msg-email-address")
                                  // "Please enter a valid email address"
                                }
                              />
                            ),
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Company Email"
                          prefix={
                            <img
                              alt=""
                              src={EmailIcon}
                              style={{
                                width: "1.5rem",
                                marginRight: ".75rem",
                              }}
                            />
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="mobile" className="field-label">
                      {t("mobile-number")}
                      {/* Mobile Number (Optional) */}
                    </label>
                    <div className="mb-4">
                      <Form.Item
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: (
                              <ValidateMessageComponent
                                message={
                                  t("register-error-msg-mobile-number")
                                  // "Please enter password"
                                }
                              />
                            ),
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          size="large"
                          placeholder="Mobile Number (Optional)"
                          prefix={
                            <img
                              alt=""
                              src={CallIcon}
                              style={{
                                width: "1.6rem",
                                marginRight: ".75rem",
                              }}
                            />
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="password" className="field-label">
                      {t("password")}
                      {/* Password */}
                    </label>
                    <div className="mb-4">
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
                            message: (
                              <ValidateMessageComponent
                                message={
                                  t("register-error-msg-password")
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
                          //         t("register-error-msg-password")
                          //         // "Please enter password"
                          //       }
                          //     />
                          //   ),
                          // },
                        ]}
                      >
                        <Input.Password
                          size="large"
                          placeholder="Password"
                          prefix={
                            <img
                              alt=""
                              src={LockerIcon}
                              style={{
                                width: "1.7rem",
                                marginRight: ".75rem",
                              }}
                            />
                          }
                          iconRender={(visible) =>
                            visible ? (
                              <img
                                alt=""
                                src={EyeOpenIcon}
                                style={{
                                  width: "1.2rem",
                                  marginRight: ".5rem",
                                  marginLeft: ".15rem",
                                }}
                              />
                            ) : (
                              <img
                                alt=""
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
                  </div>

                  <div className="form-group">
                    <label for="retype-password" className="field-label">
                      {t("retype-password")}
                      {/* Retype Password */}
                    </label>
                    <div className="mb-4">
                      <Form.Item
                        name="retype_password"
                        rules={[
                          {
                            required: true,
                            pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
                            message: (
                              <ValidateMessageComponent
                                message={
                                  t("register-error-msg-password")
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
                          //         t("register-error-msg-password")
                          //         // "Please enter password"
                          //       }
                          //     />
                          //   ),
                          // },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }

                              return Promise.reject(
                                new Error(
                                  t("register-error-msg-retype-password")
                                  // "Password doesn't match"
                                )
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          size="large"
                          placeholder="Retype Password"
                          prefix={
                            <img
                              alt=""
                              src={LockerIcon}
                              style={{
                                width: "1.7rem",
                                marginRight: ".75rem",
                              }}
                            />
                          }
                          iconRender={(visible) =>
                            visible ? (
                              <img
                                alt=""
                                src={EyeOpenIcon}
                                style={{
                                  width: "1.2rem",
                                  marginRight: ".5rem",
                                  marginLeft: ".15rem",
                                }}
                              />
                            ) : (
                              <img
                                alt=""
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
                  </div>

                  <div className="form-group">
                    <label for="address" className="field-label">
                      {t("company-address")}
                      {/* Company Address */}
                    </label>
                    <div className="mb-4">
                      <Form.Item
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: (
                              <ValidateMessageComponent
                                message={
                                  t("register-error-msg-company-address")
                                  // "Please enter your company address"
                                }
                              />
                            ),
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Company Address"
                          prefix={
                            <img
                              alt=""
                              src={LocationIcon}
                              alt="avatar"
                              style={{
                                width: "1.3rem",
                                marginRight: ".75rem",
                                marginLeft: ".3rem",
                              }}
                            />
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className=" form-group row">
                    <div className="col-md-6">
                      <label for="country" className="field-label">
                        {t("country")}
                        {/* Country */}
                      </label>
                      <div className="mb-4 select-option-register-arrow">
                        <Form.Item
                          name="country"
                          rules={[
                            {
                              required: true,
                              message: (
                                <ValidateMessageComponent
                                  message={
                                    t("register-error-msg-country")
                                    // "Please enter country"
                                  }
                                />
                              ),
                            },
                          ]}
                        >
                          <Select
                            name="country"
                            id="country"
                            size="large"
                            style={{ width: "100%" }}
                            placeholder="Select country"
                            optionFilterProp="children"
                            onChange={handleCountryOnChangeEvent}
                            className="text-left"
                            defaultValue={
                              <>
                                <img
                                  alt=""
                                  className="mr-2"
                                  src={LocationIcon}
                                  alt="avatar"
                                  style={{
                                    width: "1.3rem",
                                  }}
                                />
                                <span className="select-placeholer-text">
                                  Select Country
                                </span>
                              </>
                            }
                            dir="ltr"

                          >
                            {countryList.map((d, index) => (
                              <option value={d.id} key={index}>
                                <div className="d-flex flex-content-between">
                                  <img
                                    alt=""
                                    className="mr-2"
                                    src={LocationIcon}
                                    alt="avatar"
                                    style={{
                                      width: "1.3rem",
                                    }}
                                  />
                                  {d.name}
                                </div>
                              </option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label for="city" className="field-label">
                        {t("city")}
                        {/* City */}
                      </label>
                      <div className="mb-4 select-option-register-arrow">
                        <Form.Item
                          name="city"
                          rules={[
                            {
                              required: true,
                              message: (
                                <ValidateMessageComponent
                                  message={
                                    t("register-error-msg-city")
                                    // "Please enter city"
                                  }
                                />
                              ),
                            },
                          ]}
                        >
                          <Select
                            name="city"
                            id="city"
                            size="large"
                            style={{
                              width: "100%",
                            }}
                            placeholder="Select City"
                            optionFilterProp="children"
                            className="text-left"
                            defaultValue={
                              <>
                                <img
                                  alt=""
                                  className="mr-2"
                                  src={LocationIcon}
                                  alt="avatar"
                                  style={{
                                    width: "1.3rem",
                                  }}
                                />
                                <span className="select-placeholer-text">
                                  Select City
                                </span>
                              </>
                            }
                            dir="ltr"
                          >
                            {filteredCityList.map((d, index) => (
                              <option value={d.id} key={index}>
                                <div className="d-flex flex-content-between">
                                  <img
                                    className="mr-2"
                                    src={LocationIcon}
                                    alt=""
                                    style={{
                                      width: "1.3rem",
                                      marginRight: "7rem",
                                    }}
                                  />
                                  {d.name}
                                </div>
                              </option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label for="area" className="field-label">
                          {t("area")}
                          {/* Area */}
                        </label>
                        <div className="mb-4">
                          <Form.Item
                            name="area"
                            rules={[
                              {
                                required: true,
                                message: (
                                  <ValidateMessageComponent
                                    message={
                                      t("register-error-msg-area")
                                      // "Please enter area"
                                    }
                                  />
                                ),
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="Area"
                              prefix={
                                <img
                                  src={LocationIcon}
                                  alt=""
                                  style={{
                                    width: "1.3rem",
                                    marginRight: ".75rem",
                                    marginLeft: ".3rem",
                                  }}
                                />
                              }
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label for="zip_code" className="field-label">
                          {t("zip-code")}
                          {/* Zip Code */}
                        </label>
                        <div className="mb-4">
                          <Form.Item
                            name="zip_code"
                            rules={[
                              {
                                required: true,
                                message: (
                                  <ValidateMessageComponent
                                    message={
                                      t("register-error-msg-zip-code")
                                      // "Please enter zip code"
                                    }
                                  />
                                ),
                              },
                              {
                                pattern: new RegExp(/^[0-9]+$/),
                                message: (
                                  <ValidateMessageComponent
                                    message={
                                      t("register-error-msg-zip-code")
                                      // "Please enter zip code"
                                    }
                                  />
                                ),
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              size="large"
                              placeholder="Zip Code"
                              prefix={
                                <img
                                  src={ZipIcon}
                                  alt=""
                                  style={{
                                    width: "1.3rem",
                                    marginRight: ".75rem",
                                    marginLeft: ".3rem",
                                  }}
                                />
                              }
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mb-3">
                    <label className="agreement-label"></label>
                    <Form.Item
                      name="remember"
                      valuePropName="checked"
                      rules={[
                        {
                          required: false,
                          message: (
                            <ValidateMessageComponent message={"Required"} />
                          ),
                        },
                      ]}
                    >
                      <div className="d-flex float-left">
                        <div
                          className="remember-me-checkbox mt-2"
                          style={
                            changeAlignment === "left"
                              ? { left: "0px" }
                              : { left: "8px" }
                          }
                          onClick={() => setAgree(!agree)}
                        >
                          <input type="checkbox" checked={agree} />
                          <span class="remember-checkmark"></span>
                        </div>
                        <div className="agreement-text">
                          {
                            t("terms-and-condition")
                            // "I agree to Tmmim Terms and Condtions & Privacy Policy"
                          }
                        </div>
                      </div>
                      <p
                        className={
                          "agreement-text-error " + (agree ? "d-none" : "")
                        }
                      >
                        * Please accept terms and conditions.
                      </p>
                    </Form.Item>
                  </div>

                  <div>{loading ? <LoadingComponent /> : <></>}</div>

                  <div>
                    <ButtonComponent
                      buttonWidthClass="w-100"
                      text={t("create-button")}
                      outline="no"
                    />
                  </div>
                </Form>
              </div>
              <div className="mt-2 p-text">
                <p>
                  {t("already-account")}
                  {/* Already have an account?{" "} */}
                  <a
                    className="sign-up-link"
                    onClick={() => history.push("/login")}
                  >
                    {t("log-in-link")}
                    {/* Log in */}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
