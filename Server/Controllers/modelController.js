import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import urlencode from "urlencode";
import { User } from "../Models/userModel.js";
import { promisify } from "util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function processImage(req, res) {
  // Check if there is an image.
  let base64;
  try {
    base64 = req.body.data.image.split(",")[1];
  } catch (e) {
    res.status(500).json({
      status: "failure",
      data: { message: "Please provide an image" },
    });
  }

  // Write image to disk.
  const fileName = `${Math.floor(Math.random() * 100000)}${Date.now()}.jpeg`;
  const imageBuffer = Buffer.from(base64, "base64");
  const fullFilePath = path.join(__dirname, "..", "images", fileName);
  await promisify(fs.writeFile)(fullFilePath, imageBuffer);

  // Full path to image.
  const imgPath = urlencode(path.join(__dirname, "..", "images", fileName));

  // Fetch prediction results from server.
  let result;
  try {
    result = await fetch("http://127.0.0.1:3002/api/predict", {
      body: JSON.stringify({ image: imgPath }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch (e) {
    return res.status(500).json({
      status: "failure",
      data: {
        message: "Unable to get prediction",
      },
    });
  }

  const data = await result.json();

  // Save results to database
  const predictionResult = data.data.predictions;
  const prediction1 = `${predictionResult[0].name} - ${String(
    predictionResult[0].percent
  ).slice(0, 4)}%`;
  const prediction2 = `${predictionResult[1].name} - ${String(
    predictionResult[1].percent
  ).slice(0, 4)}%`;

  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          images: fileName,
          predictions: { predictions: [prediction1, prediction2] },
        },
      },
      { runValidators: true }
    );
  } catch (e) {
    return res.status(500).json({
      status: "failure",
      data: {
        message: "Could not save results.",
      },
    });
  }

  return res.status(200).json({
    status: "success",
    ...data,
  });
}

// Return saved images
export async function images(req, res) {
  // Only return images that belong to user unless they are an admin.
  if (req.user.role === "user") {
    const imageIndex = req.user.images.includes(req.params.image);

    if (!imageIndex) {
      return res.status(400).json({
        status: "failure",
        data: {
          message: "Unable to find image",
        },
      });
    }
  }

  const imgPath = path.join(__dirname, "..", "images", req.params.image);

  return res.status(200).sendFile(imgPath);
}

// Statistics about the model and dataset used
export async function modelInfo(req, res) {
  let result;
  try {
    result = await fetch("http://127.0.0.1:3002/api/stats", {
      method: "GET",
    });
  } catch (e) {
    return res.status(500).json({
      status: "failure",
      data: {
        message: "Unable to get stats.",
      },
    });
  }

  const data = await result.json();

  return res.status(200).json({
    status: "success",
    ...data,
  });
}
