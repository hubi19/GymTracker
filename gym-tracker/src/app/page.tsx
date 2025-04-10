"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import ExerciseData from "@/components/exerciseData";
import TrainersData from "@/components/trainersData";
import VideoRecorder from "@/components/video";
import { useEffect, useState } from "react";

export default function Home() {
	const [user] = useAuthState(auth);
	const router = useRouter();

	const [userSession, setUserSession] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const session = sessionStorage.getItem("user");
			setUserSession(session);
		}
	}, []);

	useEffect(() => {
		if (!user && !userSession) {
			router.push("/sign-up");
		}
	}, [user, userSession, router]);

	return (
		<main className="flex min-h-screen flex-col items-center">
			<h1 className="text-2xl font-bold text-indigo-200">Welcome</h1>
			<ExerciseData />
			<TrainersData />
			<VideoRecorder />
			{/* <Map /> */}
		</main>
	);
}
