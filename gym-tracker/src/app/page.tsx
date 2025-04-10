"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase/config";
import { useRouter } from "next/navigation";
import ExerciseData from "@/components/data/exerciseData";
import TrainersData from "@/components/data/trainersData";
import GymData from "@/components/data/gymData";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import Navbar from "@/components/navbar";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";

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

	if (!user && !userSession) {
		router.push("/sign-up");
	}

	const steps = [
		{
			title: "Select training date",
			component: (
				<div className="flex flex-col items-center gap-4">
					<h2 className="text-xl font-semibold text-white">
						Select training date
					</h2>
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={setSelectedDate}
						className="rounded-md border"
					/>
					<Button
						onClick={() => setCurrentStep(1)}
						disabled={!selectedDate}
						className="bg-sky-400 hover:bg-sky-600"
					>
						Next
					</Button>
				</div>
			),
		},
		{
			title: "Select gym",
			component: (
				<div className="flex flex-col items-center gap-4">
					<h2 className="text-xl font-semibold text-white">
						Select gym
					</h2>
					<GymData onSelect={setSelectedGym} selected={selectedGym} />
					<div className="flex gap-4">
						<Button
							onClick={() => setCurrentStep(0)}
							variant="outline"
						>
							Back
						</Button>
						<Button
							onClick={() => setCurrentStep(2)}
							disabled={!selectedGym}
							className="bg-sky-400 hover:bg-sky-600"
						>
							Next
						</Button>
					</div>
				</div>
			),
		},
		{
			title: "Select trainer",
			component: (
				<div className="flex flex-col items-center gap-4">
					<h2 className="text-xl font-semibold text-white">
						Select trainer
					</h2>
					<TrainersData
						onSelect={setSelectedTrainer}
						selected={selectedTrainer}
					/>
					<div className="flex gap-4">
						<Button
							onClick={() => setCurrentStep(1)}
							variant="outline"
						>
							Back
						</Button>
						<Button
							onClick={() => setCurrentStep(3)}
							disabled={!selectedTrainer}
							className="bg-sky-400 hover:bg-sky-600"
						>
							Next
						</Button>
					</div>
				</div>
			),
		},
		{
			title: "Select exercises",
			component: (
				<div className="flex flex-col items-center gap-4">
					<h2 className="text-xl font-semibold text-white">
						Select exercises
					</h2>
					<ExerciseData
						onSelect={setSelectedExercises}
						selected={selectedExercises}
					/>
					<div className="flex gap-4">
						<Button
							onClick={() => setCurrentStep(2)}
							variant="outline"
						>
							Wstecz
						</Button>
						<Button
							onClick={saveAppointment}
							disabled={
								selectedExercises.length === 0 || isLoading
							}
							className="bg-green-500 hover:bg-green-600"
						>
							{isLoading ? "Saving..." : "Save appointment"}
						</Button>
					</div>
				</div>
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

			alert(`Your appointment has been saved! ID: ${docRef.id}`);

			setSelectedDate(new Date());
			setSelectedGym(null);
			setSelectedTrainer(null);
			setSelectedExercises([]);
			setCurrentStep(0);
		} catch (error) {
			console.error("Error while saving appointment", error);
			alert(
				"There was an error while saving your appointment. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	}

	const StepIndicator = () => (
		<div className="flex justify-center mb-8">
			{steps.map((step, index) => (
				<div key={index} className="flex items-center">
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center ${
							currentStep === index
								? "bg-sky-400 text-white"
								: currentStep > index
									? "bg-green-500 text-white"
									: "bg-gray-200 text-gray-600"
						}`}
					>
						{currentStep > index ? "✓" : index + 1}
					</div>
					{index < steps.length - 1 && (
						<div
							className={`h-1 w-12 ${
								currentStep > index
									? "bg-green-500"
									: "bg-gray-200"
							}`}
						/>
					)}
				</div>
			))}
		</div>
	);

	return (
		<main>
			<Navbar />
			<div className="flex flex-col gap-6  items-center p-6">
				<h1 className="text-2xl font-bold text-white">
					Plan your workout
				</h1>

				<StepIndicator />

				<div className="w-full max-w-2xl">
					{steps[currentStep].component}
				</div>

				{currentStep === steps.length - 1 && (
					<div className="mt-8 p-4 border rounded-md bg-sky-500 w-full max-w-2xl">
						<h3 className="text-2xl text-white mb-2">Summary</h3>
						<p>
							<span className="font-medium">Date:</span>{" "}
							{selectedDate?.toLocaleDateString()}
						</p>
						<p>
							<span className="font-medium">Gym:</span>{" "}
							{selectedGym?.name}
						</p>
						<p>
							<span className="font-medium">Trainer:</span>{" "}
							{selectedTrainer?.name} {selectedTrainer?.surname}
						</p>
						<p className="font-medium mt-2">Exercises:</p>
						<ul className="list-disc pl-5">
							{selectedExercises.map((ex) => (
								<li key={ex.id}>
									{ex.id} - {ex.muscleGroup} ({ex.sets} sets x{" "}
									{ex.reps} reps)
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</main>
	);
}
