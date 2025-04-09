// components/Map.js
"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const Map = () => {
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef(null);
	const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
	const [accuracy, setAccuracy] = useState(0);

	useEffect(() => {
		// Fix default icon issue
		L.Icon.Default.mergeOptions({
			iconUrl: icon,
			iconRetinaUrl: icon,
			shadowUrl: iconShadow,
		});

		// Initialize map
		if (!mapRef.current) {
			if (mapContainerRef.current) {
				mapRef.current = L.map(mapContainerRef.current).setView(
					[position.lat, position.lng],
					13
				);
			}

			// Add tile layer
			L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution:
					'© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(mapRef.current!);

			// Get user location
			if (mapRef.current) {
				mapRef.current.locate({
					setView: true,
					maxZoom: 16,
				});
			}

			// Handle successful location finding
			mapRef.current?.on("locationfound", (e) => {
				setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
				setAccuracy(e.accuracy);

				// Add marker at user's location
				if (mapRef.current) {
					const marker = L.marker(e.latlng)
						.addTo(mapRef.current!)
						.bindPopup(
							`You are within ${e.accuracy} meters from this point`
						)
						.openPopup();
				}

				// Add accuracy circle
				const circle = L.circle(e.latlng, {
					radius: e.accuracy,
					color: "blue",
					fillColor: "#3388ff",
					fillOpacity: 0.2,
				}).addTo(mapRef.current!);
			});

			// Handle location error
			if (mapRef.current) {
				mapRef.current.on("locationerror", (e) => {
					alert(e.message);
				});
			}
		}

		// Cleanup on unmount
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, []);

	return (
		<div className="relative w-full h-[500px]">
			<div ref={mapContainerRef} className="absolute w-full h-full" />
		</div>
	);
};

export default Map;
