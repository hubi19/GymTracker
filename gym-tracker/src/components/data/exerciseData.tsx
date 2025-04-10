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
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";

type Exercise = {
	id: string;
	muscleGroup?: string;
	reps?: number;
	sets?: number;
	type: string;
};

interface ExerciseDataProps {
	onSelect: (exercises: Exercise[]) => void;
	selected: Exercise[];
}

async function fetchExercises() {
	const querySnapshot = await getDocs(collection(db, "exercises"));
	const data: Exercise[] = [];
	querySnapshot.forEach((doc) => {
		const docData = doc.data();
		data.push({
			id: doc.id,
			muscleGroup: docData.muscleGroup || "",
			reps: docData.reps || 0,
			sets: docData.sets || 0,
			type: docData.type || "",
		});
	});
	return data;
}

export default function ExerciseData({
	onSelect,
	selected,
}: ExerciseDataProps) {
	const [exerciseData, setExerciseData] = useState<Exercise[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			try {
				const data = await fetchExercises();
				setExerciseData(data);
			} catch (error) {
				console.error("Error fetching exercises:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	const toggleExercise = (exercise: Exercise) => {
		const isSelected = selected.some((e) => e.id === exercise.id);

		if (isSelected) {
			onSelect(selected.filter((e) => e.id !== exercise.id));
		} else {
			onSelect([...selected, exercise]);
		}
	};

	const removeExercise = (id: string) => {
		onSelect(selected.filter((e) => e.id !== id));
	};

	return (
		<div className="w-full max-w-md">
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger className="w-full px-4 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-700 flex justify-between items-center">
					<span>Select exercise ({selected.length})</span>
					<span>▼</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
					<DropdownMenuLabel>Exercises</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						{isLoading ? (
							<DropdownMenuItem disabled>
								Loading...
							</DropdownMenuItem>
						) : exerciseData.length > 0 ? (
							exerciseData.map((exercise) => {
								const isSelected = selected.some(
									(e) => e.id === exercise.id
								);
								return (
									<DropdownMenuItem
										key={exercise.id}
										className={`cursor-pointer ${isSelected ? "bg-sky-400" : ""}`}
										onClick={() => toggleExercise(exercise)}
									>
										<div className="flex items-center w-full">
											<div className="mr-2">
												{isSelected ? (
													<CheckIcon className="h-4 w-4 text-sky-600" />
												) : (
													<div className="h-4 w-4 rounded-full border border-gray-300" />
												)}
											</div>
											<div className="flex flex-col">
												<span className="font-medium">
													{exercise.id}
												</span>
												<span className="text-xs text-gray-500">
													{exercise.muscleGroup} -{" "}
													{exercise.sets} sets x{" "}
													{exercise.reps} reps
												</span>
												<span className="text-xs text-gray-500">
													Typ: {exercise.type}
												</span>
											</div>
										</div>
									</DropdownMenuItem>
								);
							})
						) : (
							<DropdownMenuItem disabled>
								No available exercises
							</DropdownMenuItem>
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			{selected.length > 0 && (
				<div className="mt-4">
					<h3 className="text-sm font-medium mb-2">
						Selected Exercises:
					</h3>
					<div className="space-y-2">
						{selected.map((exercise) => (
							<div
								key={exercise.id}
								className="flex items-center justify-between bg-sky-600 p-2 rounded-md"
							>
								<div>
									<p className="font-medium">{exercise.id}</p>
									<p className="text-xs text-gray-600">
										{exercise.muscleGroup} - {exercise.sets}{" "}
										sets x {exercise.reps} reps
									</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => removeExercise(exercise.id)}
									className="h-6 w-6 p-0 rounded-full"
								>
									<XIcon className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
