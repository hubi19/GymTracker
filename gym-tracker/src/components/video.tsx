"use client";

import React, { useRef, useState } from "react";

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedChunks(chunks);
        setVideoURL(URL.createObjectURL(blob));
      };
    } catch (err) {
      console.error("Błąd przy włączaniu kamery:", err);
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <video ref={videoRef} className="w-full max-w-md border rounded-lg" />
      <div className="flex gap-2">
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Włącz kamerę
        </button>
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        )}
      </div>
      {videoURL && (
        <div className="mt-4">
          <h3 className="mb-2 text-center font-semibold">Nagranie:</h3>
          <video src={videoURL} controls className="w-full max-w-md rounded-md" />
          <a
            href={videoURL}
            download="nagranie.webm"
            className="block mt-2 text-blue-600 underline text-center"
          >
            Pobierz wideo
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
