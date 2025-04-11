"use client";

interface AppointmentSummaryProps {
  selectedDate: Date | undefined;
  selectedGym: { id: string; name?: string } | null;
  selectedTrainer: {
    id: string;
    name?: string;
    surname?: string;
    active?: boolean;
  } | null;
  selectedExercises: {
    id: string;
    muscleGroup?: string;
    reps?: number;
    sets?: number;
    type: string;
  }[];
}

export default function AppointmentSummary({
  selectedDate,
  selectedGym,
  selectedTrainer,
  selectedExercises,
}: AppointmentSummaryProps) {
  return (
    <div className="mt-8 p-4 border rounded-md bg-sky-500 w-full max-w-2xl">
      <h3 className="text-2xl text-white mb-2">Summary</h3>
      <p>
        <span className="font-medium">Date:</span>{" "}
        {selectedDate?.toLocaleDateString()}
      </p>
      <p>
        <span className="font-medium">Gym:</span> {selectedGym?.name}
      </p>
      <p>
        <span className="font-medium">Trainer:</span> {selectedTrainer?.name}{" "}
        {selectedTrainer?.surname}
      </p>
      <p className="font-medium mt-2">Exercises:</p>
      <ul className="list-disc pl-5">
        {selectedExercises.map((ex) => (
          <li key={ex.id}>
            {ex.id} - {ex.muscleGroup} ({ex.sets} sets x {ex.reps} reps)
          </li>
        ))}
      </ul>
    </div>
  );
}
