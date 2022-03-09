import React, { useState, useMemo, useCallback, useEffect } from 'react'
import * as d3 from 'd3'
import useMousePosition from './useMousePosition'

import DonutChart from './DonutChart'


export default function Tooltip({
    width,
    height,
    dx,
    dy,
    visibility,
    boundingBox,
    movie,
}) {
    const [mouseX, mouseY] = useMousePosition()

    const content = useMemo(() => {
        // Early exit when no movie to show.
        if (!movie) return <></>
        else return <g>
            <rect
                width={width}
                height={height}
                fill="white"
                stroke="black"
            />
            <text>
                <tspan x='1em' dy='2em'>{movie.title}</tspan>
                <tspan x='1em' dy='2em'>{'Revenue:'}</tspan>, 
                <tspan x='6em'>{`${movie.revenue}$`}</tspan>
                <tspan x='1em' dy='2em'>{'Budget:'}</tspan>, 
                <tspan x='6em'>{`${movie.budget}$`}</tspan>
                <tspan x='1em' dy='2em'>{'Profit:'}</tspan>
                <tspan x='6em'>{`${movie.profit}$`}</tspan>
            </text>
            <DonutChart 
                x={width/2+100} 
                y={height/2}
                innerRadius={Math.min(width, height)*0.2} 
                outerRadius={Math.min(width, height)*0.4}
                frontFill="red"
                backFill="grey"
                value={movie.vote_average}
                min={0}
                max={10}
            />
        </g>
    }, [width, height, dx, dy, movie])

    const bbox = {
        x: boundingBox[0],
        y: boundingBox[1],
        w: boundingBox[2],
        h: boundingBox[3],
    }
    const nx = mouseX + dx
    const ny = mouseY + dy
    const bbx = bbox.w+bbox.x-width
    const bby = bbox.h+bbox.y-height
    const x = nx > bbx ? mouseX-width-dx: nx
    const y = Math.min(bby, ny)

    const style = { 
        position:'absolute',
        left: 0,
        top: 0,
    }

    return <svg
            style={style}
            visibility={visibility}
            transform={`translate(${x}, ${y})`}
            width={width}
            height={height}
        >
            {content}
        </svg>
}