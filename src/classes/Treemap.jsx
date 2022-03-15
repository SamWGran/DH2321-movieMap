import React, { useState, useMemo, useCallback, useEffect } from 'react'
import * as d3 from 'd3'

/**
 * Treemap is a React component that represents a treemap.
 * @param gradient - Array of colors to interpolate into the gradient.
 * @param colorKey - Numeric field in data used to determine color.
 * @param sizeKey - Numeric field in data used to determine size.
 * @param groupKey - The Field in data that is use determine group membership.
 * @param filters - Object that contains fields of type 'key: {key, min, max}'
 */
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
        .paddingInner(n => n.depth == 0 ? 10 : 1)
        .paddingOuter(5)
        .paddingTop(28)
        .round(true)
        .tile(d3.treemapSquarify)
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
        return <svg width={width} height={height} x={x} y={y} fill={'blue'}>
            <rect fill='blue'/>
        </svg>
    }
    return <svg width={width} height={height} x={x} y={y}> {
        treemap.children.map(g => <Group
            key={g.data.name}
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

/**
 * React component used to render a group node in the treemap.
 * @param {*} properties - properties of the group.
 */
function Group({x, y, width, height, data, onMouseEnter, onMouseLeave, children}) {
    const htmlName = data.name
        .replaceAll("[^a-zA-Z0-9]", "-")
        .toLowerCase()
    return (
		(width*height) > 4000 ? //TODO: make relative to screen size
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
					font-weight='bold'
					pointer-events='none'
				>
					{data.name}
				</text>
				<g name={'movies'}>
					{children}
				</g>
			</g>
			:
			null
    )
}
/**
 * React component used to render a tile in the treemap.
 * @param {*} properties 
 * @returns 
 */
function Tile({x, y, width, height, fill, onClick, onMouseEnter, onMouseLeave, movie}) {
    const panel = <>
		<rect
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
		{width > 40 && height > 25 ? 
			<text 
				x={x+(width/20)} 
				y={y+(20)} 
				className='tileText'
				dominantBaseline='top'
				pointer-events='none'
				>
				<tspan>{transformTitle(movie.title, width)}</tspan>
			</text>
		: null}
	</>
    return panel
}



/* 
    Helper functions
*/

/**
 * Transforms text (title) to width-adjusted length
 * @param {string} title - the movie title string.
 * @param {number} width - width of surrounding tile.
 * @returns adjusted string.
 */ 
function transformTitle(title, width, fontSize=9) {
	if(title.length*fontSize < width)
		return title
	else{
		var retS = ""
		var i=0
		while((retS.length+2)*(fontSize*1.4) < width){
			retS += title[i]
			i++
		}
		if(retS[retS.length-1] == " ")
			retS = retS.slice(0, -1);
		return retS+"..."
	}
}

/**
 * Checks if value is in range.
 * @param {number} value - value to compare.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns true if value is between min and max.
 */ 
function between(value, min, max) {
    return min <= value && value <= max
}

/**
 * Maps each element in data to a number between 0 and 100 that represents the data.
 * @param {*} data - The data used. 
 * @param {*} sizeKey - The field used to determine size.
 * @returns Array of sizes.
 */
function mapToSizeData(data, sizeKey) {
    const keys = data.map(m => m[sizeKey])
    const extent = d3.extent(keys)
    const scale = d3.scalePow().domain(extent).range([0, 100]).exponent(2)
    return keys.map(scale)
}

/**
 * Maps each element in data to a number between color on gradient.
 * @param {*} data - The data used. 
 * @param {*} colorKey - The field used to determine gradient.
 * @param {*} gradient - Colors used to generate gradient.
 * @returns Array of colors.
 */
function mapToColorData(data, colorKey, gradient) {
    const interp = d3.interpolateRgbBasis(gradient)
    const keys = d3.map(data, m => m[colorKey])
    const [min, max] = d3.extent(keys)
    const scale = d3
        .scaleLog()
        .domain([min, 1, max])
        .range([0, 1])
    return keys.map(m => interp(scale(m)))
}

/**
 * Generates an array of index and groups which bind an index to a group.
 * @param {*} data - The data used.
 * @param {*} groupKey - The field used to get which groups and object belongs to.
 * @returns Array of {index, group} pairs.
 */
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
/**
 * 
 * @param {*} data - The data used. 
 * @param {*} sizeKey - Field used to determine the size.
 * @param {*} colorKey - Field used to determine the size.
 * @param {*} groupKey - Field used to determine which groups and object is a member of.
 * @param {*} gradient - Colors used to generate the gradient.
 * @param {*} filters - Filters used to filter out data.
 * @returns A d3 Treemap root node. Each leaf has the data {index, group, color, size}.
 */
function mapToTreeData(data, sizeKey, colorKey, groupKey, gradient, filters) {
    const sizeData = mapToSizeData(data, sizeKey)
    const colorData = mapToColorData(data, colorKey, gradient)
    const groupData = mapToGroupData(data, groupKey)

    console.log(filters)

    const filterLeaves = x => {
        const funs = filters.map(filter => {
            const min = filter.min
            const max = filter.max
            const key = filter.key
            const fun = m => between(m[key], min, max)
            return fun
        })
        const results = funs.map(f => f(data[x.index]))
        return results.length == 0 || results.every(b=>b)
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
    //console.log(leaves)
    const nodes = d3.groups(leaves, x => x.group).filter(filterNodes).map(mapNodes)
    //console.log(nodes)
    const root = {name: "root", children: nodes}
    //console.log(root)
    const tree = d3.hierarchy(root).sort(nodeSort).sum(n => n.size)
    //console.log(tree)
    return tree;
}