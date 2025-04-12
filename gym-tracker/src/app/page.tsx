"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase/config";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Navbar from "@/components/navbar";
import StepIndicator from "@/components/StepIndicator";
import DateSelector from "@/components/appointment/DateSelector";
import GymSelector from "@/components/appointment/GymSelector";
import TrainerSelector from "@/components/appointment/TrainerSelector";
import ExerciseSelector from "@/components/appointment/ExerciseSelector";
import AppointmentSummary from "@/components/appointment/AppointmentSummary";
import AppointmentsList from "@/components/appointment/AppointmentsList";
import Timer from "@/components/Timer";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState("planner");
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

  useEffect(() => {
    const session = sessionStorage.getItem("user");
    setUserSession(session);
  }, []);

  if (!user && !userSession) {
    router.push("/sign-up");
    return null; // Uniknięcie renderowania przed przekierowaniem
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
    if (!user) return; // Ensure the user is logged in

    setIsLoading(true);

    try {
      // Prepare appointment data
      const appointmentData = {
        userId: user.uid,
        date: selectedDate?.toISOString(), // Store date as ISO string
        gymId: selectedGym?.id,
        gymName: selectedGym?.name,
        trainerId: selectedTrainer?.id,
        trainerName: `${selectedTrainer?.name} ${selectedTrainer?.surname}`,
        exercises: selectedExercises.map((ex) => ({
          exid: ex.id, // Unique identifier for each exercise
          muscleGroup: ex.muscleGroup,
          reps: ex.reps,
          sets: ex.sets,
          type: ex.type,
        })),
        createdAt: new Date().toISOString(), // Timestamp for when the appointment was created
      };

      // Add appointment to Firestore
      const docRef = await addDoc(
        collection(db, "appointments"),
        appointmentData
      );

      // Notify user of success
      alert(`Your appointment has been saved! ID: ${docRef.id}`);

      // Reset form after successful save
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
    <main>
      <Navbar />

      <div className="flex flex-col gap-4 justify-center mt-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            currentSection === "planner"
              ? "bg-sky-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setCurrentSection("planner")}
        >
          Workout Planner
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            currentSection === "appointments"
              ? "bg-sky-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setCurrentSection("appointments")}
        >
          Summary of Appointments
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            currentSection === "timer" ? "bg-sky-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setCurrentSection("timer")}
        >
          Timer
        </button>
      </div>

      {/* Section Content */}
      <div className="flex flex-col gap-6 items-center p-6">
        {currentSection === "planner" && (
          <>
            <h1 className="text-2xl font-bold text-white">Plan your workout</h1>
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

        {currentSection === "appointments" && (
          <>
            <h1 className="text-2xl font-bold text-white">
              Summary of Appointments
            </h1>
            <AppointmentsList />
          </>
        )}

        {currentSection === "timer" && (
          <>
            <h1 className="text-2xl font-bold text-white">Timer</h1>
            <Timer />
          </>
        )}
      </div>
    </main>
  );
}
