import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ValidateMessageComponent from '../../shared/component/validation/validationerror.component';
import { Form, Input } from 'antd';
import EmailIcon from '../../assets/icons/email.svg';
import LockerIcon from '../../assets/icons/locker.svg';
import EyeCloseIcon from '../../assets/icons/eye_close.svg';
import EyeOpenIcon from '../../assets/icons/eye_open.svg';
import './css/login.css';
import { setLocalStorageData } from '../../shared/utility/utility';
// import { postData } from '../../shared/http-request-handler';
import React,{ useEffect, useState, useContext } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/messaging';
import LoadingComponent from '../../shared/component/loading/loading';
import { useTranslation } from 'react-i18next';
import EnFlag from '../../assets/icons/flag-en.svg';
import ArabicFlag from '../../assets/images/flag-ua.svg';
export const LanguageContext = React.createContext({currentLanguage:'en'});
/**
 * Firebase push notification configure
 */
// const firebaseConfig = {
//   apiKey: 'AIzaSyBlENf-G26iIvrV8mY-B6UsTy4RIvt1WRY',
//   authDomain: 'python-firebase-2208f.firebaseapp.com',
//   databaseURL: 'https://python-firebase-2208f-default-rtdb.firebaseio.com',
//   projectId: 'python-firebase-2208f',
//   storageBucket: 'python-firebase-2208f.appspot.com',
//   messagingSenderId: '308142962690',
//   appId: '1:308142962690:web:ff69351cf49b63a7714f1b',
//   measurementId: 'G-8XJYW0VTRV',
// };

// firebase.initializeApp(firebaseConfig);

// export const messaging = firebase.messaging();
// export const getToken = () => {
//   return messaging
//     .getToken({
//       vapidKey:
//         'BPrOg5Qvr2NUM-JDRFXxkCzFHLbP4aHOlUWZyKY6AuEBbYHQu76f_y2jm7g0gDyhetYFm8K0ygKebt2cz9QRx_4',
//     })
//     .then((currentToken) => {
//       if (currentToken) {
//         localStorage.setItem('firebase_token', currentToken);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const Login = () => {
  const { t,i18n } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [flagType, setFlagType] = useState(LanguageContext._currentValue.currentLanguage === "en" ? EnFlag : ArabicFlag );
  const engFlagLoc = '/static/media/flag-en.f2b03646.svg';
  const [remember, setRemember] = useState(false);
  const [lang, setLang] = useState(LanguageContext._currentValue.currentLanguage);
  const [loading, setLoading] = useState(false);
  const [changeAlignment, setChangeAlignment] = useState(LanguageContext._currentValue.currentLanguage === "en" ? "left" : "right");

 

  const onFinish = (values) => {
    setLoading(true);
    const reqData = {
      email: values.email,
      password: values.password,
    };
    axios
      .post(process.env.REACT_APP_LOGIN_URL, reqData)
      .then((res) => {
        setLoading(false);
        if (res) {
          if (res.data['group'] !== 'vendor') {
            Swal.fire({
              text: 'Unauthorized user',
            });
            history.push('/login');
          } else {
            setLocalStorageData(res);
            localStorage.setItem('remember', remember);
            if (remember) {
              localStorage.setItem('email', reqData.email);
            }
            /**
             * After successful login send firebase token to server
             * to receive notification for logged in user.
             */
            // postFirebaseRegistartionToken();
            if (
              res.data.Subscription_status &&
              res.data.Subscription_status === '0'
            ) {
              history.push('/dashboard/subscribe');
            } else {
              history.push('/dashboard');
            }
          }
        } else {
          setLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Opps...',
            text: 'Some error occured !!!',
          });
          history.push('/login');
        }
      })
      .catch((e) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: '',
          text: e.response.data.non_field_errors,
        });
        history.push('/login');
      });
  };

  // const postFirebaseRegistartionToken = () => {
  //   const data = {
  //     registration_token: localStorage.getItem('firebase_token'),
  //   };
  //   postData(
  //     process.env.REACT_APP_POST_FIREBASE_TOKEN_URL,
  //     localStorage.getItem('token'),
  //     data
  //   )
  //     .then((res) => {})
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  const languageChangeHandler = (e) => {
    if (e.target.value === 'en') {
      
      LanguageContext._currentValue.currentLanguage = e.target.value;
      setLang(e.target.value);
      setFlagType(EnFlag);
      changeLanguage(e.target.value); 
      setChangeAlignment("left");
    } else {
      LanguageContext._currentValue.currentLanguage = e.target.value;
      setLang(e.target.value);
      setFlagType(ArabicFlag);
      changeLanguage(e.target.value);
      setChangeAlignment("right");
    }
  };

