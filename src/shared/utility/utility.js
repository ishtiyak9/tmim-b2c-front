import moment from 'moment';
import Swal from 'sweetalert2';

export const showSuccessDialog = (title, confirmButtonText) => {
  Swal.fire({
    title: title,
    confirmButtonText: confirmButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      // history.push("/dashboard");
    }
  });
};

export const showErrorDialog = (title) => {
  Swal.fire({
    icon: 'error',
    title: '',
    text: title,
  });
};

export const thousandSeparator = (x) => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return 0;
};

export const convertTime12to24 = (time12h) => {
  if (time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  } else {
    return '09:00';
  }
};

export const convertTime24to12 = (time) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? ' AM' : ' PM';
    time[0] = +time[0] % 12 || 12;
    time[3] = '';
  }
  // console.log('converted time ----', time, time.join(''));
  return time.join('');
};

export const setLocalStorageData = (res) => {
  console.log(res.data);
  // console.log(
  //   '-------------------------------------------------------------------'
  // );
  // console.log(res.data);
  // console.log(
  //   '--------------------------------------------------------------------'
  // );
  localStorage.setItem('currentUser', JSON.stringify(res.data));
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('payment_status', String(res.data.payment_status));
  localStorage.setItem('id', res.data.id);
  //vendor id set here
  localStorage.setItem('group', res.data.group);
  localStorage.setItem(
    'subscription_plan',
    res.data.SubscriptionPlan_info.subscription_plan
  );
  localStorage.setItem(
    'media_number',
    res.data.SubscriptionPlan_info.media_number
  );
  localStorage.setItem(
    'is_admin_privileges',
    res.data.SubscriptionPlan_info.is_admin_privileges
  );
  localStorage.setItem('media_size', res.data.SubscriptionPlan_info.media_size);
  localStorage.setItem('Subscription_status', res.data.Subscription_status);

  localStorage.setItem('is_available_reservation', res.data.SubscriptionPlan_info.is_available_reservation);
};

export const clearLocalStorage = () => {
     const remember = localStorage.getItem('remember');
     const email = localStorage.getItem('email');
     localStorage.clear();
     localStorage.setItem('email', email);
     localStorage.setItem('remember', remember);

  };

export const getLocalStorageData = () => {};

export const getChartDataFormat = (data) => {
  const dataArr = [];
  switch (data) {
    case 'day':
      const dayTo = moment().format('YYYY-MM-DD');
      dataArr.push(dayTo);
      for (var i = 1; i < 7; i++) {
        const dayFrom = moment().subtract(i, 'd').format('YYYY-MM-DD');
        dataArr.push(dayFrom);
      }
      break;
    case 'month':
      const monthTo = moment().format('YYYY-MM-DD');
      dataArr.push(monthTo);
      for (var i = 1; i <= 30; i++) {
        const monthFrom = moment().subtract(i, 'd').format('YYYY-MM-DD');
        dataArr.push(monthFrom);
      }
      break;
    case 'year':
      for (var i = 1; i <= 12; i++) {
        const yearFrom = moment().subtract(i, 'months').format('M');
        dataArr.push(yearFrom);
      }
      break;
  }
  return dataArr;
};
