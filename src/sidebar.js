import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RegionSelector } from './regionSelector';
import { ListingSummary } from './listingSummary';
import { ListingCount } from './listingCount';
import { TreeMapComponent } from './TreeMap2';
import { WordCloud } from './word_cloud';

import neighborhood_words from '../data/neighborhood_words_freq.json';
import neighborhoodgroup_words from '../data/neighborhoodgroup_words_freq.json';


const Sidebar = ({ setSelectedRegion, selectedRegion, listings, neighborhoods }) => {
  // Replace the content below with your actual sidebar content
  let wordFrequencies;

  let boroughList = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]

  if (boroughList.includes(selectedRegion)) {
    console.log(selectedRegion);
    wordFrequencies = JSON.parse(neighborhoodgroup_words[selectedRegion]);
    console.log(wordFrequencies);
  } else if (selectedRegion && neighborhood_words[selectedRegion]) {
    try {
      wordFrequencies = JSON.parse(neighborhood_words[selectedRegion]);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      wordFrequencies = null;
    }
  } else {
    // Fallback data if selectedRegion is not set or is None
    wordFrequencies = JSON.parse(neighborhoodgroup_words["Manhattan"]);
  }

  return (
    <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      {/* Sticky top bar with Region Selector and Listing Count */}
      <div className="sticky-top bg-light py-2" style={{ zIndex: 1020 }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="mb-0">New York</h3> {/* Adjust styles as needed */}
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

      {/* Word Cloud */}
      <div className="pt-3">
        {wordFrequencies && <WordCloud words={wordFrequencies} />}
      </div>

      {/* Treemap */}
      <div className="pt-3">
        <TreeMapComponent data={listings} width={500} height={400} selectedRegion={selectedRegion} />
      </div>

      {/* Treemap
      <div className="pt-3">
        <Treemap listings={listings} />
      </div> */}


    </div>
  );
};


export { Sidebar };