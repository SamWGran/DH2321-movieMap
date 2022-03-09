import React, { useState, useMemo, useCallback, useEffect } from 'react'
import * as d3 from 'd3'
import '../styles/MovieMap.css'
import Treemap from './Treemap';
import Tooltip from './Tooltip';
import sample from '../data/sampleData'

const defaultMovies = extrapolate(sample)
const defaultGradient = ["red", "gray", "green"]

export default function App() {
    const [data, setData] = useState(defaultMovies)
    const [gradient, setGradient] = useState(defaultGradient)
    const [sizeKey, setSizeKey] = useState("budget")
    const [colorKey, setColorKey] = useState("profit")
    const [groupKey, setGroupKey] = useState("genres")
    const [filters, setFilters] = useState({})
    const [tooltip, setTooltip] = useState({movie: null, visibility: "hidden"})
    
    useEffect(() => {
        const filterFromKey = key => {
            const [min, max] = d3.extent(data.map(m => m[key]))
            return {key, min, max}
        }
        setFilters([
            // filterFromKey("revenue"),
            // filterFromKey("revenue"),
            // filterFromKey("profit"),
            // filterFromKey("profitRatio"),
        ])
    }, [data])

    const width = 1600
    const height = 900
    const x = 0
    const y = 0

    const showTooltip = useCallback(() => {
        setTooltip((prev) => { return {...prev, visibility:'visible'}})
    }, [tooltip])

    const hideTooltip = useCallback(() => {
        setTooltip((prev) => { return {...prev, visibility:'hidden'}})
    }, [tooltip])
    
    const swapTooltip = useCallback((movie) => {
        setTooltip((prev) => { return {...prev, movie: movie}})
    }, [tooltip])

    const renderedTooltip = useMemo(() => <Tooltip
        dx={75}
        dy={-10}
        boundingBox={[x, y, width, height]}
        width={400}
        height={200}
        visibility={tooltip.visibility}
        movie={tooltip.movie}
    />, [tooltip])

    const renderedMovieMap = useMemo(() => <Treemap 
        className='movie-map' 
        x={x}
        y={y}
        width={width}
        height={height}
        onShowTooltip={showTooltip}
        onHideTooltip={hideTooltip}
        onSwapTooltip={swapTooltip}
        data={data}
        gradient={gradient}
        sizeKey={sizeKey}
        colorKey={colorKey}
        groupKey={groupKey}
        filters={filters}
    />, [data, gradient, sizeKey, colorKey, groupKey, filters])

  return (
    <div className="App" style={{backgroundColor: '#0d253f', width:'100%', height:'100%'}}>
        {renderedMovieMap}
        {renderedTooltip}
    </div>
  );
}

function extrapolate(data) {
    return data.map(m => { return {
        profit: m.revenue - m.budget,
        profitRatio: m.revenue / m.budget,
        ...m,
    }})
}