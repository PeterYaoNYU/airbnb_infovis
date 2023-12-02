import React, { useState, useContext } from 'react';

const RegionSelector = ({ neighborhoods, setSelectedRegion, selectedRegion }) => {
  const handleSelectChange = (event) => {
    const { value } = event.target;
    setSelectedRegion(value);
  };

  console.log(selectedRegion)

//   return (
//     <div>
//       <select value={selectedRegion} onChange={handleSelectChange} className="form-select">
        // <option value="Manhatten">Manhattan</option>
        // <option value="Brooklyn">Brooklyn</option>
        // <option value="Queens">Queens</option>
        // <option value="Bronx">Bronx</option>
        // <option value="Staten Island">Staten Island</option>


        // {Object.entries(neighborhoods).map(([group, neighborhoods]) => (
        //   <optgroup key={group} label={group}>
        //     {/* <option value={group}>{group}</option> */}
        //     {neighborhoods.map((neighborhood, index) => (
        //       <option key={index} value={neighborhood}>
        //         {neighborhood}
        //       </option>
        //     ))}
        //   </optgroup>
        // ))}
//       </select>
//     </div>
//   );

return (
    <div className="mb-3">
      <label htmlFor="neighborhood-select" className="form-label">Filter by:</label>
      <select 
        id="neighborhood-select"
        className="form-select" 
        value={selectedRegion} 
        onChange={handleSelectChange}
        style={{ maxWidth: '300px' }} // Adjust width as needed
      >
        <option value="" disabled selected={!selectedRegion}>
          New York City
        </option>
        <option className="fw-bold" value="Manhattan">Manhattan</option>
        <option className="fw-bold" value="Brooklyn">Brooklyn</option>
        <option className="fw-bold" value="Queens">Queens</option>
        <option className="fw-bold" value="Bronx">Bronx</option>
        <option className="fw-bold" value="Staten Island">Staten Island</option>


        {Object.entries(neighborhoods).map(([group, neighborhoods]) => (
          <optgroup key={group} label={group}>
            {/* <option value={group}>{group}</option> */}
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
