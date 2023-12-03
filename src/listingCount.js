import React from 'react';


const ListingCount = ({ listings, selectedRegion }) => {
    // Filter listings for the selected region
    let boroughList = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]
  
    let filteredListings = []
  
    if (boroughList.includes(selectedRegion)) {
      filteredListings = listings.filter(
          (listing) => listing.neighbourhood_group === selectedRegion
      )
    } else if (selectedRegion == null) {
      filteredListings = listings
    } else { 
      filteredListings = listings.filter(
          (listing) => listing.neighbourhood === selectedRegion
      )
    }
    
    // Calculate the total number of listings
    const totalListings = filteredListings.length;
    const allListings = listings.length;

    return (
        <div className="row">
            <h2>Total Listings: {totalListings}</h2>
            <h6>Out of {allListings}</h6>
        </div>
    );
    };

    export {ListingCount};


