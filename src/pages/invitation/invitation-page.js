import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import queryString from "query-string";

import IconLocation from "../../assets/icons/invitation_location.svg";
// import Invitation_Img from "../../assets/images/invitation_card_example.jpeg";
// import Invi1 from '../../assets/images/invi-1.jpeg';
// import IconLocation from "../../assets/icons/invitation_icon.svg";
import "./invitation-page.css";

const InvitationPage = () => {
  const location = useLocation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = queryString.parse(location.search);
    setData(data);
  }, []);

  return (
    <div className="invitation-card-container">
      <div className="invitation-card-container__invitation-card">
        <img src={data.image} alt="invitation card" />
      </div>
      {data.location ? (
        <div className="invitation-card-container__location">
          <a href={data.location} target="_blank">
            <img src={IconLocation} alt="invitation location" />
          </a>
        </div>
      ) : null}
    </div>
   
  );
};

export default InvitationPage;
