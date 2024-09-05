import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        google: typeof google;
    }
}

const useLocation = (initialValue: string) => {
    const [location, setLocation] = useState<string | ''>(initialValue);
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
                    setLocation(address);
                }
            });
        }
    }, []);

    return { location, setLocation, inputRef, options };
};

export default useLocation;
