import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { csv, json } from "d3";
import { groupByAirline, groupByAirport } from "./utils";
import "./styles.css";
import { NYCMap } from "./airportMap";
import { BarChart } from "./barChart";
import { AirportBubble} from "./airportBubble";
import {GoogleMap} from "./NYCMap";
import {Sidebar} from "./sidebar";

import 'bootstrap/dist/css/bootstrap.min.css';2


const csvUrl = 'https://gist.githubusercontent.com/hogwild/9367e694e12bd2616205e4b3e91285d5/raw/9b451dd6bcc148c3553f550c92096a1a58e1e1e5/airline-routes.csv';
// const mapUrl = 'https://gist.githubusercontent.com/PeterYaoNYU/22b993fb0580b9eb095711d3d6201aed/raw/047fb2aad52e491d003235dab71d352b7c5ebe92/NYC.geojson';

const listingUrl = 'https://gist.githubusercontent.com/PeterYaoNYU/f52c090f44ebb653a6d49beb6a0118b0/raw/c163d939bd5d47fbef404dc03fb87266adcf1a98/reduced_listings.csv'

const neighborhoodsUrl = 'https://gist.githubusercontent.com/PeterYaoNYU/20695743371e62241b1f45ba2d99ffee/raw/c527ebbd6175ecd63d35ce8c4ab2e5dcb6f7e36f/neighborhoods.csv'


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
    const barchart_width = 350;
    const barchart_height = 400;
    const barchart_margin = { top: 10, bottom: 50, left: 130, right: 10 };
    const barchart_inner_width = barchart_width - barchart_margin.left - barchart_margin.right;
    const barchart_inner_height = barchart_height - barchart_margin.top - barchart_margin.bottom;
    const map_width = 500;
    const map_height = 400;
    const hub_width = 400;
    const hub_height = 400;
    const [selectedRegion, setSelectedRegion] = React.useState(null);


    const listings = useData(listingUrl);
    
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
                <Sidebar setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} listings={listings}/>
            </div>
        </div>
    {/* </div> */}

    </>
    );
}

ReactDOM.render(<AirlineRoutes/ >, document.getElementById("root"));