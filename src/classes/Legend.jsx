import '../styles/moviemapStyles.css'
import * as d3 from 'd3'
import legend01 from './legend01.jpg'
import legend02 from './legend02.jpg'
import logo from './logo.png'

export default function Menu({
    gradient
}) {

    const legend = (
		<>
			<p id="legend-title">Legend</p>
			<div></div>
			<p className="legend-text">Budget</p>
			<img src={legend01}/>
			<p className="legend-text">Revenue</p>
			<img src={legend02}/>
			<div></div>
			<a href="#" onClick={() => {document.getElementById('AboutUs').classList.remove('hidden')}}>About us</a>
			
		</>
    )

    return legend
}
