import * as d3 from 'd3'

function DonutChart({x, y, innerRadius, outerRadius, angle, frontFill, backFill, min, max, value}) {
    const scale = d3
        .scaleLinear()
        .domain([min, max])
        .range([0, 2*Math.PI])

    const background = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(2*Math.PI)

    const foreground = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(angle)
        .endAngle(angle+scale(value))

    return <g transform={`translate(${x}, ${y})`}>
            <path fill={backFill} d={background()}/>
            <path fill={frontFill} d={foreground()}/>
        </g>
}

DonutChart.defaultProps = {
    x: 0, 
    y: 0, 
    innerRadius: 0.5, 
    outerRadius: 1, 
    angle: 0, 
    frontFill: "blue", 
    backFill: "grey", 
    min: 0, 
    max:1, 
    value: 0.5,
}

export default DonutChart