import { useEffect, useState } from 'react'
import axios from "axios";
import './App.css'
import moment from 'moment';
import Chart from 'chart.js/auto';
import Table from 'react-bootstrap/Table';
function App() {
  const [weathers, setWeathers] = useState([]);
  const [town, setTown] = useState();
  const [bgImage, setBgImage] = useState();
  const [temps, setTemps] = useState({}); // Initialize as an empty object
  const [tempsLocal, setTempsLocal] = useState([])

  function handleChange(e)
  {
    
      setTown(e.currentTarget.value)
      
    
    
  }
 

  function handleClick(e) {
    e.preventDefault();
    if (localStorage.getItem('town') != "undefined") {
      localStorage.setItem('town',town);
    
    } else {
      console.log(' passe sur undefined'+town)
      localStorage.setItem('town',town); 


    }
    console.log(localStorage.getItem('town'))
   fetch('https://api.openweathermap.org/data/2.5/forecast?q='+localStorage.getItem('town')+'&units=metric&APPID=c88472556639805974151d3c9963bb8f')
   .then((response) => response.json())
   .then((data) => {
     setWeathers([data.list[0], data.list[7], data.list[15], data.list[23], data.list[31], data.list[39]]);
     
        // Update the temps state with the temperature data
        const temperatureData = {
          '0': { day: moment(data.list[0].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[0].main.temp) },
          '7': { day: moment(data.list[7].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[7].main.temp) },
          '15': { day: moment(data.list[15].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[15].main.temp) },
          '23': { day: moment(data.list[23].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[23].main.temp) },
          '31': { day: moment(data.list[31].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[31].main.temp) },
          '39': { day: moment(data.list[39].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[39].main.temp) },
        };

        setTemps(temperatureData);
      });
  }

  function handleCompareClick(e)
  {
    e.preventDefault();
    const successCallback = (position) => {
      let latitude = position.coords.latitude
      let longitude = position.coords.longitude
   
      fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+latitude+"&lon="+longitude+"&units=metric&APPID=fbbdfa582896093b8da1f248bec231ee")
      .then((response) => response.json())
      .then((data)=>{
        const temperatureLocal = {
          '0': { day: moment(data.list[0].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[0].main.temp) },
          '7': { day: moment(data.list[7].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[7].main.temp) },
          '15': { day: moment(data.list[15].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[15].main.temp) },
          '23': { day: moment(data.list[23].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[23].main.temp) },
          '31': { day: moment(data.list[31].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[31].main.temp) },
          '39': { day: moment(data.list[39].dt_txt).format('MM-DD-YYYY'), temperature: Math.round(data.list[39].main.temp) },
        };
        window.myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Object.values(temps).map((row) => row.day), // Use Object.values to map over the temperatureData object
            datasets: [
              {
                label: 'temperature de'+town,
                data: Object.values(temps).map((row) => row.temperature), // Use Object.values to map over the temperatureData object
              },
              {
                label: 'temperature local',
                data:  Object.values(temperatureLocal).map((row) => row.temperature),
              }
            ],
          },
        });
       
      })
    };
    
    const errorCallback = (error) => {
      console.log(error);
    };
    
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      const ctx = document.getElementById('acquisitions').getContext('2d');
      if (window.myChart !== undefined) {
        window.myChart.destroy();
      }

    
  }



    //fetchBackgroundImage();

    // Render the chart once the DOM is ready
    

  return (
    <>
      <form>
        <input type='text' onChange={handleChange} defaultValue={localStorage.getItem('town')}/>
        <input type="submit" value='rechercher' onClick={handleClick}/>
      </form>
     <button onClick={handleCompareClick}>Comparer</button>
 <div>
 <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Jours </th>
          <th>Temperature</th>
          <th>Humidite</th>
          <th>Vent</th>
        </tr>
      </thead>
      <tbody>
      {weathers.map((element,index)=>
        <tr key={index}>
          <td>{moment(element.dt_txt).format('MM-DD-YYYY')}</td>
          <td>{Math.round (element.main.temp)}°C</td>
          <td>{element.main.humidity}</td>
          <td>{element.wind.speed}</td>
        </tr>
      )}
      </tbody>
  </Table>
 
     
 <div style={{width: '800px'}}><canvas id="acquisitions"></canvas></div>
 </div>
 
    </>
  )
}

export default App
