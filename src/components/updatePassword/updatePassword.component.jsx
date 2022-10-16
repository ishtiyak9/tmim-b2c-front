import { useContext, useState, useEffect } from "react";
import TitleComponent from "../../shared/component/title.component";
import ContainerDiv from "../../container/container-div";
import { Form, Input } from "antd";
import ButtonComponent from "../../shared/component/button/button.component";
import ValidateMessageComponent from "../../shared/component/validation/validationerror.component";
import { useTranslation } from "react-i18next";
import LockerIcon from "../../assets/icons/locker.svg";
import EyeCloseIcon from "../../assets/icons/eye_close.svg";
import EyeOpenIcon from "../../assets/icons/eye_open.svg";
import axios from "axios";
import { UserContext } from "../../pages/dashboard/dashboard";
import Swal from "sweetalert2";
import LoadingComponent from "../../shared/component/loading/loading";
import { clearLocalStorage } from "../../../src/shared/utility/utility";
import { useHistory } from "react-router-dom";

const UpdatePasswordComponent = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    const reqData = {
      old_password: values.current_password,
      new_password: values.confirm_password,
    };

    axios({
      method: "post",
      url: `${process.env.REACT_APP_PASSWORD_CHANGE_URL}`,
      data: reqData,
      headers: {
        Authorization: "Bearer " + userContextData.token,
      },
    })
      .then((res) => {
        setLoading(false);
        if (res) {
          Swal.fire({
            title: "Updated Successfully",
            confirmButtonText: `Continue`,
          }).then((result) => {  
              if (result.isConfirmed) {    
                clearLocalStorage();
                history.push("/login");
              }
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Opps...",
          text: e.response.data.old_password,
        });
      })
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === "en" ? "left" : "right"
    );
    form.resetFields();
  }, [userContextData.selectedLanguage]);

  return (
    <ContainerDiv>
      <div className={"text-" + changeAlignment}>
        <TitleComponent title={t("update-password-title")} />
      </div>
      <Form
        dir={changeAlignment === "right" ? "rtl" : "ltr"}
        className="dashboard-box-shadow p-4"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        <div className="mb-4">
          <label
            className={"d-block text-" + changeAlignment}
            htmlFor="currentPassword"
          >
            {t("update-password-current-password")}
          </label>
          <Form.Item
            name="current_password"
            rules={[
              {
                required: true,
                pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
                message: (
                  <ValidateMessageComponent
                    message={
                      t("update-password-current-warning")
                      // "Please enter current password"
                    }
                  />
                ),
              },
              // {
              //   required: true,
              //   min: 8,
              //   message: (
              //     <ValidateMessageComponent
              //       message={t("update-password-current-warning")}
              //     />
              //   ),
              // },
            ]}
          >
            <Input.Password
              size="large"
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
              prefix={<img src={LockerIcon} style={{ width: "1.5rem" }} />}
              placeholder={t("update-password-current-password")}
            />
          </Form.Item>
        </div>
        <div className="mb-4">
          <label
            className={"d-block text-" + changeAlignment}
            htmlFor="currentPassword"
          >
            {t("update-password-new-password")}
          </label>
          <Form.Item
            name="new_password"
            rules={[
              {
                required: true,
                pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
                message: (
                  <ValidateMessageComponent
                    message={
                      t("update-password-new-warning")
                      // "Please enter current password"
                    }
                  />
                ),
              },
              // {
              //   required: true,
              //   min: 8,
              //   message: (
              //     <ValidateMessageComponent
              //       message={t("update-password-new-warning")}
              //     />
              //   ),
              // },
            ]}
          >
            <Input.Password
              placeholder={t("update-password-new-password")}
              size="large"
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
              prefix={<img src={LockerIcon} style={{ width: "1.5rem" }} />}
            />
          </Form.Item>
        </div>
        <div className="mb-4">
          <label
            className={"d-block text-" + changeAlignment}
            htmlFor="confirmPassword"
          >
            {t("update-password-confirm-password")}
          </label>
          <Form.Item
            name="confirm_password"
            dependencies={["new_password"]}
            rules={[
              {
                required: true,
                pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
                message: (
                  <ValidateMessageComponent
                    message={
                      t("update-password-confirm-warning")
                      // "Please enter current password"
                    }
                  />
                ),
              },
              // {
              //   required: true,
              //   min: 8,
              //   message: (
              //     <ValidateMessageComponent
              //       message={t("update-password-confirm-warning")}
              //     />
              //   ),
              // },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      t("update-password-match")
                      // "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={t("update-password-confirm-password")}
              size="large"
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
              prefix={<img src={LockerIcon} style={{ width: "1.5rem" }} />}
            />
          </Form.Item>
        </div>
        <div>{loading ? <LoadingComponent /> : <></>}</div>
        <div
          className={
            changeAlignment == "right" ? "d-flex flex-content-right" : ""
          }
        >
          <ButtonComponent
            text={t("update-details-update-button")}
            outline="no"
          />
        </div>
      </Form>
    </ContainerDiv>
  );
};

export default UpdatePasswordComponent;
