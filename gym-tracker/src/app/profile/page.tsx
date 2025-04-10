"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Profile() {
	const [user, setUser] = useState<{
		id?: string;
		name?: string;
		email?: string;
	} | null>(null);
	const router = useRouter();
	const [userSession, setUserSession] = useState<string | null>(null);

	useEffect(() => {
	if (typeof window !== "undefined") {
		const session = sessionStorage.getItem("user");
		setUserSession(session);
	}
}, []);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				const username = currentUser.email
					? currentUser.email.split("@")[0]
					: "Unknown";

				setUser({
					id: currentUser.uid,
					name: username,
					email: currentUser.email || "",
				});
			} else {
				setUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	if (!user && !userSession) {
		router.push("/sign-up");
	}

	return (
		<div className="min-h-screen flex flex-col items-center py-10">
			<div className="bg-indigo-500 shadow-md rounded-lg p-6 w-full max-w-md">
				<div className="flex flex-col items-center justify-center mb-4">
					<IoPerson color="white" size={100} />
					<h1 className="text-2xl font-bold text-white mb-4">
						{user?.name || ""}
					</h1>
				</div>
				<p className="text-white mb-2">
					<strong>ID:</strong> {user?.id || ""}
				</p>
				<p className="text-white mb-2">
					<strong>Email:</strong> {user?.email || ""}
				</p>
				<button
					onClick={() => {
						signOut(auth);
						sessionStorage.removeItem("user");
					}}
					className="mt-4 w-full bg-indigo-800 text-white font-bold py-2 px-4 rounded hover:bg-indigo-300"
				>
					Logout
				</button>
			</div>
		</div>
	);
}
