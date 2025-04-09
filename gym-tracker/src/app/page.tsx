"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import Map from "@/components/map";
import dynamic from "next/dynamic";
import ExerciseData from "@/components/exerciseData";
import TrainersData from "@/components/trainersData";

export default function Home() {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const userSession = sessionStorage.getItem("user");

	// const Map = dynamic(() => import("@/components/map"), {
	// 	ssr: false,
	// });

	if (!user && !userSession) {
		router.push("/sign-up");
	}

	console.log(user);

	return (
		<main className="flex min-h-screen flex-col items-center">
			<h1 className="text-2xl font-bold text-indigo-200">Welcome</h1>
			<ExerciseData />
			<TrainersData />
			{/* <Map /> */}
		</main>
	);
}
