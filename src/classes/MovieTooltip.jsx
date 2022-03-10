import { useState } from "react"
import DonutChart from './DonutChart'

export default function MovieTooltip(props) {
    const visibility = props.visibility
    const width = props.width
    const height = props.height
    const boundX = props.boundX
    const boundY = props.boundY
    const offsetX = props.offsetX
    const offsetY = props.offsetY
    const x0 = props.x+offsetX
    const y0 = props.y+offsetY
    const x = x0+width > boundX ? props.x-width-offsetX : x0
    const y = y0+height > boundY ? props.y-height-offsetY : y0
    
    const voteAverage = props.voteAverage
    const revenue = props.revenue
    const budget = props.budget
    const profit = props.profit
    const title = props.title
    const donutChart = <DonutChart 
        x={width/2+100} 
        y={height/2}
        innerRadius={Math.min(width, height)*0.2} 
        outerRadius={Math.min(width, height)*0.4}
        frontFill="red"
        backFill="grey"
        value={voteAverage}
        min={0}
        max={10}
    />
    const titleText = <tspan x='1em' dy='2em'>{title}</tspan>
    
    const revenueText = [
        <tspan x='1em' dy='2em'>{'Revenue:'}</tspan>, 
        <tspan x='6em'>{`${revenue}$`}</tspan>
    ]
    const budgetText = [
        <tspan x='1em' dy='2em'>{'Budget:'}</tspan>, 
        <tspan x='6em'>{`${budget}$`}</tspan>
    ]
    const profitText = [
        <tspan x='1em' dy='2em'>{'Profit:'}</tspan>, 
        <tspan x='6em'>{`${profit}$`}</tspan>
    ]
    const text = <text>
        {titleText}
        {revenueText[0]}
        {revenueText[1]}
        {budgetText[0]}
        {budgetText[1]}
        {profitText[0]}
        {profitText[1]}
    </text>
    const panel = <rect
        width={width}
        height={height}
        fill="white"
        stroke="black"
    />
    return <svg
        visibility={visibility} 
        y={y}
        x={x}
        width={width}
        height={height}
    >
        {panel}
        {donutChart}
        {text}
    </svg>
    

}