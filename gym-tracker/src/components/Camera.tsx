"use client";

import React, { useRef, useState, useEffect } from "react";
import { storage, db } from "@/app/firebase/config";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function CameraUpload() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; createdAt: string }[]
  >([]);

  useEffect(() => {
    const fetchUploadedImages = async () => {
      try {
        const imagesQuery = query(
          collection(db, "images"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(imagesQuery);
        const images = querySnapshot.docs.map((doc) => ({
          url: doc.data().url,
          createdAt: new Date(doc.data().createdAt).toLocaleString(),
        }));
        setUploadedImages(images);
      } catch (error) {
        console.error("Error fetching uploaded images:", error);
      }
    };

    fetchUploadedImages();
  }, []);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access your camera. Please check permissions.");
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const handleCaptureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");

      try {
        const storageRef = ref(storage, `images/${Date.now()}.png`);
        await uploadString(storageRef, imageData.split(",")[1], "base64");

        const downloadURL = await getDownloadURL(storageRef);
        setImageURL(downloadURL);

        await addDoc(collection(db, "images"), {
          url: downloadURL,
          createdAt: new Date().toISOString(),
        });

        alert("Image uploaded and saved successfully!");

        setUploadedImages((prev) => [
          { url: downloadURL, createdAt: new Date().toLocaleString() },
          ...prev,
        ]);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-white">Camera Upload</h1>
      <div className="flex gap-4">
        <button
          onClick={handleStartCamera}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Start Camera
        </button>
        <button
          onClick={handleStopCamera}
          disabled={!isCameraOn}
          className={`px-4 py-2 rounded-lg ${
            isCameraOn
              ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          Stop Camera
        </button>
        <button
          onClick={handleCaptureImage}
          disabled={!isCameraOn}
          className={`px-4 py-2 rounded-lg ${
            isCameraOn
              ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          Capture & Upload
        </button>
      </div>
      <video
        ref={videoRef}
        className="w-full max-w-md rounded-lg border border-gray-700"
        autoPlay
      ></video>
      <canvas ref={canvasRef} className="hidden"></canvas>

      {imageURL && (
        <div className="mt-4">
          <p className="text-white">Uploaded Image:</p>
          <img
            src={imageURL}
            alt="Uploaded"
            className="rounded-lg border border-gray-700"
          />
        </div>
      )}

      <div className="mt-6 w-full">
        <h2 className="text-lg font-bold text-white mb-4">Uploaded Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={image.url}
                alt={`Uploaded ${index}`}
                className="w-full max-w-xs rounded-lg border border-gray-700"
              />
              <p className="text-sm text-gray-400 mt-2">{image.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
