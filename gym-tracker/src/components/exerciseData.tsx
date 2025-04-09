"use client";

import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

async function fetchExercises() {
	const querySnapshot = await getDocs(collection(db, "exercises"));

	const data: {
		id: string;
		muscleGroup?: string;
		reps?: number;
		sets?: number;
		type: string;
	}[] = [];
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
export default function ExerciseData() {
	const [exerciseData, setExerciseData] = useState<
		{
			id: string;
			muscleGroup?: string;
			reps?: number;
			sets?: number;
			type: string;
		}[]
	>([]);

	useEffect(() => {
		async function fetchData() {
			const data = await fetchExercises();
			setExerciseData(data);
		}
		fetchData();
	}, []);

	return (
		<div className="flex flex-row gap-4">
			{exerciseData.map((exercise) => (
				<div key={exercise.id}>
					<h1 className="text-xl font-bold text-indigo-500">
						{exercise.id}
					</h1>
					<p>{exercise.muscleGroup}</p>
					<p>{exercise.reps}</p>
					<p>{exercise.sets}</p>
					<p>{exercise.type}</p>
				</div>
			))}
		</div>
	);
}
