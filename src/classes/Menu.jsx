import '../styles/moviemapStyles.css'
import * as d3 from 'd3'
import ReactSlider from 'react-slider'
import React, {useMemo} from 'react'

function beautifyCash(num) {
	if(Math.abs(num) > 1e6)
		return (num.toString().slice(0,-6))+"."+num.toString().slice(-6, 5)+"M"
	else
		return num
}

export default function Menu({extents, onAfterChange}) {    
    const sliders = useMemo(
        () => Object.entries(extents).map(
            ([key, [min, max]], i) => {
                return (<div>
                    <h3>{key}</h3>
                    <ReactSlider
                        key={i}
                        className="horizontal-slider"
                        thumbClassName="default-thumb"
                        trackClassName="default-track"
						
                        max={Math.floor(max)}
                        min={Math.floor(min)}
                        defaultValue={[min, max]}
                        onAfterChange={(values, _) => { 
                            console.log(key, values); 
                            onAfterChange(key, values[0], values[1])
                        }}
						
						
						renderThumb={(props, state) => <div {...props}>{(beautifyCash(state.valueNow).toString().slice(0, 7))}</div>}
						pearling
						minDistance={1}
                    />
                    </div>
                )
            }
        ),
        [extents, onAfterChange]
    )
    return (
        <div className='vertical-flex-container'>
            {sliders}
        </div>
    )
}
