import * as d3 from 'd3'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import useMousePosition from './useMousePosition'

import DonutChart from './DonutChart'

function transformTitle(title, width) {
	if(width > title.length*10)
		return title
	else{
		var retS = ""
		var i=0
		while(retS.length*16 < width){
			retS += title[i]
			i++
		}
		if(retS[retS.length-1] == " ")
			retS = retS.slice(0, -1);
		return retS+"..."
	}
}

/**
 * React component that renders a tooltip.
 * @param {*} dx - Tooltips offset from the mouse in x direction.
 * @param {*} dy - Tooltips offset from the mouse in y direction.
 * @param {*} visibility - Either 'hidden' or 'visible'
 * @param {*} boundingBox - The box that the tooltip is limited to.
 * @param {*} movie - The movie data used to render the tooltip.
 */
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

    // Returns empty if no movie is found!
    const content = useMemo(
        () => (!movie ? <></> :
            <g>
                <rect
                    width={width}
                    height={height}
                    fill="white"
                    stroke="black"
                />
                <DonutChart 
                    x={width/2+100} 
                    y={(height/2)+15}
                    innerRadius={Math.min(width, height)*0.2} 
                    outerRadius={Math.min(width, height)*0.4}
                    frontFill="red"
                    backFill="grey"
                    value={movie.vote_average}
                    min={0}
                    max={10}
                />
                <text>
                    <tspan x='1em' dy='2em'>{transformTitle(movie.title, 680)}</tspan>
                    <tspan x='1em' dy='2em'>{'Revenue:'}</tspan>
                    <tspan x='6em'>{`${movie.revenue}$`}</tspan>
                    <tspan x='1em' dy='2em'>{'Budget:'}</tspan> 
                    <tspan x='6em'>{`${movie.budget}$`}</tspan>
                    <tspan x='1em' dy='2em'>{'Profit:'}</tspan>
                    <tspan x='6em'>{`${movie.profit}$`}</tspan>
                </text>
            </g>
        ),
        [width, height, dx, dy, movie]
    )

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

    return (
        <svg
            style={style}
            visibility={visibility}
            transform={`translate(${x}, ${y})`}
            width={width}
            height={height}
        >
            {content}
        </svg>
    )
}