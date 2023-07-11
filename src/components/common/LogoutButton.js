import React from "react";
import classes from "./LogoutButton.module.css";

export default function LogoutButton(props) {
  return (
    <button
      className={classes.button}
      onClick={() => {
        props.logout(false);
      }}
    >
      Logout
    </button>
  );
}
