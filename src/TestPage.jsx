import React, { useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import "./TestPage.css";

const TestPage = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [cancelToken, setCancelToken] = useState(null);
  const [showData, setShowData] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");
  const [loadedData, setLoadedData] = useState(false);

  const openingPopup = () => {
    if (!openPopup) {
      setLoadedData(true);
      setShowData("");
      setCancelMessage("");
      const source = axios.CancelToken.source();
      setCancelToken(source);

      setTimeout(() => {
        //setTimeout just to simulate time loading
        axios
          .post(
            "https://jsonplaceholder.typicode.com/posts",
            {
              title: "foo",
              body: "bar",
              userId: 1,
            },
            {
              cancelToken: source.token,
            }
          )
          .then((response) => {
            if (response) {
              setShowData(JSON.stringify(response.data));
              setLoadedData(false);
            }
          })
          .catch((error) => {
            if (axios.isCancel(error)) {
              setCancelMessage(error.message);
            } else {
              console.error("Error:", error);
            }
          });
      }, 2000);
    }
    setOpenPopup(true);
  };

  const closePopup = () => {
    setLoadedData(false);
    setShowData("");
    setOpenPopup(false);
    if (cancelToken) {
      cancelToken.cancel("Request cancelled by user");
      setCancelToken(null);
    }
  };

  return (
    <>
      <div
        style={{ backgroundColor: "lightgreen" }}
        className="start_request"
        onClick={openingPopup}
      >
        Run Axios
      </div>
      <div
        style={{ backgroundColor: "red" }}
        className="start_request"
        onClick={closePopup}
      >
        Cancel Axios
      </div>
      {showData !== "" && (
        <div className="messages_text response_txt">{showData}</div>
      )}
      {cancelMessage !== "" && (
        <div className="messages_text error_txt">{cancelMessage}</div>
      )}
      {loadedData && <Loader></Loader>}
    </>
  );
};

export default TestPage;
