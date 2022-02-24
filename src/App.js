import Moviemap from './classes/Moviemap';
import './classes/styles.css'
function App() {
  return (
    <div className="App">
      <Moviemap id="moviemap" width={1000} height={800} onMovieEnter={(m)=>m} onMovieLeave={(m)=>m}/>
    </div>
  );
}

export default App;
