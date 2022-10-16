import { useState, useContext, useEffect } from 'react';
import Moment from 'react-moment';
import { UserContext } from '../../pages/dashboard/dashboard';
import { getData } from '../../shared/http-request-handler';
import ContainerDiv from '../../container/container-div';
import TitleComponent from '../../shared/component/title.component';
import { ConfigProvider, Table } from 'antd';
import Star from '../../assets/icons/star.svg';
import StarFill from '../../assets/icons/star-fill.svg';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import ReviewDetailsComponent from './review-ratings-details.component';

const ReviewsAndRatingsComponent = () => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === 'en' ? 'left' : 'right'
  );
  const [show, setShow] = useState(false);
  const [reviewDetails, setReviewDetails] = useState({});
  const [userDetailsData, setUserDetailsData] = useState({});
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const columns = [
    {
      title: 'RFQ ID',
      dataIndex: 'rfq_id',
      key: 'rfq_id',
      align: changeAlignment,
      render: (code) => {
        return <span>#{code}</span>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: changeAlignment,
      render: (date) => <Moment format="MMM D, YYYY">{date}</Moment>,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      key: 'customer',
      align: changeAlignment,
      render: (cname) => cname ? cname.first_name + ' ' + cname.last_name : "",
    },
    {
      title: 'rating',
      dataIndex: 'rating',
      key: 'rating',
      align: changeAlignment,
      render: (rating) => {
        const items = [];
        for (var i = 0; i < rating; i++) {
          items.push(
            <img height="15" width="15" src={StarFill} className="mr-1" />
          );
        }
        for (var i = 0; i < 5 - rating; i++) {
          items.push(
            <img height="15" width="15" src={Star} className="mr-1" />
          );
        }
        return items;
      },
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    getData(
      process.env.REACT_APP_RATINGS_LIST_URL + userContextData.userId,
      userContextData.token
    )
      .then((res) => {
        setLoading(false);
        if (res.data !== 0) {
          // console.log(res.data.reviews);
          setData(res.data.reviews);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const rowEvent = (rowValue) => {
    // console.log(rowValue);
    setReviewDetails(rowValue);
    setShow(true);
  };

  const fetchUserDetailsData = async () => {
    // setLoading(true);
    getData(process.env.REACT_APP_PROFILE_GET_URL + "/" + userContextData.userId, userContextData.token)
      .then((res) => {
          console.log(res.data);
          setUserDetailsData(res.data ? {
            companyName: res.data.company_name,
            companyLogo: res.data.full_profile_photo_url,
            mapLocation: res.data.map_location
          } : "");
        // setLoading(false);
        // setData(res.data);
      })
      .catch((e) => {
        // setLoading(false);
      });
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === 'en' ? 'left' : 'right'
    );
    fetchData();
    fetchUserDetailsData();
  }, [userContextData.selectedLanguage]);

  return (
    <ConfigProvider direction={changeAlignment === 'right' ? 'rtl' : 'ltr'}>
      <ContainerDiv>
        <div
          className={
            'mx-2 float-' + (changeAlignment === 'right' ? 'right' : 'left')
          }
        >
          <TitleComponent title={t('reviews-rating-title')} />
        </div>

        {/* <div className="d-flex justify-content-between">
        <TitleComponent title="" />
      </div> */}

        <div className="p-4 dashboard-box-shadow">
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  rowEvent(record);
                },
              };
            }}
            columns={columns}
            dataSource={data}
            pagination={false}
            loading={loading}
          />
          <>
            <div className="modal-text">
              <Modal
                show={show}
                onHide={() => setShow(false)}
                centered="true"
                size="lg"
              >
                <ReviewDetailsComponent
                  reviewDetails={reviewDetails}
                  companyProfile={userDetailsData}
                  show={setShow}
                />

                {/* <div className={changeAlignment === "right" ? "d-none" : ""}>
                  <QuotationModalComponent
                    modalData={modalData}
                    quotationId={qid}
                    show={setShow}
                  />
                </div> */}
              </Modal>
            </div>
          </>
        </div>
      </ContainerDiv>
    </ConfigProvider>
  );
};

export default ReviewsAndRatingsComponent;
