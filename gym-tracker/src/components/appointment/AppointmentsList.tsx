"use client";

import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<
    {
      id: string;
      date: any;
      gymName: string;
      trainerName: string;
      exercises: {
        id: string;
        muscleGroup: string;
        sets: number;
        reps: number;
      }[];
    }[]
  >([]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            date: docData.date ? new Date(docData.date) : null,
            gymName: docData.gymName || "",
            trainerName: docData.trainerName || "",
            exercises: Array.isArray(docData.exercises)
              ? docData.exercises
              : [],
          };
        });
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }
    fetchAppointments();
  }, []);

  return (
    <div className="w-1/2 text-start mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment.id} className="p-4 mb-4 bg-gray-700 rounded-lg">
            <p>
              <strong className="text-sky-500">Date:</strong>{" "}
              {appointment.date
                ? appointment.date.toLocaleDateString()
                : "No date available"}
            </p>

            <p>
              <strong className="text-sky-500">Gym:</strong>{" "}
              {appointment.gymName}
            </p>
            <p>
              <strong className="text-sky-500">Trainer:</strong>{" "}
              {appointment.trainerName}
            </p>
            <p>
              <strong className="text-sky-500">Exercises:</strong>
            </p>
            <ul className="list-disc pl-5">
              {appointment.exercises.map((exercise) => (
                <li key={exercise.id}>
                  {exercise.muscleGroup} ({exercise.sets} sets x {exercise.reps}{" "}
                  reps)
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-white">No appointments found.</p>
      )}
    </div>
  );
}
