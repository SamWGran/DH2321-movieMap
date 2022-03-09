import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import '../styles/MovieMap.css'
import '../styles/moviemapStyles.css'
import Treemap from './Treemap'
import Tooltip from './Tooltip'
import sample from '../data/sampleData'
import Menu from './Menu'
import {deepEquals} from 'deep-equals'

const defaultMovies = extrapolate(sample)
const defaultGradient = ["red", "gray", "green"]


export default function App() {
    const width = 1200
    const height = 900
    const x = 0
    const y = 0

    /**
     * State objects
     */
    const [data, setData] = useState(defaultMovies)
    const [gradient, setGradient] = useState(defaultGradient)
    const [sizeKey, setSizeKey] = useState('budget')
    const [colorKey, setColorKey] = useState('profit')
    const [groupKey, setGroupKey] = useState('genres')

    const [tooltip, setTooltip] = useState({movie: null, visibility: 'hidden'})
    const showTooltip = () => setTooltip(prev => ({...prev, ...{visibility: 'visible'}}))
    const hideTooltip = () => setTooltip(prev => ({...prev, ...{visibility: 'hidden'}}))
    const swapTooltip = (movie) => setTooltip(prev => ({...prev, ...{movie: movie}}))
    
    const [ranges, setRanges] = useState([])
    const insertRange = (key, min, max) => {
        const index = ranges.findIndex(x => x.key === key)
        if (index === -1) {
            setRanges(prev => [...prev, {key, min, max}])
        } else {
            setRanges(prev => {
                let copy = [...prev]
                copy[index] = {key, min, max}
                return copy
            })
        }
    }

    const bounds = useMemo(
        () => {
            const f = key => d3.extent(data.map(m=>m[key]))
            const current = {
                budget:      f('budget'),
                revenue:     f('revenue'),
                profit:      f('profit'),
                profitRatio: f('profitRatio'),
            }
            Object.entries(current).forEach(([key, [min, max]]) => {
                console.log(key, min, max)
                insertRange(key, min, max)
            }) 
            return current
        },
        [data]
    )
    

    const renderedTooltip = useMemo(
        () => (
            <Tooltip
                dx={75}
                dy={-10}
                boundingBox={[x, y, width, height]}
                width={400}
                height={200}
                visibility={tooltip.visibility}
                movie={tooltip.movie}
            />
        ),
        [tooltip]
    )

    const renderedMovieMap = useMemo(
        () => (
            <Treemap 
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
                filters={ranges}
            />
        ),
        [data, gradient, sizeKey, colorKey, groupKey, ranges]
    )

    const menu = (
        <Menu
            extents={bounds}
            onAfterChange={(k, min, max) => insertRange(k, min, max)}
        />
    )

    return (
      <div className='App'>
          <div className='horizontal-flex-container'>
            {menu}
            <div>
                {renderedMovieMap}
                {renderedTooltip}
            </div>
          </div>
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
