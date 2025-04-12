"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase/config";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import StepIndicator from "@/components/StepIndicator";
import DateSelector from "@/components/appointment/DateSelector";
import GymSelector from "@/components/appointment/GymSelector";
import TrainerSelector from "@/components/appointment/TrainerSelector";
import ExerciseSelector from "@/components/appointment/ExerciseSelector";
import AppointmentSummary from "@/components/appointment/AppointmentSummary";
import AppointmentsList from "@/components/appointment/AppointmentsList";
import Timer from "@/components/Timer";
import SignIn from "./sign-in/page";
import { signOut } from "firebase/auth";
import CameraUpload from "@/components/Camera";

export default function Home() {
  const [user] = useAuthState(auth);
  const [userSession, setUserSession] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<String | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedGym, setSelectedGym] = useState<{
    id: string;
    name?: string;
  } | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<{
    id: string;
    name?: string;
    surname?: string;
    active?: boolean;
  } | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<
    {
      id: string;
      muscleGroup?: string;
      reps?: number;
      sets?: number;
      type: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  if (!user && !userSession) {
    return <SignIn />;
  }

  const steps = [
    {
      title: "Select training date",
      component: (
        <DateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onNext={() => setCurrentStep(1)}
        />
      ),
    },
    {
      title: "Select gym",
      component: (
        <GymSelector
          selectedGym={selectedGym}
          setSelectedGym={setSelectedGym}
          onNext={() => setCurrentStep(2)}
          onBack={() => setCurrentStep(0)}
        />
      ),
    },
    {
      title: "Select trainer",
      component: (
        <TrainerSelector
          selectedTrainer={selectedTrainer}
          setSelectedTrainer={setSelectedTrainer}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      ),
    },
    {
      title: "Select exercises",
      component: (
        <ExerciseSelector
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
          onBack={() => setCurrentStep(2)}
          saveAppointment={saveAppointment}
          isLoading={isLoading}
        />
      ),
    },
  ];

  async function saveAppointment() {
    if (!user) return;

    setIsLoading(true);

    try {
      const appointmentData = {
        userId: user.uid,
        date: selectedDate?.toISOString(),
        gymId: selectedGym?.id,
        gymName: selectedGym?.name,
        trainerId: selectedTrainer?.id,
        trainerName: `${selectedTrainer?.name} ${selectedTrainer?.surname}`,
        exercises: selectedExercises.map((ex) => ({
          exid: ex.id,
          muscleGroup: ex.muscleGroup,
          reps: ex.reps,
          sets: ex.sets,
          type: ex.type,
        })),
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(
        collection(db, "appointments"),
        appointmentData
      );

      const audio = new Audio('/audio/success.mp3');
      audio.play();

      alert(`Your appointment has been saved! ID: ${docRef.id}`);

      setSelectedDate(new Date());
      setSelectedGym(null);
      setSelectedTrainer(null);
      setSelectedExercises([]);
      setCurrentStep(0);
    } catch (error) {
      console.error("Error while saving appointment:", error);
      alert(
        "There was an error while saving your appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="bg-gray-900 min-h-screen flex flex-col items-center justify-evenly text-white">
      <div className="text-4xl p-4">
        <h1>GymTracker</h1>
      </div>
      <div className="flex flex-col w-full gap-4 text-center justify-center mt-4">
        <div className="items-center flex flex-col justify-center">
          <p>Keep working out and plan your next appointment:</p>
          <button
            className={`w-1/2 px-4 py-2 rounded-lg ${
              currentSection === "planner"
                ? "bg-sky-500 text-white"
                : "bg-sky-800"
            }`}
            onClick={() =>
              setCurrentSection((prev) =>
                prev === "planner" ? null : "planner"
              )
            }
          >
            Workout Planner
          </button>
          {currentSection === "planner" && (
            <>
              <h1 className="text-2xl my-4 font-bold text-white">
                Plan your workout
              </h1>
              <StepIndicator steps={steps} currentStep={currentStep} />
              <div className="w-full max-w-2xl">
                {steps[currentStep].component}
              </div>
              {currentStep === steps.length - 1 && (
                <AppointmentSummary
                  selectedDate={selectedDate}
                  selectedGym={selectedGym}
                  selectedTrainer={selectedTrainer}
                  selectedExercises={selectedExercises}
                />
              )}
            </>
          )}
        </div>

        <div className="flex flex-col items-center">
          <p>See your planned appointments:</p>
          <button
            className={`w-1/2 px-4 py-2 rounded-lg ${
              currentSection === "appointments"
                ? "bg-sky-500 text-white"
                : "bg-sky-800"
            }`}
            onClick={() =>
              setCurrentSection((prev) =>
                prev === "appointments" ? null : "appointments"
              )
            }
          >
            Summary of Appointments
          </button>
          {currentSection === "appointments" && <AppointmentsList />}
        </div>
        <div className="flex flex-col items-center w-full">
          <p>Need some warm-up? </p>
          <button
            className={`w-1/2 px-4 py-2 rounded-lg ${
              currentSection === "timer"
                ? "bg-sky-500 text-white"
                : "bg-sky-800"
            }`}
            onClick={() =>
              setCurrentSection((prev) => (prev === "timer" ? null : "timer"))
            }
          >
            Timer
          </button>
          {currentSection === "timer" && <Timer />}
        </div>

        <div>
          <p>Upload your progress:</p>
          <button
            className={`w-1/2 px-4 py-2 rounded-lg ${
              currentSection === "camera" ? "bg-sky-500 text-white" : "bg-sky-800"
            }`}
            onClick={() =>
              setCurrentSection((prev) => (prev === "camera" ? null : "camera"))
            }
          >
            Camera Upload
          </button>
          {currentSection === "camera" && (
              <CameraUpload />
          )}
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="mt-auto mb-10 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Log Out
      </button>

    </main>
  );
}
