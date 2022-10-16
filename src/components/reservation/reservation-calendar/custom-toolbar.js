import PropTypes from "prop-types";
import React from "react";
import clsx from "clsx";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./custom-toolbar.css";

export let navigate = {
  PREVIOUS: "PREV",
  NEXT: "NEXT",
  TODAY: "TODAY",
  DATE: "DATE",
};

class CustomToolbar extends React.Component {
  render() {
    let {
      localizer: { messages },
      label,
    } = this.props;

    // console.log("custom toolbar ==== ", this.props.language);

    return (
      <div dir={this.props.language === "en" ? "ltr" : "rtl"} className="d-flex justify-content-between rbc-toolbar">
        {/* <span className="rbc-btn-group"> */}
        <div className="d-inline order-1">
          <button
            className="calendar-today-button"
            onClick={this.navigate.bind(null, navigate.TODAY)}
          >
            {messages.today}
          </button>
        </div>

        {/* <Button
            onClick={this.navigate.bind(null, navigate.TODAY)}
            style={{
              background: "white",
              borderColor: "white",
            }}
          >
            {messages.today}
          </Button> */}
        <div className="d-inline order-2 calendar-button">
          <Button
            type="text"
            style={{
              background: "white",
              borderColor: "white",
              border: "none",
              paddingTop: "0px",
            }}
            icon={this.props.language === "en" ? <LeftOutlined /> : <RightOutlined />}
            size="large"
            onClick={this.navigate.bind(null, navigate.PREVIOUS)}
          />
          <span className="rbc-toolbar-label p-0">{label}</span>

          <Button
            type="text"
            style={{
              background: "white",
              borderColor: "white",
              paddingTop: "0px",
            }}
            icon={this.props.language === "en" ? <RightOutlined /> : <LeftOutlined />}
            size="large"
            onClick={this.navigate.bind(null, navigate.NEXT)}
          />
          {/* </span> */}
        </div>
        <div className="rbc-btn-group order-3">
          <div dir={this.props.language === "en" ? "ltr" : "rtl"}>
            {this.viewNamesGroup(messages, this.props.language)}
          </div>
        </div>
      </div>
    );
  }

  navigate = (action) => {
    this.props.onNavigate(action);
  };

  view = (view) => {
    this.props.onView(view);
  };

  viewNamesGroup(messages, lagn) {
    let viewNames = this.props.views;
    const view = this.props.view;

    if (viewNames.length > 1) {
      return viewNames.map((name) => (
        <div className="d-inline">
          <div className="d-inline">
            <button
              type="button"
              key={name}
              className={
                clsx({ "rbc-active ": view === name }) +
                ((name === "day" && lagn === "en") ? " rbc-btn-group-first" :
                  ((name === "day" && lagn !== "en") ? " rbc-btn-group-second" :
                    ((name === "month" && lagn === "en") ? " rbc-btn-group-second" :
                      ((name === "month" && lagn !== "en") ? " rbc-btn-group-first" : ""
                      ))))
              }
              onClick={this.view.bind(null, name)}
              style={{
                background: "white",
                border: "black",
              }}
            >
              {messages[name]}
            </button>
          </div>
          {/* 
        <button
          type="button"
          key={name}
          className={
            // clsx({ "rbc-active ": view === name }) +
            (name === "day" ? "rbc-btn-group-day" : " rbc-btn-group-second ")
          }
          onClick={this.view.bind(null, name)}
          style={{
            background: "white",
            border: "black",
          }}
        >
          {messages[name]}
        </button> */}
        </div>
      ));
    }
  }
}

CustomToolbar.propTypes = {
  view: PropTypes.string.isRequired,
  views: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.node.isRequired,
  localizer: PropTypes.object,
  onNavigate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default CustomToolbar;
