import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RegionSelector } from './regionSelector';

import { ListingSummary } from './listingSummary';


const Sidebar = ({setSelectedRegion, selectedRegion, listings, neighborhoods}) => {
    // Replace the content below with your actual sidebar content

    console.log(neighborhoods)
    return (
        <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          {/* Sticky Region Selector at the top */}
          <div className="sticky-top" style={{ backgroundColor: '#f8f9fa', zIndex: 1020, top: 0, paddingBottom: '1rem' }}>
            <div className="p-4">
              <h2>New York City</h2>
              <RegionSelector neighborhoods={neighborhoods} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} />
            </div>
          </div>
    
          {/* Scrollable Listing Summary */}
          <div style={{ paddingTop: '1rem' }}>
            <ListingSummary listings={listings} selectedRegion={selectedRegion} />
          </div>
        </div>
      );
  };


export {Sidebar};