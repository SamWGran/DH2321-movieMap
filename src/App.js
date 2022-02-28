import React from 'react';
import MovieMap from './classes/MovieMap';
import './styles/MovieMap.css'
function App() {

  const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })

  const [mapDimensions, setMapDimensions] = React.useState({ 
    height: window.innerHeight * 0.9,
    width: window.innerWidth * 0.8
  })

  const screenWidth = (percentage) => dimensions.width * percentage
  const screenHeight = (percentage) => dimensions.height * percentage

  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
      setMapDimensions({
        height: window.innerHeight * 0.9,
        width: window.innerWidth * 0.8
      })
    }

    window.addEventListener('resize', handleResize)

    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <div className="App">
      <MovieMap id="moviemap" className='movie-map' width={mapDimensions.width} height={mapDimensions.height}/>
    </div>
  );
}

export default App;
