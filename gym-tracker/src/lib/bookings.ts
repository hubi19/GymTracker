import { db } from "../app/firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

interface BookingData {
	date: string;
	exercises: { id: string }[];
	trainerId: string;
}

export const CreateBooking = async (
	userId: string,
	bookingData: BookingData
) => {
	try {
		const docRef = await addDoc(collection(db, "bookings"), {
			userId,
			date: bookingData.date,
			exercisesIds: bookingData.exercises.map((exercise) => exercise.id),
			trainerId: bookingData.trainerId,
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding booking: ", error);
		return null;
	}
};

export const getUserBookings = async (userId: string) => {
	const q = query(collection(db, "bookings"), where("userId", "==", userId));
	const querySnapshot = await getDocs(q);
	const bookings: { id: string }[] = [];
	querySnapshot.forEach((doc) => {
		bookings.push({ id: doc.id, ...doc.data() });
	});
	return bookings;
};
