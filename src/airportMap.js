import React from "react";
import { geoPath, geoMercator } from "d3-geo";
import { Routes } from './routes'


function AirportMap(props){
    const {width, height, countries, airports, routes, selectedAirline} = props;
    let projection = geoMercator();//TODO: Create a projection of type Mercator.
    projection.scale(97)
            .translate([width / 2, height / 2 + 20]);
    let path = geoPath().projection(projection);
    return <g>
        {
            countries.features.map(d => <path key={d.properties.name} d={path(d)} 
            stroke={"#ccc"} fill={"#eee"}></path>)
        }
        {
            airports.map(d => <circle key={d.AirportID} cx={projection([d.Longitude, d.Latitude])[0]}
                    cy={projection([d.Longitude, d.Latitude])[1]} r={1} fill={"#2a5599"}></circle>)
        }
        <Routes projection={projection} routes={routes} selectedAirline={selectedAirline}/>
    </g>


}

export { AirportMap }