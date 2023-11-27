import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RegionSelector } from './regionSelector';


const Sidebar = ({setSelectedRegion, selectedRegion, listings, neighborhoods}) => {
    // Replace the content below with your actual sidebar content

    console.log(neighborhoods)
    return (
      <div className="overflow-auto" style={{ maxHeight: '100vh' }}>
        <div className="p-4">
          <h2>New York City</h2>
          {/* Your filters, stats, and other sidebar content go here */}
        <RegionSelector neighborhoods={neighborhoods} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} />
        </div>
      </div>
    );
  };


export {Sidebar};