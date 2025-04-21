import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
// Removed unused imports for this specific component's logic
// import { REACT_APP_GEO_API_URL, geoApiOptions } from "../../api.js";

const Search = ({ onSearchChange }) => {
    const [search, setSearch] = useState(null);

    // Using async/await for better readability and error handling
    const loadOptions = async (inputValue) => {
        // No need to fetch if input is empty
        if (!inputValue || inputValue.trim() === '') {
            return { options: [] };
        }

        try {
            // --- CORRECTED FETCH CALL ---
            // Use the relative path that Nginx will proxy to the backend's /cities endpoint
            const response = await fetch(
                `/api/cities?minPopulation=1000000&namePrefix=${inputValue}`
                // No need to pass geoApiOptions here, as the backend handles authentication
                // with the actual GeoDB API. Send headers ONLY if your backend endpoint
                // specifically requires them (e.g., Content-Type, custom auth).
            );

            // Check if the response from *your backend* was successful
            if (!response.ok) {
                console.error("Backend API Error Status:", response.status);
                // Try to get more specific error info from backend response body
                const errorText = await response.text();
                console.error("Backend API Error Response:", errorText);
                // Return empty options to prevent react-select-async-paginate error
                return { options: [] };
            }

            // Parse the JSON response from *your backend*
            const responseData = await response.json();

            // --- Validate the structure returned by YOUR backend ---
            // Assuming your backend correctly forwards the GeoDB structure { data: [...] }
            if (!responseData || !Array.isArray(responseData.data)) {
                 console.error("Unexpected response structure from backend:", responseData);
                 return { options: [] };
            }

            // Map the data received from *your backend*
            return {
                options: responseData.data.map((city) => ({
                    value: `${city.latitude} ${city.longitude}`,
                    label: `${city.name}, ${city.countryCode}`, // Ensure backend provides these fields
                })),
            };

        } catch (error) {
            // Catch network errors (e.g., Nginx down, DNS issues) or JSON parsing errors
            console.error("Fetch/Parse Error in loadOptions:", error);
            // Return empty options to prevent react-select-async-paginate error
            return { options: [] };
        }
    };

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    };

    return (
        <AsyncPaginate
            placeholder="Search for city"
            debounceTimeout={600} // Time in ms to wait after user stops typing
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions} // Pass the async function directly
        />
    );
};

export default Search;