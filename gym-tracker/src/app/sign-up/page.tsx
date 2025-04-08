"use client";

import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [createUserWithEmailAndPassword] =
		useCreateUserWithEmailAndPassword(auth);
	const router = useRouter();
	const handleSignUp = async () => {
		try {
			const res = await createUserWithEmailAndPassword(email, password);
			console.log({ res });
			sessionStorage.setItem("user", "true");
			setEmail("");
			setPassword("");
		} catch (e) {
			console.error(e);
		}
	};

	const handleSignUpWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const res = await signInWithPopup(auth, provider);
			console.log({ res });
			sessionStorage.setItem("user", "true");
			router.push("/");
		} catch (error) {
			console.error("Error during Google sign-in:", error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-900">
			<div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
				<h2 className="text-3xl font-bold text-center text-white">
					Sign Up
				</h2>
				<form onSubmit={handleSignUp} className="space-y-6">
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
						Sign Up
					</button>
				</form>
				<div className="flex items-center justify-center">
					<p className="text-sm text-gray-400">or</p>
				</div>
				<div>
					<button
						onClick={handleSignUpWithGoogle}
						className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
					>
						Log in with Google
					</button>
				</div>

				<p className="text-sm text-center text-gray-400">
					Already have an account?{" "}
					<a
						href="/sign-in"
						className="text-blue-500 hover:underline"
					>
						Log in here
					</a>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
