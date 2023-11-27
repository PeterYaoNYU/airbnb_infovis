import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { csv, json } from "d3";
import { groupByAirline, groupByAirport } from "./utils";
import "./styles.css";
import { NYCMap } from "./airportMap";
import { BarChart } from "./barChart";
import { AirportBubble} from "./airportBubble";
import {GoogleMap} from "./NYCMap";

import 'bootstrap/dist/css/bootstrap.min.css';2


const csvUrl = 'https://gist.githubusercontent.com/hogwild/9367e694e12bd2616205e4b3e91285d5/raw/9b451dd6bcc148c3553f550c92096a1a58e1e1e5/airline-routes.csv';
// const mapUrl = 'https://gist.githubusercontent.com/PeterYaoNYU/22b993fb0580b9eb095711d3d6201aed/raw/047fb2aad52e491d003235dab71d352b7c5ebe92/NYC.geojson';

const listingUrl = 'https://gist.githubusercontent.com/PeterYaoNYU/f52c090f44ebb653a6d49beb6a0118b0/raw/c163d939bd5d47fbef404dc03fb87266adcf1a98/reduced_listings.csv'


function useData(csvPath) {
    const [dataAll, setData] = useState(null);
  
    useEffect(() => {
      csv(csvPath).then(data => {
        data.forEach(d => {
          // Convert latitude and longitude from strings to numbers
          d.latitude = +d.latitude;
          d.longitude = +d.longitude;
          d.room_type = d.room_type;
          // Add any additional processing you need for other columns
        });
        setData(data); // Set the state to the new data
      });
    }, [csvPath]);
  
    return dataAll;
  }

function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(geoJsonData => {
            setData(geoJsonData);
        })
    }, []);
    return data;
}


function AirlineRoutes(){
    const [selectedAirline, setSelectedAirline]=React.useState(null);
    const barchart_width = 350;
    const barchart_height = 400;
    const barchart_margin = { top: 10, bottom: 50, left: 130, right: 10 };
    const barchart_inner_width = barchart_width - barchart_margin.left - barchart_margin.right;
    const barchart_inner_height = barchart_height - barchart_margin.top - barchart_margin.bottom;
    const map_width = 500;
    const map_height = 400;
    const hub_width = 400;
    const hub_height = 400;

    // const routes = useData(csvUrl);
    // const map = useMap(mapUrl);

    const listings = useData(listingUrl);
    
    // if (!map) {
    //     return <pre>Loading...</pre>;
    // };
    // let airlines = groupByAirline(routes);
    // let airports = groupByAirport(routes);
    // console.log(airlines);
    // console.log(airports);
    // console.log(routes);
    // console.log(map);
    
    return (
    <>
    <h1 style={{ color: 'white', fontFamily: "'Dancing Script', cursive" }}>Airbnb NYC</h1>   
    {/* <div className="container"> */}
        <div className="row no-gutters">
                <div className="col-md-6 p-0" style={{ height: '100vh' }}>
                    {/* <NYCMap width={window.innerWidth / 2} height={window.innerHeight} neighborhoods={map} /> */}
                    <GoogleMap apikey={"AIzaSyC9S-iJQ8QRS7DTKBnKvPDsPSHFiCgl42Q"} listings={listings}/>
                </div>
            <div className="col-md-6">
                {/* Info Visualization
                <div>
                    <h2>Airlines</h2>
                    <svg id="barchart" width={barchart_width} height={barchart_height}>
                        <BarChart offsetX={barchart_margin.left} offsetY={barchart_margin.top} 
                            height={barchart_inner_height} width={barchart_inner_width} data={airlines}
                            selectedAirline={selectedAirline} setSelectedAirline={setSelectedAirline}
                        />
                    </svg>
                </div>
                <div>
                    <h2>The Hubs</h2>
                    <svg id="bubble" width={hub_width} height={hub_height}>
                        <AirportBubble width={hub_width} height={hub_height} 
                            countries={map} routes={routes}
                            selectedAirline={selectedAirline}
                        />
                    </svg>
                </div> */}
            </div>
        </div>
    {/* </div> */}

    </>
    );
}

ReactDOM.render(<AirlineRoutes/ >, document.getElementById("root"));