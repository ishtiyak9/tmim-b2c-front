import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import queryString from "query-string";
import Moment from "react-moment";

import IconCalender from "../../assets/icons/landing-calender.svg";
import IconLocation from "../../assets/icons/landing-location.svg";
import IconTopFlower from "../../assets/icons/flow.png";
import IconBottonFlower from "../../assets/icons/flower-bottom.png";
import IconTopLeaf from "../../assets/icons/leaf-top.png";
import IconBottomLeaf from "../../assets/icons/leaf-bottom.png";
import IconTopCrown from "../../assets/icons/topcrown.svg";
import IconBottomCrown from "../../assets/icons/bottomcrown.svg";

import "./landing-page.css";

const LandingPage = () => {
  const location = useLocation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = queryString.parse(location.search);
    setData(data);
  }, []);

  return (
    <div className="landing">
      <div className="landing-container">
        <img className="landing-container_top_img" src={IconTopFlower} alt="" />
        <div className="landing-container_info">
          <div>
            <h1>{data.message}</h1>
            <p className="conatiner-main_info">{data.note}</p>
          </div>
          <div>
            <img
              className="landing_container_top_leaf"
              src={IconTopLeaf}
              alt=""
            />
          </div>
          <div className="top-crown">
            <img src={IconTopCrown} alt="" />
          </div>
          <div>
            <h6>
              {data.i_am} & {data.my_partner}
            </h6>
          </div>
          <div>
            <img src={IconBottomCrown} alt="" />
          </div>
          <div>
            <img className="bottom-calender" src={IconCalender} alt="" />
          </div>
          <div>
            <img
              className="landing_container_bottom_leaf"
              src={IconBottomLeaf}
              alt=""
            />
          </div>
          <div>
            <p className="landing-info-text">
              <Moment format="MMMM D, YYYY">{data.occasion_date}</Moment>
            </p>
          </div>
          <div>
            <img src={IconLocation} alt="" />
          </div>
          <div>
            <a
              href={data.location_direction}
              target="_blank"
              style={{
                textDecoration: "underline",
                fontFamily: "Gabriela",
                color: "#303443",
                fontSize: "14px",
              }}
            >
              {data.location}
            </a>
          </div>
        </div>
        <img
          className="landing-container_bottom_img"
          src={IconBottonFlower}
          alt=""
        />
      </div>
    </div>
  );
};

export default LandingPage;
