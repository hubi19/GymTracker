"use client";

import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await signInWithEmailAndPassword(email, password);
			console.log(res);
			sessionStorage.setItem("user", "true");
			setEmail("");
			setPassword("");
			return router.push("/");
		} catch (error) {
			console.error("Error signing in:", error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-900">
			<div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
				<h2 className="text-3xl font-bold text-center text-white">
					Sign In
				</h2>
				<form onSubmit={handleSignIn} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-300"
						>
							Email Address
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your email"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-300"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your password"
						/>
					</div>

					<button
						type="submit"
						className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Sign In
					</button>
				</form>

				<p className="text-sm text-center text-gray-400">
					Don't have an account?{" "}
					<a
						href="/sign-up"
						className="text-blue-500 hover:underline"
					>
						Sign up here
					</a>
				</p>
			</div>
		</div>
	);
}
