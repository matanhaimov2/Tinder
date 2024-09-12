import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        google: typeof google;
    }
}

const useLocation = (initialValue: string) => {
    // States
    const [location, setLocation] = useState<string | ''>(initialValue);
    const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);

    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const options: google.maps.places.AutocompleteOptions = {
        componentRestrictions: { country: "IL" },
        fields: ["address_components", "geometry", "icon", "name"],
        types: ["address"]
    };

    useEffect(() => {
        if (window.google && inputRef.current) {
            autoCompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                options
            );

            autoCompleteRef.current.addListener("place_changed", function () {
                const place = autoCompleteRef.current?.getPlace();
                if (place) {
                    const address = place.name || '';

                    if (place.geometry && place.geometry.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();

                        setCoordinates({ lat, lng });  // Store coordinates

                        console.log({ address, lat, lng });
                    } else {
                        console.warn("Location or geometry is not available");
                    }

                    setLocation(address);
                }
            });
        }
    }, []);

    return { location, setLocation, coordinates, inputRef, options };
};

export default useLocation;
