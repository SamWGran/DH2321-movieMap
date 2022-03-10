import MovieMap from './classes/MovieMap';
import './styles/MovieMap.css'
function App() {
  return (
    <div className="App">
      <MovieMap id="moviemap" className='movie-map' width='1600' height='900'/>
    </div>
  );
}

export default App;
