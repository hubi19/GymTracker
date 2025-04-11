"use client";
import { Button } from "@/components/ui/button";
import ExerciseData from "@/components/data/exerciseData";

interface ExerciseSelectorProps {
  selectedExercises: {
    id: string;
    muscleGroup?: string;
    reps?: number;
    sets?: number;
    type: string;
  }[];
  setSelectedExercises: (
    exercises: {
      id: string;
      muscleGroup?: string;
      reps?: number;
      sets?: number;
      type: string;
    }[]
  ) => void;
  onBack: () => void;
  saveAppointment: () => Promise<void>;
  isLoading: boolean;
}

export default function ExerciseSelector({
  selectedExercises,
  setSelectedExercises,
  onBack,
  saveAppointment,
  isLoading,
}: ExerciseSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-white">Select exercises</h2>
      <ExerciseData
        onSelect={setSelectedExercises}
        selected={selectedExercises}
      />
      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={saveAppointment}
          disabled={selectedExercises.length === 0 || isLoading}
          className="bg-green-500 hover:bg-green-600"
        >
          {isLoading ? "Saving..." : "Save appointment"}
        </Button>
      </div>
    </div>
  );
}
