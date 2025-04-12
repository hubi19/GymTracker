"use client";

import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Trainer = {
  id: string;
  name?: string;
  surname?: string;
  active?: boolean;
};

interface TrainersDataProps {
  onSelect: (trainer: Trainer | null) => void;
  selected: Trainer | null;
}

async function fetchTrainers() {
  const querySnapshot = await getDocs(collection(db, " trainers"));
  const data: Trainer[] = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    data.push({
      id: doc.id,
      name: docData.name || "",
      surname: docData.surname || "",
      active: docData.active || true,
    });
  });
  return data;
}

export default function TrainersData({
  onSelect,
  selected,
}: TrainersDataProps) {
  const [trainersData, setTrainersData] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await fetchTrainers();
        setTrainersData(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-md">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full px-4 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-600 flex justify-between items-center">
          <span>
            {selected
              ? `${selected.name} ${selected.surname}`
              : "Select trainer"}
          </span>
          <span>▼</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>Trainers</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          ) : trainersData.length > 0 ? (
            trainersData
              .filter((trainer) => trainer.active)
              .map((trainer) => (
                <DropdownMenuItem
                  key={trainer.id}
                  className="cursor-pointer"
                  onClick={() => onSelect(trainer)}
                >
                  <div className="flex flex-col w-full">
                    <span className="font-medium">
                      {trainer.name} {trainer.surname}
                    </span>
                    <span className="text-xs text-gray-500">{trainer.id}</span>
                  </div>
                </DropdownMenuItem>
              ))
          ) : (
            <DropdownMenuItem disabled>No trainers available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selected && (
        <div className="mt-2 p-2 bg-sky-600 rounded-md">
          <p className="text-sm font-medium">
            Selected trainer: {selected.name} {selected.surname}
          </p>
        </div>
      )}
    </div>
  );
}
