import Treemap from './Treemap';
import Krapmap from './Krapmap';
import data from './data';

function App() {
  return (
    <div className="App">
      <Treemap data={data} height={400} width={600} />
      <Krapmap data={[
        {x: 50 , y: 200, color: '#90f'},
        {x: 150, y: 0 , color: '#f90'},
        {x: 250, y: 50, color: '#09f'},
      ]} height={400} width={600} />
    </div>
  );
}

export default App;
