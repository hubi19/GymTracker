"use client";

import React, { useState, useEffect } from "react";

export default function Timer() {
  const [time, setTime] = useState<number>(300);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([500, 200, 500]);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time]);

  const handleStart = () => {
    if (time > 0) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(300);
  };

  const handleAddTime = () => {
    setTime((prevTime) => prevTime + 30);
  };

  const handleSubtractTime = () => {
    setTime((prevTime) => (prevTime > 30 ? prevTime - 30 : prevTime));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg mt-4 shadow-md">
      <div className="text-center">
        <span className="text-3xl font-bold text-white">
          {formatTime(time)}
        </span>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="w-1/2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Start Timer
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="w-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          className="w-1/2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Reset
        </button>
      </div>

      {!isRunning && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleAddTime}
            className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            +30s
          </button>
          <button
            onClick={handleSubtractTime}
            className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            -30s
          </button>
        </div>
      )}

      <div className="flex flex-col justify-start mt-4">
        <p className="text-sm text-gray-400">Sample warm-up exercises:</p>
        <ul className="list-disc list-inside text-start space-y-1">
          <li className="text-gray-300">Jumping Jacks</li>
          <li className="text-gray-300">High Knees</li>
          <li className="text-gray-300">Arm Circles</li>
          <li className="text-gray-300">Leg Swings</li>
          <li className="text-gray-300">Push-ups</li>
          <li className="text-gray-300">Plank</li>
        </ul>
      </div>
    </div>
  );
}