const changeLanguage = (data) => {
// setLang(data);
i18n.changeLanguage(data);
};

  useEffect(() => {
    // getToken();
    if (localStorage.getItem('remember') === 'true') {
      setRemember(true);
      form.setFieldsValue({
        email: localStorage.getItem('email'),
      });
    }
  }, []);

  return (
    <div className={"text-" + changeAlignment} dir={changeAlignment === "right" ? "rtl" : "ltr"}>
    <div className="overflow-hidden" >
      <div className="row mb-5">
        <div className="col-lg-6 col-md-12">
        {/* <LanguageChange /> */}
          {/* language-change */}
          <div className="login-select-div">
            {/* <div
            className={
              'd-inline ' + (flagType === engFlagLoc ? 'login-select-div' : 'login-select-div')
            }
            > */}
            <img
              src={flagType}
              alt="En flag"
              style={{
                marginRight: '.4rem',
                height: '35px',
                width: '35px',
                borderRadius: '10px',
              }}
            />
            <select
              style={{ outline: 'none' }}
              aria-label="Default select lsnguage"
              value={lang} 
              onChange={languageChangeHandler}
            >
              <option value="en" selected>
                {t('language-en')}
              </option>
              <option value="arab">{t('language-arabic')}</option>
            </select>
          {/* </div> */}
       </div>

          {/*  */}
          <div className="content-center">
            <div className="text-center w-75">
              <div className="mb-4">
                <p className="h-text">{t('login-title')}
                  {/* {t('Login to Account')} */}
                  </p>
                <p className="p-text">
                {t('login-description')}
                  {/* Please enter your email and password to continue */}
                </p>
              </div>
              <div>{loading ? <LoadingComponent /> : <></>}</div>
              <div>
                <Form form={form} name="control-hooks" onFinish={onFinish}>
                  <label htmlFor="email" className="field-label">
                  {t('email')}
                    {/* Email */}
                  </label>
                  <Form.Item
                    name="email"
                    type="email"
                    rules={[
                      {
                        type: 'email',
                        message: (
                          <ValidateMessageComponent
                            message={
                              t('login-error-msg-email-address')
                              // 'Please enter a valid email address'
                            }
                          />
                        ),
                      },
                      {
                        required: true,
                        message: (
                          <ValidateMessageComponent
                            message={
                              t('login-error-msg-email-address')
                              // 'Please enter a valid email address'
                            }
                          />
                        ),
                      },
                    ]}
                  >
                    <Input
                      className="c-input-field"
                      size="large"
                      placeholder="felicia.reid@example.com"
                      prefix={
                        <img
                          src={EmailIcon}
                          style={{
                            width: '1.5rem',
                            marginRight: '.5rem',
                          }}
                        />
                      }
                    />
                  </Form.Item>
                  <div className="d-flex justify-content-between">
                    <div>
                      <label htmlFor="password" className="field-label">
                      {t('password')}
                        {/* Password */}
                      </label>
                    </div>
                    <div
                      className="forgot-pass"
                      onClick={() => history.push('/forget')}
                    >
                      {t('forgot-Password')}
                      {/* Forgot Password? */}
                    </div>
                  </div>
                  <div className="mb-3">
                    <Form.Item
                      name="password"
                      type="password"
                      rules={[
                        {
                          required: true,
                          min: 8,
                          message: (
                            <ValidateMessageComponent
                              message={
                                t('login-error-msg-password')
                                // 'Please enter password'
                              }
                            />
                          ),
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        placeholder="************"
                        prefix={
                          <img
                            src={LockerIcon}
                            style={{
                              width: '1.6rem',
                              marginRight: '.5rem',
                            }}
                          />
                        }
                        iconRender={(visible) =>
                          visible ? (
                            <img
                              src={EyeOpenIcon}
                              style={{
                                width: '1.2rem',
                                marginRight: '.5rem',
                                marginLeft: '.15rem',
                              }}
                            />
                          ) : (
                            <img
                              src={EyeCloseIcon}
                              style={{
                                width: '1.2rem',
                                marginRight: '.5rem',
                                marginLeft: '.15rem',
                              }}
                            />
                          )
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="d-flex float-left">
                    <div
                      className="remember-me-checkbox mt-2"
                      onClick={() => setRemember(!remember)}
                    >
                      <input type="checkbox" checked={remember} />
                      <span class="remember-checkmark"></span>
                    </div>
                    <div
                      className="remember-label"
                      onClick={() => setRemember(!remember)}
                    >
                      {t('remember-me')}
                      {/* Remember me */}
                    </div>
                  </div>

                  <div>
                    <button className={'login-btn tmm-btn login-btn-text'}>
                    {t('login-button-text')}
                      {/* Login */}
                    </button>
                  </div>
                </Form>
                <div className="mt-2 p-text">
                  <p>
                  {t('dont-have-an-account')}{' '}
                    {/* Don’t have an account?{' '} */}
                    <a
                      className="sign-up-link"
                      onClick={() => history.push('/register')}
                    >
                      {t('create-account')}
                      {/* Create Account */}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 hide-image">
          <div className="content-center p-3">
            <div className="login-cover-img"></div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
