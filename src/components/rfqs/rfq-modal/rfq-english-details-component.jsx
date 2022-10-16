import HashIcon from '../../../assets/icons/hash.svg';
import ProfileIcon from '../../../assets/icons/profile.svg';
import EmailIcon from '../../../assets/icons/email.svg';
import PhoneIcon from '../../../assets/icons/call.svg';
import CalenderIcon from '../../../assets/icons/calendar.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import CallingIcon from '../../../assets/icons/calling.svg';
import moment from 'moment';

const RfqEnglishDetailsComponent = (details) => {
  return (
    <div>
      {/* <div className="py-4">
        <img src={HashIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">Quotation ID: </span>
          <span className="rfq-details-data">{details.id}</span>
        </p>
      </div> */}
      <div className="pb-4">
        <img src={HashIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">RFQ ID: </span>
          <span className="rfq-details-data">{details.rfq_code}</span>
        </p>
      </div>
      <div className="pb-4">
        <img src={ProfileIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">Name: </span>
          <span className="rfq-details-data">{details.name}</span>
        </p>
      </div>
      <div className="pb-4">
        <img src={EmailIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">Email: </span>
          <span className="rfq-details-data">{details.email}</span>
        </p>
      </div>
      <div className="pb-4">
        <img src={PhoneIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">Phone Number: </span>
          <span className="rfq-details-data">{details.phone}</span>
        </p>
      </div>
      <div className="pb-4">
        <img src={CalenderIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">Occasion Date: </span>
          <span className="rfq-details-data">{details.date}</span>
        </p>
      </div>
      <div className="pb-4">
        <img src={ClockIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">Occasion Time: </span>
          <span className="rfq-details-data">
            {/* {details.start_time} - {details.end_time} */}
            {moment(details.start_time, 'hh:mm').format('h:m A') +
              ' - ' +
              moment(details.end_time, 'hh:mm').format('h:m A')}
          </span>
        </p>
      </div>
      <div>
        <img src={CallingIcon} className="modal-icons" />
        <p className="d-inline">
          <span className="rfq-details-label">Contact Method: </span>
          <span className="rfq-details-data">
            {details.preferred_contact === 1 ? 'Email' : 'Phone Number'}
          </span>
        </p>
      </div>
      <div className="my-4">
        <label for="quotation-message" className="rfq-details-label">
          {' '}
          Message
        </label>
        <p className="rfq-details-para">{details.message}</p>
      </div>
    </div>
  );
};

export default RfqEnglishDetailsComponent;
