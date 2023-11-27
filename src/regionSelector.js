import React, { useState, useContext } from 'react';

const RegionSelector = ({ neighborhoods, setSelectedRegion, selectedRegion }) => {
  const handleSelectChange = (event) => {
    const { value } = event.target;
    setSelectedRegion(value);
  };

  console.log(selectedRegion)

  return (
    <div>
      <select value={selectedRegion} onChange={handleSelectChange} className="form-select">
        {Object.entries(neighborhoods).map(([group, neighborhoods]) => (
          <optgroup key={group} label={group}>
            {neighborhoods.map((neighborhood, index) => (
              <option key={index} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export { RegionSelector}
