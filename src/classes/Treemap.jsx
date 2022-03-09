import React, { useState, useMemo, useCallback, useEffect } from 'react'
import * as d3 from 'd3'


export default function Treemap({
    x,
    y,
    width,
    height,
    gradient,
    colorKey,
    sizeKey,
    groupKey,
    data,
    filters,
    onSwapTooltip,
    onShowTooltip,
    onHideTooltip,
}) {
        const layout =  d3
            .treemap()
            .paddingInner(1)
            .paddingOuter(5)
            .paddingTop(28)
            .round(true)
            .tile(d3.treemapBinary)
            .size([width, height])
        const tree = mapToTreeData(
            data, 
            sizeKey, 
            colorKey, 
            groupKey, 
            gradient,
            filters
        )
        const treemap = layout(tree)
        if (!treemap.children) {
            return <text>no movies</text>
        }
        return <svg width={width} height={height} x={x} y={y}> {
            treemap.children.map(g => <Group
                key={g.data.name}
                className='group'
                data={g.data}
                x={g.x0}
                y={g.y0}
                width={g.x1 - g.x0}
                height={g.y1 - g.y0}
                onMouseEnter={(_) => onShowTooltip()}
                onMouseLeave={(_) => onHideTooltip()}> { 
                    g.leaves().map(t => <Tile
                        key={t.data.index}
                        x={t.x0}
                        y={t.y0}
                        width={t.x1 - t.x0}
                        height={t.y1 - t.y0}
                        fill={t.data.color}
                        movie={data[t.data.index]}
                        onMouseEnter={(_) => onSwapTooltip(data[t.data.index])}/>
                    )
                }
            </Group>)
        }</svg>
}

function Group({x, y, width, height, data, onMouseEnter, onMouseLeave, children}) {
    const htmlName = data.name
        .replaceAll("[^a-zA-Z0-9]", "-")
        .toLowerCase()
    return (
        <g
            className='group'
            name={htmlName}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <rect
                className='panel'
                x={x} 
                y= {y} 
                width={width} 
                height={height} 
                fill='#01b4e4' 
            />
            <text
                className='title'
                x={x+6} 
                y={y+8}
                dominantBaseline='hanging'
            >
                {data.name}
            </text>
            <g name={'movies'}>
                {children}
            </g>
        </g>
    )
}

function Tile({x, y, width, height, fill, onClick, onMouseEnter, onMouseLeave}) {
    const panel = <rect
        className='tile'
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    />
    return panel
}

/* 
    Helper functions
*/

function between(value, min, max) {
    return min <= value && value <= max
}

function mapToSizeData(data, sizeKey) {
    const keys = data.map(m => m[sizeKey])
    const extent = d3.extent(keys)
    const scale = d3.scaleLinear(extent, [0, 100])
    return keys.map(scale)
}

function mapToColorData(data, colorKey, gradient) {
    const interp = d3.interpolateRgbBasis(gradient)
    const keys = d3.map(data, m => m[colorKey])
    const [min, max] = d3.extent(keys)
    const scale = d3
        .scalePow()
        .domain([min, 0, max])
        .range([0, 1])
        .exponent(0.1);
    return keys.map(m => interp(scale(m)))
}

function mapToGroupData(data, groupKey) {
    const nameOf = x => x.name ? x.name : x
    const membership = data.map(m => [m[groupKey]].flat().map(nameOf))
    const tiles = data.flatMap((_, i) => membership[i].map(g => { return {
        index: i,
        group: g,
    }}))
    console.log(membership)
    console.log(tiles)
    return tiles
}

function mapToTreeData(data, sizeKey, colorKey, groupKey, gradient, filters) {
    const sizeData = mapToSizeData(data, sizeKey)
    const colorData = mapToColorData(data, colorKey, gradient)
    const groupData = mapToGroupData(data, groupKey)
    const filterLeaves = x => {
        const funs = Object.entries(filters).map(filter => {
            const min = filter.min
            const max = filter.max
            const key = filter.key
            const fun = m => between(m[key], min, max)
            return fun
        })
        return funs.map(f => f(data[x.index])).every(b=>b)
    }
    const mapLeaves = x => {
        const index = x.index
        const group = x.group
        const color = colorData[x.index]
        const size = sizeData[x.index]
        return {index, group, color, size}
    }
    const filterNodes = x => { 
        const percentile = d3.sum(x[1].map(x => x.size))
        return percentile > 1
    }
    const mapNodes = kvp => {
        const name = kvp[0]
        const children = kvp[1]
        return {name, children}
    }
    const nodeOrder = node => {
        const value = node.children 
            ? d3.sum(node.children.map(nodeOrder)) 
            : node.data.size
        return value
    }
    const nodeSort = (a, b) => { 
        return nodeOrder(b) - nodeOrder(a)
    }
    const leaves = groupData.filter(filterLeaves).map(mapLeaves)
    console.log(leaves)
    const nodes = d3.groups(leaves, x => x.group).filter(filterNodes).map(mapNodes)
    console.log(nodes)
    const root = {name: "root", children: nodes}
    console.log(root)
    const tree = d3.hierarchy(root).sort(nodeSort).sum(n => n.size)
    console.log(tree)
    return tree;
}