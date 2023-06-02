"use client";
import Button, { buttonStyle } from "../button";
import "./uploadForm.scss";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import modelApi from "../utils/modelApi";
import FileResizer from "react-image-file-resizer";
import Loading from "../loading";
import PredictionResults from "../PredictionResults";

function UploadForm(props) {
  const fileSelector = useRef();
  const [imageSrc, setImageSrc] = useState("");
  const [results, setResults] = useState("");
  const [croppedImageSrc, setCroppedImageSrc] = useState("");
  const [isPhoto, setIsPhoto] = useState(false);
  const [isCrop, setIsCrop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const cropImage = function (image, cropPos, crop) {
    const imageElement = new Image();
    imageElement.src = image;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imageElement,
      cropPos.x * (256 / cropPos.width),
      cropPos.y * (256 / cropPos.height),
      256,
      256,
      0,
      0,
      256,
      256
    );
    let imageBase64 = canvas.toDataURL("image/jpeg");
    return imageBase64;
  };

  const imageSelected = async function (e) {
    setIsLoading(true);
    setIsCrop(true);

    const myForm = new FormData(e.currentTarget.parentElement);
    const image = myForm.get("image");
    const base64Image = await new Promise((resolve) => {
      FileResizer.imageFileResizer(
        image,
        256,
        256,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        256,
        256
      );
    });
    setImageSrc(base64Image);

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  const upload = function () {
    fileSelector.current[0].click();
  };

  const getResults = async function (e) {
    setIsLoading(true);
    await modelApi(
      process.env.NEXT_PUBLIC_API + "/api/v1/model/",
      croppedImageSrc,
      setResults
    );
    setIsLoading(false);
  };

  if (isCrop) {
    return (
      <div className="uploadForm">
        <div className="uploadForm__back">
          <Button
            onClick={() => {
              setIsCrop(false);
              setImageSrc("");
            }}
            style={buttonStyle.back}
          >
            Upload
          </Button>
        </div>

        {isLoading && <Loading />}

        <Cropper
          disableAutomaticStylesInjection={true}
          image={imageSrc}
          crop={crop}
          aspect={1}
          onCropChange={setCrop}
          className="brs"
          onCropComplete={(areaPos) => {
            setCroppedImageSrc(cropImage(imageSrc, areaPos, crop));
          }}
        ></Cropper>

        <Button
          onClick={() => {
            setIsCrop(false);
            setIsPhoto(true);
          }}
        >
          Crop
        </Button>
      </div>
    );
  }

  if (isPhoto) {
    return (
      <div className="uploadForm grid gridac wmc">
        <div className="uploadForm__back">
          <Button
            onClick={() => {
              setIsPhoto(false);
              setIsCrop(true);
              setResults("");
            }}
            style={buttonStyle.back}
          >
            Crop
          </Button>
        </div>

        <img src={croppedImageSrc} alt="" />

        {isLoading && <Loading />}

        {!results && <Button onClick={getResults}>Get Prediction</Button>}
        {results && <PredictionResults results={results} />}
      </div>
    );
  }

  return (
    <div className="uploadForm">
      {!isPhoto && (
        <Button onClick={upload} style={buttonStyle.thin}>
          Choose File
        </Button>
      )}

      <form ref={fileSelector} className="">
        <input
          onChange={imageSelected}
          type="file"
          name="image"
          accept=".jpeg,.png,.jpg,.mov"
          className="none"
        ></input>
      </form>
    </div>
  );
}

export default UploadForm;
