import React, {useState} from 'react';
import './App.css';

function App() {

  const [city, setCity] = useState("");
  const [days, setDays] =  useState(new Array(5));
  
   function updateState(data) {
    setCity(data.city.name);
    // setDays([]);
    const dayIndices = getDayIndices(data);
    let dayss = [];
    for (let i = 0; i < 5; i++) {
      
      dayss.push({
        date: data.list[dayIndices[i]].dt_txt,
        weather_desc: data.list[dayIndices[i]].weather[0].description,
        icon: data.list[dayIndices[i]].weather[0].icon,
        temp: data.list[dayIndices[i]].main.temp
      });
      
    }
    setDays(previousState => {
      previousState = [];
      return previousState.concat(dayss);      
    });
      console.log(days)
  };
/*************************/ 
  const makeApiCall = async city => {
    const api_data = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=9a93ae6f256f7f4acf981af7f3c29ee7`
    ).then(resp => resp.json());

      console.log(api_data);
    
      if (api_data.cod === '200') {
      await updateState(api_data);
      return true;
    } else return false;
  };
/*************************/ 
  function getDayIndices(data) {
    let dayIndices = [];
    dayIndices.push(0);

    let index = 0;
    let tmp = data.list[index].dt_txt.slice(8, 10);

    for (let i = 0; i < 4; i++) {
      while (
        tmp === data.list[index].dt_txt.slice(8, 10) ||
        data.list[index].dt_txt.slice(11, 13) !== '15'
      ) {
        index++;
      }
      dayIndices.push(index);
      tmp = data.list[index].dt_txt.slice(8, 10);
    }
    // console.log(dayIndices);
    return dayIndices;
  };
/*************************/ 
  const onKlickHandler = async e => {
    e.persist();
    const eventKey = e.which ? e.which : e.keyCode;
    const city = e.target.value;

    // check if input contains only letters after Enter was pressed
    if (eventKey === 13) {
      if (/^[a-zA-ZäöüÄÖÜß ]+$/.test(city)) {
        e.target.classList.add('loading');

        if (await makeApiCall(city)) e.target.placeholder = 'Enter a City...';
        else e.target.placeholder = 'City was not found, try again...';
      } else e.target.placeholder = 'Please enter a valid city name...';
      e.target.classList.remove('loading');
      e.target.value = '';
    }
  };
/*************************/ 

  const getDay = date => {
    let weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';

    return weekday[new Date(date).getDay()];
  };

  const style = {
    top: city ? '-380px' : '-20px'
  };
  
  const Title = city ? null : <h1 className='title'>Weather Forecast</h1>;

  return (
    <div className="App">
      <div className="App-header">
        <div className='main'>
        <div className='inner-main'> {Title}

          <img src = { days[0] ? `./images/${days[0].icon}.svg` : './images/01d.svg' }
            alt='sun' style={{
              visibility: city ? 'visible' : 'hidden',
              opacity: city ? '1' : '0'
            }} />

          <div className='today' style={{ visibility: city ? 'visible' : 'hidden', opacity: city ? '1' : '0' }} >
            <span>Today</span>
            <h1>{city}</h1>
            <p> Temperature: {days[0] ? Math.round(days[0].temp - 273.15) : 0} °C
            </p>
            <p>{days[0] ? days[0].weather_desc.toLowerCase() : ''}</p>
          </div>
        </div>

        <input className='city-input cityInput' style={style} type='text' placeholder='Enter a City...' onKeyPress={onKlickHandler} />
        
        <ul className='weather-box-list'>
          {days.slice(1).map((day, i) => {
            return <li key={i}> <div className='weather-box'>
            <h1>{day ? getDay(day.date) : ''}</h1>
            <img src={ day.icon ? `./images/${day.icon}.svg` : './images/01d.svg' } alt='sun' />
            <span className='temp'>{Math.round(day.temp - 273.15)}°C</span>
          </div>
          </li>
          })}
        </ul>

      </div>


      </div>        
    </div>
  );
}

export default App;
