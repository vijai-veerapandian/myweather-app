import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { REACT_APP_GEO_API_URL, geoApiOptions } from "../../api.js";

const Search = ({ onSearchChange }) => {
    const [search, setSearch] = useState(null);

    const loadOptions = (inputValue) => {
        if (!inputValue) {
            return Promise.resolve({ options: [] });
        }
        return fetch(`${REACT_APP_GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`, geoApiOptions)
            .then((response) => response.json())
            .then((response) => {
                return {
                    options: response.data.map((city) => {
                        return {
                            value: `${city.latitude} ${city.longitude}`,
                            label: `${city.name},${city.countryCode}`,
                        };
                    }),
                };
            })
            .catch((error) => console.log(error));
    };

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    };

    return (
        <AsyncPaginate
            placeholder="Search for city"
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    );
};

export default Search;