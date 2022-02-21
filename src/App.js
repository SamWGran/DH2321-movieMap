import Treemap from './Treemap';
import Krapmap from './Krapmap';
import MovieMap from './MovieMap';
import data from './data';
import movieTree from './hierarchy';

function App() {
  return (
    <div className="App">
      <Treemap data={data} height={400} width={600} />
      <MovieMap data={movieTree} height={800} width={1200} />
      <Krapmap data={[
        {x: 50 , y: 200, color: '#90f'},
        {x: 150, y: 0 , color: '#f90'},
        {x: 250, y: 50, color: '#09f'},
      ]} height={400} width={600} />
    </div>
  );
}

export default App;
