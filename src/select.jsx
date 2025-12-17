import React, { useState } from "react";

const countries = [
  { name: "India", value: "IN", cities: ["Delhi", "Mumbai", "Bangalore"] },
  { name: "USA", value: "US", cities: ["New York", "Los Angeles", "Chicago"] },
  {
    name: "Australia",
    value: "AU",
    cities: ["Sydney", "Melbourne", "Brisbane"],
  },
];

const SelectObject = () => {
  const [countrySelected, setCountrySelected] = useState("");

  const selectedCountry = countries.find(
    (country) => country.value === countrySelected
  );
  return (
    <div>
      <select onChange={(e) => setCountrySelected(e.target.value)}>
        <option value="">Select Country</option>
        {/* // if we don't show this intially india will show, 
        // and we have set empty value for it, so if you open and select india, 
        // the second dropdown will not show, because it feels like you didn't change anything */}
        {countries.map((country, index) => {
          return (
            <option value={country.value} key={index}>
              {/* <option value={index} key={index}> */}
              {country.name}
            </option>
          );
        })}
      </select>
      {/* {countrySelected && ( */}
      {selectedCountry && (
        <select>
          {selectedCountry?.cities.map((city, index) => {
            // {countries[countrySelected]?.cities.map((city, index) => {
            return (
              <option value={city} key={index}>
                {city}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default SelectObject;
