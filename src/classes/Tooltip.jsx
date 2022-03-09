import React, { useState, useMemo, useCallback, useEffect } from 'react'
import * as d3 from 'd3'
import useMousePosition from './useMousePosition'

import DonutChart from './DonutChart'


export default function Tooltip(props) {
    const [mouseX, mouseY] = useMousePosition()

    const content = useMemo(() => {
        if (props.movie == null) {
            return <></>
        }
        return <g>
            <rect
                width={props.width}
                height={props.height}
                fill="white"
                stroke="black"
            />
            <text>
                <tspan x='1em' dy='2em'>{props.movie.title}</tspan>
                <tspan x='1em' dy='2em'>{'Revenue:'}</tspan>, 
                <tspan x='6em'>{`${props.movie.revenue}$`}</tspan>
                <tspan x='1em' dy='2em'>{'Budget:'}</tspan>, 
                <tspan x='6em'>{`${props.movie.budget}$`}</tspan>
                <tspan x='1em' dy='2em'>{'Profit:'}</tspan>
                <tspan x='6em'>{`${props.movie.profit}$`}</tspan>
            </text>
            <DonutChart 
                x={props.width/2+100} 
                y={props.height/2}
                innerRadius={Math.min(props.width, props.height)*0.2} 
                outerRadius={Math.min(props.width, props.height)*0.4}
                frontFill="red"
                backFill="grey"
                value={props.movie.vote_average}
                min={0}
                max={10}
            />
        </g>
    }, [props])

    const box = {
        x: props.box[0],
        y: props.box[1],
        w: props.box[2],
        h: props.box[3],
    }
    const nx = mouseX + props.dx
    const ny = mouseY + props.dy
    const bx = box.w+box.x-props.width
    const by = box.h+box.y-props.height
    const x = nx > bx ? mouseX-props.width-props.dx: nx
    const y = Math.min(by, ny)

    const style = { 
        position:'absolute',
        left: 0,
        top: 0,
    }

    return <svg
            style={style}
            visibility={props.visibility}
            transform={`translate(${x}, ${y})`}
            width={props.width}
            height={props.height}
        >
            {content}
        </svg>
}