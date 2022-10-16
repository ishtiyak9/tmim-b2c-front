import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Moment from 'react-moment';
import './css/review-ratings.css';
import StarIcon from "../../assets/icons/star.svg";
import StarFillIcon from "../../assets/icons/star-fill.svg";
import ReviewLocationIcon from "../../assets/icons/review-location.svg";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../pages/dashboard/dashboard';
import { useTranslation } from 'react-i18next';


const ReviewDetailsComponent = (props) => {
    const userContextData = useContext(UserContext);
    const [changeAlignment, setChangeAlignment] = useState(
        userContextData.selectedLanguage === "en" ? "left" : "right");
    const { t } = useTranslation();
    const getFormattedDate = (value) => {
        const dateYear = moment(value).format('MMM DD, YYYY');
        return dateYear;

    }

    const starPring = (rating) => {
        const items = [];
        for (var i = 0; i < rating; i++) {
            items.push(<img src={StarFillIcon} height="26" width="26" className="mr-1" />)
        }
        for (var i = 0; i < (5 - rating); i++) {
            items.push(<img src={StarIcon} height="26" width="26" className="mr-1" />)
        }
        return items;
    }

    useEffect(() => {
        setChangeAlignment(userContextData.selectedLanguage === "en" ? "left" : "right");
    }, [userContextData.selectedLanguage]);

    return (
        <div dir={changeAlignment === "right" ? "rtl" : "ltr"}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className={"ml-3 "}>
                        <div className={"title-with-rfq-id " + (changeAlignment === "right" ? "text-right" : "text-left")}>
                            {t("reviews-rating-modal-header") + " #" + props.reviewDetails.id}
                        </div>
                        <div className={"title-with-date review-modal-header-date " + (changeAlignment === "right" ? "text-right" : "text-left")}>
                            {getFormattedDate(props.reviewDetails.updated_at)}
                        </div>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={"ml-2 text-" + changeAlignment}>
                    <div className="row">
                        <div className="col-md-2">
                            <img src={props.companyProfile.companyLogo} alt="" height="100" width="100" className="review-modal-image" />
                        </div>
                        <div className={"col-md-10 review-modal-title-box"}>
                            <p className="review-modal-title mb-0">{props.companyProfile.companyName}</p>
                            <p className="review-modal-sub-title mb-0"> <img src={ReviewLocationIcon} height="13" width="13" alt="" /> {props.companyProfile.mapLocation}</p>
                        </div>
                    </div>
                    <span className="review-rating-border"></span>

                    <div className={"row mt-4"}>
                        <div className={"rfq-details-label"}>
                            {t("reviews-rating-modal-rating")}
                        </div>
                        <div>
                            {starPring(props.reviewDetails.rating)}
                        </div>
                    </div>

                    <div className={"row mt-4"}>
                        <div className="rfq-details-label">
                            {t("reviews-rating-modal-review")}
                        </div>
                        <div className="review-modal-text mt-2">
                            {props.reviewDetails.text}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </div>
    );

}

export default ReviewDetailsComponent;