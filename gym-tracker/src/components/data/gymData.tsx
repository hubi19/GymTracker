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

type Gym = {
  id: string;
  name?: string;
};

interface GymDataProps {
  onSelect: (gym: Gym | null) => void;
  selected: Gym | null;
}

async function fetchGyms() {
  const querySnapshot = await getDocs(collection(db, "gyms"));
  const data: Gym[] = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    data.push({
      id: doc.id,
      name: docData.name || "",
    });
  });
  return data;
}

export default function GymData({ onSelect, selected }: GymDataProps) {
  const [gymData, setGymData] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await fetchGyms();
        setGymData(data);
      } catch (error) {
        console.error("Error fetching gyms:", error);
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
          <span>{selected ? selected.name : "Select gym"}</span>
          <span>▼</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>Gyms</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          ) : gymData.length > 0 ? (
            gymData.map((gym) => (
              <DropdownMenuItem
                key={gym.id}
                className="cursor-pointer"
                onClick={() => onSelect(gym)}
              >
                <div className="flex flex-col w-full">
                  <span className="font-medium">{gym.name}</span>
                  <span className="text-xs text-gray-500">ID: {gym.id}</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No gyms available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selected && (
        <div className="mt-2 p-2 bg-sky-600 rounded-md">
          <p className="text-sm font-medium">Selected gym: {selected.name}</p>
        </div>
      )}
    </div>
  );
}
