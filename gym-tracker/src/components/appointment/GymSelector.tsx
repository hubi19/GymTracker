"use client";
import { Button } from "@/components/ui/button";
import GymData from "@/components/data/gymData";

interface GymSelectorProps {
  selectedGym: { id: string; name?: string } | null;
  setSelectedGym: (gym: { id: string; name?: string } | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function GymSelector({
  selectedGym,
  setSelectedGym,
  onNext,
  onBack,
}: GymSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-white">Select gym</h2>
      <GymData onSelect={setSelectedGym} selected={selectedGym} />
      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedGym}
          className="bg-sky-400 hover:bg-sky-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
