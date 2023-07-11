import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboards.css";
import { useNavigate } from "react-router-dom";
import ListItem from "./ListItem";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { filedatastate } from "../../context/filedataState";
import { loginStateAtom } from "../../context/loginState";

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default function Dashboard() {
  const [userdata, setUserdata] = useState([]);
  const [shareddata, setShareddata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // New state for error handling

  const setFileData = useSetRecoilState(filedatastate);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    (async () => {
      if (!token) {
        navigate("/");
        return;
      }

      const { exp } = parseJwt(token);
      if (Date.now() >= exp * 1000) {
        console.log(false);
      } else {
        console.log(true);
      }

      try {
        const userFilesResponse = await axios.get(
          "http://127.0.0.1:8000/uploads/fetch",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserdata(userFilesResponse.data);

        const sharedFilesResponse = await axios.get(
          "http://127.0.0.1:8000/uploads/shared",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShareddata(sharedFilesResponse.data);

        setIsLoading(false);
      } catch (error) {
        if (error.response) {
          // console.log(error.response);
          const { status, data } = error.response;
          setError(`Error sharing file (${status}): ${data.error}`);
        } else if (error.request) {
          setError("No response received from the server. Please try again.");
        } else {
          setError(
            "An error occurred while sharing the file. Please try again."
          );
        }
        setIsLoading(false);
      }
    })();
  }, [isLoading]);

  const handleItemClickUser = (val) => {
    const temp = userdata?.filter((item) => item.file_id === val);
    // console.log(temp[0]);
    setFileData({ file_id: temp[0].file_id, file_data: temp[0].uploaded_file });
    // sessionStorage.setItem("fileid", temp[0].file_id);
    // sessionStorage.setItem("file_data" , temp[0].uploaded_file)
    navigate("/pdfview");
  };

  const handleItemClickShared = (val) => {
    const temp = shareddata?.filter((item) => item.file_id === val);
    // console.log(temp[0]);
    setFileData({ file_id: temp[0].file_id, file_data: temp[0].uploaded_file });
    // sessionStorage.setItem("fileid", temp[0].file_id);
    // sessionStorage.setItem("file_data" , temp[0].uploaded_file)
    navigate("/pdfview");
  };
  // console.log(userdata);
  // console.log(shareddata);

  const files1 =
    userdata.length > 0 ? (
      userdata?.map((item, index) => {
        return (
          <ListItem
            key={item.file_id}
            serial={index + 1}
            name={`File ${index + 1}`}
            uploaded_by={item.uploaded_by_email}
            uploaded_at={item.uploaded_at}
            clickedItem={handleItemClickUser}
            file_id={item.file_id}
          />
        );
      })
    ) : (
      <p style={{ width: "450px", fontSize: "20px" }}>Upload Files First</p>
    );
  const files2 =
    shareddata.length > 0 ? (
      shareddata?.map((item, index) => {
        return (
          <ListItem
            key={item.item_id}
            serial={index + 1}
            name={`File ${index + 1}`}
            uploaded_by={item.uploaded_by_email}
            uploaded_at={item.uploaded_at}
            file_id={item.file_id}
            clickedItem={handleItemClickShared}
          />
        );
      })
    ) : (
      <p style={{ width: "450px", fontSize: "20px" }}>
        You Dont have Shared Files
      </p>
    );

  if (error) {
    return <div>Error: {error}</div>; // Render an error message
  }

  return (
    <>
      <div className="container">
        <h1 className="heading">Your Dashboard</h1>
        <div className="files-container-1">
          <div className="files-container-2">
            <h1>Your Files</h1>
            <ul className="file-list">{files1}</ul>
          </div>
          <div className="files-container-2">
            <h1>Shared Files</h1>
            <ul className="file-list">{files2}</ul>
          </div>
        </div>
      </div>
    </>
  );
}
