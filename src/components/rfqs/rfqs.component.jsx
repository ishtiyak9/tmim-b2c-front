import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import moment from 'moment';
import { Table, Tooltip, ConfigProvider } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../pages/dashboard/dashboard';
import Modal from 'react-bootstrap/Modal';
import ButtonComponent from '../../shared/component/button/button.component';
import ContainerDiv from '../../container/container-div';
import TitleComponent from '../../shared/component/title.component';
import HashIcon from './../../assets/icons/hash.svg';
import ProfileIcon from './../../assets/icons/profile.svg';
import EmailIcon from './../../assets/icons/email.svg';
import PhoneIcon from './../../assets/icons/call.svg';
import CalenderIcon from './../../assets/icons/calendar.svg';
import ClockIcon from './../../assets/icons/clock.svg';
import CallingIcon from './../../assets/icons/calling.svg';

import './css/rfqs.css';
import { getDataWithParams } from '../../shared/http-request-handler';
import { useTranslation } from 'react-i18next';
import RFQsDetailsModalEnglishComponent from './rfq-modal/rfqs-details-modal-english.component';
import Swal from 'sweetalert2';

const RFQsComponent = () => {
  const { t } = useTranslation();
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === 'en' ? 'left' : 'right'
  );
  const columns = [
    {
      title: 'RFQ ID',
      align: changeAlignment,
      dataIndex: 'rfq_code',
      key: 'rfq_code',
      render: (code) => {
        return <span>#{code}</span>;
      },
    },
    {
      title: 'RFQ Date',
      align: changeAlignment,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => <Moment format="MMM D, YYYY">{date}</Moment>,
    },
    {
      title: 'Name',
      align: changeAlignment,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Preferred Contact Details ',
      align: changeAlignment,
      dataIndex: 'preferred_contact',
      key: 'preferred_contact',
      render: (preferred_contact, row) => {
        if (preferred_contact === 1) {
          return <> {row.email} </>;
        } else {
          return <> {row.phone} </>;
        }
      },
    },
    {
      title: 'Delivery Date',
      align: changeAlignment,
      dataIndex: 'date',
      key: 'date',
      render: (date) => <Moment format="MMM D, YYYY">{date}</Moment>,
    },
    {
      title: '',
      align: changeAlignment,
      dataIndex: 'status',
      align: changeAlignment,
      key: 'status',
      render: (status) => (
        <>
          {/* <span className="d-inline pr-3">{getStatusType(status)}</span> */}
          <Tooltip
            placement={changeAlignment}
            title={status == 1 || status == 3 ? 'Active' : 'Close'}
          >
            <span
              className={status == 1 || status == 3 ? 'deny-dot' : 'closed-dot'}
              // title={status == 1 ? 'Active' : 'Close'}
            ></span>
          </Tooltip>
        </>
      ),
    },
  ];

  const [show, setShow] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [modalData, setModalData] = useState({});
  const [filter, setFilter] = useState('0');

  const statusCircleClass = (statusType) => {
    if (statusType === 'accepted') {
      return 'accepted-dot';
    } else if (statusType === 'pending') {
      return 'pending-dot';
    } else {
      return 'deny-dot';
    }
  };

  /**
   * Fetch Data
   */
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const params = {};
    if (filter !== '0') {
      params['status'] = filter;
    }
    getDataWithParams(
      process.env.REACT_APP_RFQ_ALL_URL,
      userContextData.token,
      params
    )
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const fetchDetails = async (rfq_id) => {
    setLoading(true);
    axios({
      method: 'get',
      url: process.env.REACT_APP_RFQ_DETAILS + rfq_id,
      headers: {
        Authorization: 'Bearer ' + userContextData.token,
      },
    })
      .then((res) => {
        // console.log(res.data);
        setShow(true);
        setDetails(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  };

  const rowEvent = (rowValue) => {
    fetchDetails(rowValue.id);
  };

  const declineEvent = () => {
    setShow(false);
    setShowConfirmationDialog(true);
  };

  const declineRfq = () => {
    const reqDeclinerfq = {
      status: 2,
    };

    axios({
      method: 'post',
      url: process.env.REACT_APP_RFQ_DETAILS + details.id,
      data: reqDeclinerfq,
      headers: {
        Authorization: 'Bearer ' + userContextData.token,
      },
    })
      .then((res) => {
        if (res) {
          Swal.fire({
            title: 'Updated Successfully',
            confirmButtonText: `Continue`,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
    fetchData();
    setShowConfirmationDialog(false);
  };

  // const declineEvent = () => {
  //   setShow(false);
  //   setShowConfirmationDialog(true);
  // };

  const notDeclineEvent = () => {
    setShow(true);
    setShowConfirmationDialog(false);
  };
  const history = useHistory();
  var handleClick = () => {
    history.push(`/dashboard/rfq/make-quotation/${details.id}`);
  };

  const filterValueChangeHandler = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    fetchData();
    setChangeAlignment(
      userContextData.selectedLanguage === 'en' ? 'left' : 'right'
    );
  }, [filter, userContextData.selectedLanguage]);

  return (
    <ConfigProvider direction={changeAlignment === 'right' ? 'rtl' : 'ltr'}>
      <ContainerDiv>
        {/* <div className="d-flex justify-content-between">
        <TitleComponent title="RFQs" />
        <div className="mt-2 select-status">
          <select
            name="status"
            id="status"
            onChange={filterValueChangeHandler}
          >
            <option value="0" selected>
              Filter by status
            </option>
            <option value="1">Active</option>
            <option value="2">Close</option>
          </select>
        </div>
      </div> */}

        <div className="overflow-hidden">
          <div
            className={
              'mx-2 float-' + (changeAlignment === 'right' ? 'right' : 'left')
            }
          >
            <TitleComponent title={t('rfq-title')} />
          </div>
          <div
            className={
              'mx-2 float-' + (changeAlignment === 'right' ? 'left' : 'right')
            }
          >
            <div className="mt-2 select-status">
              <select
                name="status"
                id="status"
                onChange={filterValueChangeHandler}
              >
                <option value="0" selected>
                  Filter by status
                </option>
                <option value="1">Active</option>
                <option value="2">Close</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className={
            'overflow-auto p-4 dashboard-box-shadow' +
            (changeAlignment === 'right' ? ' responsive-direction' : '')
          }
        >
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  rowEvent(record);
                  // console.log("on row Click ---- ", record, rowIndex);
                },
              };
            }}
            columns={columns}
            dataSource={data}
            onChange={onChange}
            pagination={false}
            loading={loading}
          />
          <>
            <div className="modal-text">
              <Modal
                show={show}
                onHide={() => setShow(false)}
                centered="true"
                size="md"
              >
                <Modal.Header
                  dir={changeAlignment === 'right' ? 'rtl' : 'ltr'}
                  closeButton
                >
                  <Modal.Title>
                    <div className="ml-3">
                      <div
                        className={
                          'title-with-rfq-id text-' +
                          (changeAlignment === 'right' ? 'right' : 'left')
                        }
                      >
                        {t('rfqs-modal-header-id') + ': #'}
                        {details.rfq_code}
                      </div>
                      <div
                        className={
                          'title-with-date ' +
                          (changeAlignment === 'right' ? 'd-none' : '')
                        }
                      >
                        {details.date} | {t('rfqs-modal-header-time') + ': '}{' '}
                        {details.start_time}
                      </div>
                      <div
                        className={
                          'title-with-date ' +
                          (changeAlignment === 'right'
                            ? 'text-right'
                            : 'd-none')
                        }
                      >
                        {details.date} | {t('rfqs-modal-header-time') + ': '}{' '}
                        {details.start_time}
                      </div>
                    </div>
                  </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <div
                    style={{ minHeight: '450px' }}
                    className={changeAlignment === 'right' ? 'd-none' : ''}
                  >
                    <RFQsDetailsModalEnglishComponent
                      {...details}
                      show={() => setShow()}
                      showConfirmationDialog={(value) => {
                        setShowConfirmationDialog(value);
                      }}
                    />
                  </div>

                  <div
                    style={{ minHeight: '450px' }}
                    className={changeAlignment === 'right' ? '' : 'd-none'}
                  >
                    <div className="modal-text text-right">
                      <div className="mb-3">
                        <p className="d-inline">
                          <span className="rfq-details-data">
                            {details.rfq_code}#
                          </span>
                          <span className="rfq-details-label">
                            {' :' + t('rfqs-modal-content-id')}
                          </span>
                        </p>
                        <img src={HashIcon} className="modal-icons" />
                      </div>
                      <div className="pb-3">
                        <p className="d-inline">
                          <span className="rfq-details-data">
                            {details.name}
                          </span>
                          <span className="rfq-details-label">
                            {' :' + t('rfqs-modal-content-name')}
                          </span>
                        </p>
                        <img src={ProfileIcon} className="modal-icons" />
                      </div>
                      <div className="pb-3">
                        <p className="d-inline">
                          <span className="rfq-details-data">
                            {details.email}
                          </span>
                          <span className="rfq-details-label">
                            {' :' + t('rfqs-modal-content-email')}
                          </span>
                        </p>
                        <img src={EmailIcon} className="modal-icons" />
                      </div>
                      <div className="pb-3">
                        <p className="d-inline">
                          <span className="rfq-details-data">
                            {details.phone}
                          </span>
                          <span className="rfq-details-label">
                            {' :' + t('rfqs-modal-content-phone')}
                          </span>
                        </p>
                        <img src={PhoneIcon} className="modal-icons" />
                      </div>
                      <div className="pb-3">
                        <p className="d-inline">
                          <span className="rfq-details-data">
                            {details.date}
                          </span>
                          <span className="rfq-details-label">
                            {' :' + t('rfqs-modal-content-occasion-date')}
                          </span>
                        </p>
                        <img src={CalenderIcon} className="modal-icons" />
                      </div>
                      <div className="pb-3">
                        <p className="d-inline">
                          <span className="rfq-details-data">
                            {moment(details.start_time, 'hh:mm').format(
                              'h:m A'
                            )}-{moment(details.end_time, 'hh:mm').format(
                              'h:m A'
                            )}
                          </span>
                          <span className="rfq-details-label">
                            {' :' + t('rfqs-modal-content-occasion-time')}
                          </span>
                        </p>
                        <img src={ClockIcon} className="modal-icons" />
                      </div>
                      <div>
                        <p className="d-inline">
                          <span className="rfq-details-data">
                            {details.preferred_contact === 1
                              ? 'Email'
                              : 'Phone Number'}
                          </span>
                          <span className="rfq-details-label">
                            {' :' + t('rfqs-modal-content-contact-method')}
                          </span>
                        </p>
                        <img src={CallingIcon} className="modal-icons" />
                      </div>
                      <div className="mt-4">
                        <div className="rfq-details-label mb-2">
                          {t('rfqs-modal-content-message')}
                        </div>
                        <p className="rfq-details-para text-right">
                          {details.message}
                        </p>
                      </div>
                      <div className="d-flex justify-content-center mt-5">
                        {/* <input
                          type="button"
                          value="Make a Quotation"
                          className="btn btn-danger mr-3"
                          onClick={handleClick}
                        /> */}

                        <div className={details.status === 2 ? 'd-none' : ''}>
                          <ButtonComponent
                            text={t('rfqs-modal-button-decline')}
                            outline="yes"
                            click={() => declineEvent()}
                          />
                          <ButtonComponent
                            text={t('rfqs-modal-button-make-quotaiton')}
                            outline="no"
                            click={handleClick}
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
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </>

          <>
            <div className="modal-text" hidden={showConfirmationDialog}>
              <Modal
                show={showConfirmationDialog}
                onHide={() => setShow(false)}
                centered="true"
              >
                <Modal.Body closeButton>
                  <div className="modal-text">
                    <div>
                      <span className="d-flex justify-content-end">
                        <i
                          className="fa fa-times"
                          aria-hidden="true"
                          onClick={() => {
                            notDeclineEvent(false);
                          }}
                        ></i>
                      </span>
                      <p className="rfq-details-para text-center">
                        {t('rfqs-modal-decline-confirmation-text')}
                      </p>
                    </div>
                    <div className="d-flex justify-content-center">
                      <ButtonComponent
                        text={t('rfqs-modal-decline-confirmation-yes')}
                        outline="no"
                        click={() => declineRfq()}
                      />
                      <ButtonComponent
                        text={t('rfqs-modal-decline-confirmation-no')}
                        outline="yes"
                        click={() => notDeclineEvent(false)}
                      />

                      {/* <input
                      type="button"
                      value="Yes"
                      className="btn btn-danger px-5 mr-3"
                      onClick={() => {
                        setShowConfirmationDialog(false);
                      }}
                    /> */}
                      {/* <input
                      type="button"
                      value="No"
                      className="btn btn-outline-primary px-5"
                      onClick={() => {
                        notDeclineEvent(false);
                      }}
                    /> */}
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </>

          {/* <form>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="text"
                name="currentPassword"
                id="currentPassword"
                className="form-control"
              />
              <label htmlFor="currentPassword">New Password</label>
              <input
                type="text"
                name="newPassword"
                id="newPassword"
                className="form-control"
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="text"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control"
              />
            </div>
            <input
              type="submit"
              value="Update"
              className="form-control col-sm-3"
            />
          </form> */}
        </div>
      </ContainerDiv>
    </ConfigProvider>
  );
};

export default RFQsComponent;
