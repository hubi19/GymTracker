"use client";

import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

async function fetchTrainers() {
	const querySnapshot = await getDocs(collection(db, "trainers"));
	console.log("Trainers snapshot:", querySnapshot);
	const data: {
		id: string;
		name: string;
		surname: string;
		active: boolean;
	}[] = [];
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

export default function TrainersData() {
	const [trainersData, setTrainersData] = useState<
		{
			id: string;
			name?: string;
			surname?: string;
			active?: boolean;
		}[]
	>([]);

	useEffect(() => {
		async function fetchData() {
			const data = await fetchTrainers();
			setTrainersData(data);
		}
		fetchData();
	}, []);

	return (
		<div className="flex flex-row gap-4">
			{trainersData.length > 0 ? (
				trainersData.map((trainer) => (
					<div key={trainer.id}>
						<h1>{trainer.id}</h1>
						<p>{trainer.name}</p>
						<p>{trainer.surname}</p>
						<p>{trainer.active ? "Active" : "Inactive"}</p>
					</div>
				))
			) : (
				<p>Loading trainers data...</p>
			)}
		</div>
	);
}
