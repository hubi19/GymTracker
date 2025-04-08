"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import Navbar from "@/components/navbar";

export default function Home() {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const userSession = sessionStorage.getItem("user");

	if (!user && !userSession) {
		router.push("/sign-up");
	}

	console.log(user);

	return (
		<main>
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<button
				onClick={() => {
					signOut(auth);
					sessionStorage.removeItem("user");
				}}
			>
				Log out
			</button>
		</main>
	);
}
