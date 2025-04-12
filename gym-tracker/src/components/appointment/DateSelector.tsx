"use client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  onNext: () => void;
}

export default function DateSelector({
  selectedDate,
  setSelectedDate,
  onNext,
}: DateSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-white">Select training date</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date) {
            setSelectedDate(date);
          } else {
            console.error("No date selected");
          }
        }}
        className="rounded-md border"
      />
      <Button
        onClick={onNext}
        disabled={!selectedDate}
        className="bg-sky-400 hover:bg-sky-600"
      >
        Next
      </Button>
    </div>
  );
}
