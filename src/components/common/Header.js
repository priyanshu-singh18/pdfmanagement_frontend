import React, { useEffect, useState } from "react";
import classes from "./Header.module.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { loginStateAtom } from "../../context/loginState";
import LogoutButton from "./LogoutButton";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import { filedatastate } from "../../context/filedataState";
import { toast } from "react-toastify";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Header() {
  const navigate = useNavigate();
  const [shareWithEmail, setShareWithEmail] = useState("");
  const location = useLocation();
  const { file_id } = useRecoilValue(filedatastate);
  const [formdata, setFormdata] = useState();
  const [isLoading, setIsloading] = useState(false);

  const token = sessionStorage.getItem("token");
  const logoutHandler = (val) => {
    sessionStorage.clear();
    navigate("/");
  };
  const [isModalVisible, setIsModalVisible] = useState();
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {}, [isLoading]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setFormdata(formData);
  };

  const handleUploadButton = async () => {
    try {
      const upload_file = async () => {
        return await axios.post(
          `${REACT_APP_BASE_URL}uploads/upload`,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      };

      // console.log(resp);
      // setIsLoading(true);
      const resp = await upload_file();

      window.location.reload(false);
      setFormdata("");
      setIsloading(true);
    } catch (error) {
      if (error.response) {
        // console.log(error.response);
        const { status, data } = error.response;
        setError(`Error Uploading file (${status}): ${data.error}`);
      } else if (error.request) {
        setError("No response received from the server. Please try again.");
      } else {
        setError(
          "An error occurred while uploading the file. Please try again."
        );
      }
    }
  };

  const handleShareButton = async () => {
    // console.log(shareWithEmail);
    const data = { share_to: shareWithEmail, file_id: file_id };
    try {
      const share_file = async () => {
        return await axios.post(
          `${REACT_APP_BASE_URL}uploads/share`,
          JSON.stringify(data),
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      };

      const resp = await share_file();
      toast.success("File Shared", { position: toast.POSITION.TOP_RIGHT });
      setShareWithEmail("");
      // console.log(resp);
    } catch (error) {
      if (error.response) {
        // console.log(error.response);
        const { status, data } = error.response;
        setError(`Error sharing file (${status}): ${data.error}`);
      } else if (error.request) {
        setError("No response received from the server. Please try again.");
      } else {
        setError("An error occurred while sharing the file. Please try again.");
      }
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setError("");
  };

  return (
    <header className={classes.header}>
      <h1>PDF Management and Collaboration</h1>
      <div className={classes.controller}>
        {location.pathname === "/dashboard" && (
          <button onClick={toggleModal}>Upload File</button>
        )}
        {location.pathname === "/pdfview" && (
          <button onClick={toggleModal}>Share File</button>
        )}
        {token && <LogoutButton logout={logoutHandler} />}
      </div>
      {isModalVisible && location.pathname === "/dashboard" && (
        <Modal onCloseClick={toggleModal}>
          <div className={classes["modal-content"]}>
            <input type="file" onChange={handleFileUpload} />
            <div className={classes["modal-controllers"]}>
              <button onClick={handleUploadButton}>Upload</button>
              <button onClick={toggleModal}>Cancel</button>
            </div>
            {error && <div className={classes.error}>{error}</div>}{" "}
          </div>
        </Modal>
      )}
      {isModalVisible && location.pathname === "/pdfview" && (
        <Modal onCloseClick={toggleModal}>
          <div className={classes["modal-content"]}>
            <input
              type="email"
              placeholder="Enter recipient email"
              value={shareWithEmail}
              onChange={(e) => {
                setShareWithEmail(e.target.value);
                setError("");
              }}
            />
            <div className={classes["modal-controllers"]}>
              <button onClick={handleShareButton}>Share</button>
              <button onClick={toggleModal}>Cancel</button>
            </div>
            {error && <div className={classes.error}>{error}</div>}{" "}
          </div>
        </Modal>
      )}
      {isLoading && <div></div>}
    </header>
  );
}
