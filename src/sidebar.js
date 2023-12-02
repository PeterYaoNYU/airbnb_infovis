import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RegionSelector } from './regionSelector';

import { ListingSummary } from './listingSummary';

import { ListingCount } from './listingCount';  


const Sidebar = ({setSelectedRegion, selectedRegion, listings, neighborhoods}) => {
    // Replace the content below with your actual sidebar content

    console.log(neighborhoods)
    return (
        <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          {/* Sticky top bar with Region Selector and Listing Count */}
          <div className="sticky-top bg-light py-2" style={{ zIndex: 1020 }}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="mb-0">New York City</h2> {/* Adjust styles as needed */}
                </div>
                <div className="col">
                  <RegionSelector neighborhoods={neighborhoods} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} />
                </div>
                <div className="col text-end">
                  <ListingCount listings={listings} selectedRegion={selectedRegion} />
                </div>
              </div>
            </div>
          </div>
    
          {/* Scrollable Listing Summary */}
          <div className="pt-3">
            <ListingSummary listings={listings} selectedRegion={selectedRegion} />
          </div>
        </div>
    );
  };


export {Sidebar};