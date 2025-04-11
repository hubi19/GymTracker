"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase/config";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import Navbar from "@/components/navbar";
import StepIndicator from "@/components/StepIndicator";
import DateSelector from "@/components/appointment/DateSelector";
import GymSelector from "@/components/appointment/GymSelector";
import TrainerSelector from "@/components/appointment/TrainerSelector";
import ExerciseSelector from "@/components/appointment/ExerciseSelector";
import AppointmentSummary from "@/components/appointment/AppointmentSummary";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem("user");
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
  const [appointmentSaved, setAppointmentSaved] = useState(false);

  if (!user && !userSession) {
    router.push("/sign-up");
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
        date: selectedDate,
        gymId: selectedGym?.id,
        gymName: selectedGym?.name,
        trainerId: selectedTrainer?.id,
        trainerName: `${selectedTrainer?.name} ${selectedTrainer?.surname}`,
        exercises: selectedExercises.map((ex) => ({
          id: ex.id,
          muscleGroup: ex.muscleGroup,
          reps: ex.reps,
          sets: ex.sets,
          type: ex.type,
        })),
        createdAt: new Date(),
      };

      const docRef = await addDoc(
        collection(db, "appointments"),
        appointmentData
      );

      setAppointmentSaved(true);
      alert(`Your appointment has been saved! ID: ${docRef.id}`);

      setSelectedDate(new Date());
      setSelectedGym(null);
      setSelectedTrainer(null);
      setSelectedExercises([]);
      setCurrentStep(0);
      setAppointmentSaved(false);
    } catch (error) {
      console.error("Error while saving appointment", error);
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
      <div className="flex flex-col gap-6 items-center p-6">
        <h1 className="text-2xl font-bold text-white">Plan your workout</h1>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="w-full max-w-2xl">{steps[currentStep].component}</div>

        {currentStep === steps.length - 1 && (
          <AppointmentSummary
            selectedDate={selectedDate}
            selectedGym={selectedGym}
            selectedTrainer={selectedTrainer}
            selectedExercises={selectedExercises}
          />
        )}
      </div>
    </main>
  );
}
