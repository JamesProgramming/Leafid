"use client";
import Button, { buttonStyle } from "../button";
import "./webcam.scss";
import Loading from "../loading";
import modelApi from "../utils/modelApi";
import Webcam from "react-webcam";
import { useEffect, useState } from "react";
import Dropdown from "../dropdown";
import PredictionResults from "../PredictionResults";
import { alert } from "../alert";

function Webcamera(props) {
  const [image, setImage] = useState("");
  const [isPicture, setIsPicture] = useState(false);
  const [devices, setDevices] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(false);
  const [camera, setCamera] = useState("");
  const width = 256;
  const height = 256;

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices)
      return alert("You have no camera.");
    navigator.mediaDevices.enumerateDevices().then((devicelist) => {
      setDevices(devicelist.filter((device) => device.kind == "videoinput"));
    });
    navigator.permissions
      .query({ name: "camera" })
      .then((permissionsStatus) => {
        permissionsStatus.addEventListener("change", () => {
          navigator.mediaDevices.enumerateDevices().then((devicelist) => {
            setDevices(
              devicelist.filter((device) => device.kind == "videoinput")
            );
          });
        });
      });
  }, []);

  const getResults = async function (e) {
    setIsLoading(true);
    await modelApi(
      process.env.NEXT_PUBLIC_API + "/api/v1/model/",
      image,
      setResults
    );
    setIsLoading(false);
  };

  if (isPicture) {
    return (
      <div className="webcam">
        <div className="webcam__back">
          <Button
            onClick={() => {
              setIsPicture(false);
              setResults("");
            }}
            style={buttonStyle.back}
          >
            New photo
          </Button>
        </div>
        <div>
          <img src={image} alt="Captured photo" className="webcam__img" />
        </div>
        <div className="webcam__button">
          {isLoading && <Loading />}

          {!results && <Button onClick={getResults}>Get Prediction</Button>}
          {results && <PredictionResults results={results} />}
        </div>
      </div>
    );
  }

  return (
    <div className="webcam">
      <div className="webcam__camera-list">
        {devices && (
          <Dropdown setItem={setCamera}>
            {devices.map((device, index) => {
              return (
                <option value={device.deviceId} key={index}>
                  {device.label}
                </option>
              );
            })}
          </Dropdown>
        )}
      </div>
      <div className="webcam__output-container">
        <Webcam
          videoConstraints={{
            width: width,
            height: height,
            deviceId: camera,
          }}
          screenshotFormat="image/jpeg"
          audio={false}
          className="webcam__output"
        >
          {({ getScreenshot }) => {
            return (
              <div className="webcam__button">
                <Button
                  onClick={() => {
                    const img = getScreenshot();
                    setImage(img);
                    setIsPicture(true);
                  }}
                >
                  Capture
                </Button>
              </div>
            );
          }}
        </Webcam>
      </div>
    </div>
  );
}

export default Webcamera;
