"use client";
import Button, { ButtonStyle } from "../button";
import "./webcam.scss";
import Loading from "../loading";
import modelApi from "../utils/modelApi";
import Webcam from "react-webcam";
import { useEffect, useState } from "react";
import Dropdown from "../dropdown";
import PredictionResults from "../PredictionResults";
import { customAlert } from "../alert";

/**
 * Uses divice cameras to take a picture. This is intended to go inside the `Modal` component.
 */
function Webcamera() {
  const [image, setImage] = useState("");
  const [isPicture, setIsPicture] = useState(false);
  const [devices, setDevices] = useState([{ label: "", id: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [camera, setCamera] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const width = 256;
  const height = 256;

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices)
      return customAlert("No camera found.");

    // Get available cameras.
    navigator.mediaDevices.enumerateDevices().then((devicelist) => {
      setDevices(devicelist.filter((device) => device.kind == "videoinput"));
    });

    // For Chromium based devices.
    (async () => {
      try {
        const permissionsStatus = await navigator.permissions.query({
          name: "camera",
        });

        permissionsStatus.addEventListener("change", () => {
          navigator.mediaDevices.enumerateDevices().then((devicelist) => {
            setDevices(
              devicelist.filter((device) => device.kind == "videoinput")
            );
          });
        });
      } catch (e) {
        // This is not Chromium based.
      }
    })();
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
              setResults([]);
            }}
            style={ButtonStyle.back}
          >
            New photo
          </Button>
        </div>
        <div>
          <img src={image} alt="Captured photo" className="webcam__img" />
        </div>
        <div className="webcam__button">
          {isLoading && <Loading />}

          {results.length === 0 ? (
            <Button onClick={getResults}>Get Prediction</Button>
          ) : (
            results.length && <PredictionResults results={results} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="webcam">
      <div className="webcam__camera-list">
        <Dropdown
          name="cameraList"
          setItem={(cameraId) => {
            setCamera(cameraId);
            setShowCamera(true);
          }}
        >
          {[
            <option disabled hidden key={7000}>
              Choose camera
            </option>,
            ...devices.map((device, index) => {
              return (
                <option value={device.deviceId} key={index}>
                  {device.label}
                </option>
              );
            }),
          ]}
        </Dropdown>
      </div>
      <div className={`webcam__output-container ${showCamera ? "" : "none"}`}>
        <Webcam
          videoConstraints={{
            width: width,
            height: height,
            deviceId: camera,
          }}
          screenshotFormat="image/jpeg"
          onUserMediaError={() => {
            customAlert("Cannot get video stream.");
          }}
          audio={false}
          className={`webcam__output`}
        >
          {({ getScreenshot }) => {
            return (
              <div className={`webcam__button`}>
                <Button
                  onClick={async () => {
                    const img = getScreenshot({ width: 256, height: 256 });

                    if (!img) {
                      return customAlert("Retake photo.");
                    }
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
