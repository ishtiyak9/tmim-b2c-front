import { useState, useContext, useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../pages/dashboard/dashboard';
import { getData } from '../../../shared/http-request-handler';
import PremiumIcon from '../../../../src/assets/icons/premium.svg';
import ButtonComponent from '../../../shared/component/button/button.component';
import moment from 'moment';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DateFnsUtils from '@date-io/date-fns';
import ClockIcon from '../../../assets/icons/clock.svg';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Button } from 'antd';
import { MenuItem } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { TIME } from '../../../shared/utility/time-constant';
import {
  convertTime12to24,
  convertTime24to12,
} from '../../../shared/utility/utility';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  icon: {
    left: 0,
    display: 'none',
  },
  iconOpen: {
    transform: 'none',
  },
  formControlLabel: {
    left: 24,
  },
  selectSelect: {
    paddingLeft: '24px',
  },
}));

const ReservationCreateModal = (props) => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === 'en' ? 'left' : 'right'
  );
  const classes = useStyles();
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [slicedEndTime, setSlicedEndTime] = useState([]);
  const [isWalkInCustomer, setWalkInCustomer] = useState(true);
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      email: '',
      phone: '',
      reservation_date: '',
      reservation_start_time: '9:00 AM',
      reservation_end_time: '9:00 AM',
      deposite_amount: parseFloat(''),
      total_amount: '',
      details: '',
    }
  );

  const fetchData = () => {
    setLoading(true);
    getData(
      process.env.REACT_APP_RESERVATION_DETAILS_URL + props.reservationId,
      userContextData.token
    )
      .then((res) => {
        setLoading(false);
        setResponse(res[0]);
        setSlicedEndTime(
          TIME.slice(
            TIME.indexOf(convertTime24to12(res[0].reservation_start_time))
          )
        );
        setSelectedDate(res[0].reservation_date);
        setWalkInCustomer(res[0].is_for_walkin);
        if (res[0].is_for_walkin) {
          setFormDataForWalkInCustomer(res);
        } else {
          setFormData(res);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setFormData = (res) => {
    // console.log('Setting value walking customer ----', res);
    setFormInput({
      ['name']: res[0].customer.first_name + ' ' + res[0].customer.last_name,
      ['email']: res[0].customer.email,
      ['phone']: res[0].customer.phone,
      ['reservation_start_time']: convertTime24to12(
        res[0].reservation_start_time
      ),
      ['reservation_end_time']: convertTime24to12(res[0].reservation_end_time),
      ['deposite_amount']: res[0].deposite_amount,
      ['total_amount']: res[0].total_amount,
      ['details']: res[0].details,
    });
  };

  const setFormDataForWalkInCustomer = (res) => {
    setFormInput({
      ['name']: res[0].name,
      ['email']: res[0].email,
      ['phone']: res[0].phone,
      ['reservation_start_time']: convertTime24to12(
        res[0].reservation_start_time
      ),
      ['reservation_end_time']: convertTime24to12(res[0].reservation_end_time),
      ['deposite_amount']: res[0].deposite_amount,
      ['total_amount']: res[0].total_amount,
      ['details']: res[0].details,
    });
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const onFill = () => {
    if (props.selectedDate) {
      setSelectedDate(props.selectedDate);
    } else {
      setSelectedDate(new Date());
    }
    setSlicedEndTime(
      TIME.slice(TIME.indexOf(formInput.reservation_start_time))
    );
  };

  const redirectToPaymentPage = () => {
    history.push('/dashboard/subscribe');
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormInput({ ['reservation_date']: date });
  };

  const handleSubmit = (evnt) => {
    evnt.preventDefault();
    const data = { formInput };
    // console.log('after submission --- ', data);

    const reqData = {
      name: data.formInput.name,
      email: data.formInput.email,
      phone: data.formInput.phone,
      reservation_date: moment(selectedDate).format('YYYY-MM-DD'),
      reservation_start_time:
        checked === true
          ? '09:00'
          : convertTime12to24(data.formInput.reservation_start_time),
      reservation_end_time:
        checked === true
          ? '21:00'
          : convertTime12to24(data.formInput.reservation_end_time),
      deposite_amount: data.formInput.deposite_amount,
      total_amount: data.formInput.total_amount,
      vendor: userContextData.userId,
      is_for_walkin: isWalkInCustomer,
      details: data.formInput.details,
    };

    axios({
      method: props.mode === 'CREATE' ? 'post' : 'patch',
      url:
        props.mode === 'CREATE'
          ? process.env.REACT_APP_RESERVATION_CREATE_URL
          : process.env.REACT_APP_RESERVATION_UPDATE_URL + props.reservationId,
      data: reqData,
      headers: {
        Authorization: 'Bearer ' + userContextData.token,
      },
    })
      .then((res) => {
        if (res) {
          Swal.fire({
            title: 'Create Successfully',
            confirmButtonText: `Continue`,
          }).then((res) => {
            if (res.isConfirmed) {
              props.confirmCallback();
            }
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === 'en' ? 'left' : 'right'
    );
    if (props.mode === 'EDIT') {
      fetchData();
    } else {
      onFill();
    }
  }, [userContextData.selectedLanguage]);

  const handleStartTimeSelectChange = (event) => {
    setSlicedEndTime(TIME.slice(TIME.indexOf(event.target.value)));
    setFormInput({
      ['reservation_start_time']: event.target.value,
      ['reservation_end_time']: event.target.value,
    });
  };
  const handleEndTimeSelectChange = (event) => {
    setFormInput({
      ['reservation_end_time']: event.target.value,
    });
  };

  // const handleDepositAmount = (event) => {
  //   setFormInput({
  //     ['deposite_amount']: Number(event.target.value),
  //   });
  // };

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          dir={changeAlignment === 'right' ? 'rtl' : 'ltr'}
        >
          <div>
            <TextField
              id="name"
              name="name"
              placeholder={t('create-reservation-name')}
              margin="normal"
              style={{ width: '95%' }}
              value={formInput.name}
              onChange={handleInput}
            />
          </div>
          <div>
            <TextField
              id="email"
              name="email"
              // label="Email"
              placeholder={t('create-reservation-email')}
              margin="normal"
              style={{ width: '95%' }}
              value={formInput.email}
              onChange={handleInput}
            />
          </div>
          <div>
            <TextField
              type="number"
              id="phone"
              name="phone"
              // label="Phone Number"
              placeholder={t('create-reservation-phone')}
              margin="normal"
              style={{ width: '95%' }}
              value={formInput.phone}
              onChange={handleInput}
            />
          </div>
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <div className={'mr-3 ml-1 text-' + changeAlignment}>
                <div className="d-inline pt-3">
                  <img src={ClockIcon} className="d-inline mt-1" />
                </div>
                <DatePicker
                  id="reservation_date"
                  name="reservation_date"
                  value={
                    props.mode === 'CREATE'
                      ? selectedDate
                      : response.reservation_date
                  }
                  disablePast="true"
                  format="EEEE , MMMM dd"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  onChange={handleDateChange}
                />
                <div style={{ paddingTop: '8px', display: 'inline-block' }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="reservation_start_time"
                    value={formInput.reservation_start_time}
                    label="Time"
                    onChange={handleStartTimeSelectChange}
                    disableUnderline
                    MenuProps={MenuProps}
                    classes={{
                      icon: classes.icon,
                    }}
                  >
                    {TIME.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <span style={{ paddingLeft: '0px', paddingRight: '5px' }}>
                    -
                  </span>
                  <Select
                    labelId="demo-simple-select-label"
                    id="reservation_end_time"
                    value={formInput.reservation_end_time}
                    label="Time"
                    onChange={handleEndTimeSelectChange}
                    disableUnderline
                    MenuProps={MenuProps}
                    classes={{
                      icon: classes.icon,
                    }}
                  >
                    {slicedEndTime.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </MuiPickersUtilsProvider>
          </div>
          <div
            className={'text-' + changeAlignment}
            style={{ marginRight: '-25px' }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  id="allDay"
                  name="allDay"
                  color="primary"
                />
              }
              label={t('create-reservation-all-day')}
            />
          </div>
          <div>
            <TextField
              type="number"
              id="deposite_amount"
              name="deposite_amount"
              placeholder={t('create-reservation-diposite')}
              margin="normal"
              style={{ width: '95%' }}
              value={formInput.deposite_amount}
              onChange={handleInput}
            />
          </div>
          <div>
            <TextField
              type="number"
              id="total_amount"
              name="total_amount"
              placeholder={t('create-reservation-total')}
              margin="normal"
              style={{ width: '95%' }}
              value={formInput.total_amount}
              onChange={handleInput}
            />
          </div>
          <div>
            <TextField
              id="details"
              name="details"
              placeholder={t('create-reservation-details')}
              margin="normal"
              style={{ width: '95%' }}
              value={formInput.details}
              onChange={handleInput}
            />
          </div>
          <br />
          <div className="d-flex justify-content-center">
            {userContextData.plan === 'premium' ||
            userContextData.adminPrivileges === 'True' || userContextData.availableReservation === 'True'  ? (
              <ButtonComponent
                text={
                  props.mode === 'CREATE'
                    ? t('create-reservation-button-create')
                    : t('create-reservation-button-update')
                }
                outline="no"
              />
            ) : (
              <Button
                className="mr-4 "
                onClick={redirectToPaymentPage}
                icon={
                  <img
                    src={PremiumIcon}
                    alt=""
                    style={{
                      width: '18px',
                      marginRight: '5px',
                      marginBottom: '2px',
                    }}
                  />
                }
                style={{
                  background: '#8D131E',
                  border: '#8D131E',
                  borderRadius: '5px',
                }}
              >
                {}
                <span style={{ color: '#fff' }}>
                  {t('upgrade-premium-button')}
                </span>
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ReservationCreateModal;
