import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext();

export const LocationProvide = ({ children }) => {
  const [location, setLocationState] = useState(() => {
    return localStorage.getItem("user-location") || "West Bengal";
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setLocation = (newLoc) => {
    setLocationState(newLoc);
    localStorage.setItem("user-location", newLoc);
  };

  useEffect(() => {
    // If location is manually set, stop loading auto-location
    if (localStorage.getItem("user-location")) {
      setLoading(false);
      return;
    }

    const fetchLocationData = async (latitude, longitude) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        const userLocation = data?.address?.state;
        if (userLocation) {
          setLocation(userLocation);
        }
      } catch (error) {
        setError("Failed to fetch location data");
        setLocation("West Bengal");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocationData(latitude, longitude);
      },
      () => {
        setError("Unable to retrieve your location");
        setLocation("West Bengal");
        setLoading(false);
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation, loading, error }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);