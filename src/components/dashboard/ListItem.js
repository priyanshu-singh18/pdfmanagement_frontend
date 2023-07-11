import React from "react";
import "./ListItem.css";

export default function ListItem(props) {
  const handleClick = () => {
    // console.log(props.key);
    props.clickedItem(props.file_id);
  };
  const date = props.uploaded_at;
  var date_object = new Date();
  date_object.setTime(Date.parse(date));

  var d = date_object.getDate();
  var m = date_object.getMonth();
  var y = date_object.getFullYear();
  var datestr = `${d}-${m}-${y}`;

  var timestr = `${date_object.getHours()}:${date_object.getMinutes()}:${date_object.getSeconds()}`;
  // console.log(timestr);

  return (
    <li className="list-item-container" onClick={handleClick}>
      <span className="num">{props.serial}</span>
      <span className="name">{props.name}</span>
      <span className="email"> {props.uploaded_by}</span>
      <span className="date">{datestr}</span>
      <span className="time">{timestr}</span>
    </li>
  );
}
