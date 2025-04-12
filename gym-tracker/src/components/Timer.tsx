"use client";

import React, { useState, useEffect } from "react";

export default function Timer() {
  const [time, setTime] = useState<number>(300); // Default time: 5 minutes (300 seconds)
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false); // Stop timer when it reaches zero
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
    setTime(300); // Reset to default time: 5 minutes
  };

  const handleAddTime = () => {
    setTime((prevTime) => prevTime + 30); // Add 30 seconds
  };

  const handleSubtractTime = () => {
    setTime((prevTime) => (prevTime > 30 ? prevTime - 30 : prevTime)); // Subtract 30 seconds, but not below zero
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white text-center">Timer</h2>

      {/* Timer Display */}
      <div className="text-center my-4">
        <span className="text-3xl font-bold text-white">
          {formatTime(time)}
        </span>
      </div>

      {/* Adjust Timer */}
      {!isRunning && (
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleAddTime}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            +30s
          </button>
          <button
            onClick={handleSubtractTime}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            -30s
          </button>
        </div>
      )}

      {/* Timer Controls */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Start Timer
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
