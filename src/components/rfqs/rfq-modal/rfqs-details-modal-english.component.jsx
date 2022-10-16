import { useContext, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Moment from 'react-moment';
import moment from 'moment';
// import HashIcon from '../../../assets/icons/hash.svg';
import HashIcon from '../../../assets/icons/hash.svg';
import ProfileIcon from '../../../assets/icons/profile.svg';
import EmailIcon from '../../../assets/icons/email.svg';
import PhoneIcon from '../../../assets/icons/call.svg';
import CalenderIcon from '../../../assets/icons/calendar.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import CallingIcon from '../../../assets/icons/calling.svg';

import './modal.css';
import '../css/rfqs.css';
import ButtonComponent from '../../../shared/component/button/button.component';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { UserContext } from '../../../pages/dashboard/dashboard';
import axios from 'axios';
import Swal from 'sweetalert2';
// import Swal from "sweetalert2";

function RFQsDetailsModalEnglishComponent(props) {
  // const [showConfirmationDialog, setShowConfirmationDialog, ] = useState(false);
  // const [show, setShow] = useState(true);
  const { t } = useTranslation();
  const userContextData = useContext(UserContext);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const history = useHistory();
  var handleClick = () => {
    history.push(`/dashboard/rfq/make-quotation/${props.id}`);
  };

  const declineEvent = () => {
    props.show(false);
    props.showConfirmationDialog(true);
  };

  return (
    <div className="modal-text">
      <div className="mb-3">
        <img src={HashIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">
            {t('rfqs-modal-content-id') + ': '}
          </span>
          <span className="rfq-details-data">#{props.rfq_code}</span>
        </p>
      </div>
      <div className="pb-3">
        <img src={ProfileIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">
            {t('rfqs-modal-content-name') + ': '}
          </span>
          <span className="rfq-details-data">{props.name}</span>
        </p>
      </div>
      <div className="pb-3">
        <img src={EmailIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">
            {t('rfqs-modal-content-email') + ': '}
          </span>
          <span className="rfq-details-data">{props.email}</span>
        </p>
      </div>
      <div className="pb-3">
        <img src={PhoneIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">
            {t('rfqs-modal-content-phone') + ': '}
          </span>{' '}
          <span className="rfq-details-data">{props.phone}</span>
        </p>
      </div>
      <div className="pb-3">
        <img src={CalenderIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">
            {t('rfqs-modal-content-occasion-date') + ': '}
          </span>
          <span className="rfq-details-data">{props.date}</span>
        </p>
      </div>
      <div className="pb-3">
        <img src={ClockIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">
            {t('rfqs-modal-content-occasion-time') + ': '}
          </span>
          <span className="rfq-details-data">
            {moment(props.start_time, 'hh:mm').format('h:m A')}{'-'}{moment(props.end_time, 'hh:mm').format('h:m A')}
          </span>
        </p>
      </div>
      <div>
        <img src={CallingIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">
            {t('rfqs-modal-content-contact-method') + ': '}
          </span>
          <span className="rfq-details-data">
            {props.preferred_contact === 1 ? 'Email' : 'Phone Number'}
          </span>
        </p>
      </div>
      <div className="mt-4">
        <div className="rfq-details-label mb-2">
          {t('rfqs-modal-content-message') + ':'}
        </div>
        <p className="rfq-details-para">{props.message}</p>
      </div>
      <div className="d-flex justify-content-center mt-5">
        {/* <input
          type="button"
          value="Make a Quotation"
          className="btn btn-danger mr-3"
          onClick={handleClick}
        /> */}

        <div className={props.status === 2 ? 'd-none' : ''}>
          <ButtonComponent
            text={t('rfqs-modal-button-make-quotaiton')}
            outline="no"
            click={handleClick}
          />
          <ButtonComponent
            text={t('rfqs-modal-button-decline')}
            outline="yes"
            click={() => declineEvent()}
          />
        </div>
        {/* <input
          type="button"
          value="Decline"
          className="btn btn-outline-primary"
          onClick={() => declineEvent()}
        /> */}
      </div>
    </div>
  );
}

export default RFQsDetailsModalEnglishComponent;
