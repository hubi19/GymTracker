"use client";
import { Button } from "@/components/ui/button";
import TrainersData from "@/components/data/trainersData";

interface TrainerSelectorProps {
  selectedTrainer: {
    id: string;
    name?: string;
    surname?: string;
    active?: boolean;
  } | null;
  setSelectedTrainer: (
    trainer: {
      id: string;
      name?: string;
      surname?: string;
      active?: boolean;
    } | null
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TrainerSelector({
  selectedTrainer,
  setSelectedTrainer,
  onNext,
  onBack,
}: TrainerSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-white">Select trainer</h2>
      <TrainersData onSelect={setSelectedTrainer} selected={selectedTrainer} />
      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedTrainer}
          className="bg-sky-400 hover:bg-sky-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
