import '../styles/moviemapStyles.css'
import * as d3 from 'd3'
import ReactSlider from 'react-slider'
import React, {useMemo} from 'react'

export default function Menu({extents, onAfterChange}) {    
    const sliders = useMemo(
        () => Object.entries(extents).map(
            ([key, [min, max]], i) => {
                return (<div>
                    <h3>{key}{}{}</h3>
                    <ReactSlider
                        key={i}
                        className="horizontal-slider"
                        thumbClassName="default-thumb"
                        trackClassName="default-track"
                        max={max}
                        min={min}
                        defaultValue={[min, max]}
                        onAfterChange={(values, _) => { 
                            console.log(key, values); 
                            onAfterChange(key, values[0], values[1])
                        }}
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
