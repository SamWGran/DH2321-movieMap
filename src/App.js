import MovieMap from './classes/MovieMap';
import './styles/MovieMap.css'
function App() {
  return (
    <div className="App">
      <MovieMap id="moviemap" className='movie-map' width={1000} height={800}/>
    </div>
  );
}

export default App;
