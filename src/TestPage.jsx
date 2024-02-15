import React, { useState } from "react";
import axios from "axios";
import "./TestPage.css";

const TestPage = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [cancelToken, setCancelToken] = useState(null);
  const [showData, setShowData] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");

  const openingPopup = () => {
    setShowData("");
    setCancelMessage("");
    if (!openPopup) {
      const source = axios.CancelToken.source();
      setCancelToken(source);

      setTimeout(() => {
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
    } else {
      console.log("else");
    }
    setOpenPopup(true);
  };

  const closePopup = () => {
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
        Open Pop-up
      </div>
      <div
        style={{ backgroundColor: "red" }}
        className="start_request"
        onClick={closePopup}
      >
        Close Pop-up
      </div>
      {showData !== "" && (
        <div className="messages_text response_txt">{showData}</div>
      )}
      {cancelMessage !== "" && (
        <div className="messages_text error_txt">{cancelMessage}</div>
      )}
    </>
  );
};

export default TestPage;
