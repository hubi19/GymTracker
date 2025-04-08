import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { IoPerson } from "react-icons/io5";

export default function Navbar() {
	return (
		<div className="p-2 flex items-center flex-row gap-6 justify-end">
			<Link href="/profile">
				<IoPerson color="#667" size={25} />
			</Link>
			<ModeToggle />
		</div>
	);
}
