import React, { useState, useMemo, useCallback, useEffect } from 'react'
import * as d3 from 'd3'

function movable(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
      elmnt.onmousedown = dragMouseDown;
      elmnt.classList.add('movable');
  }
  
  function zoomable(elmnt) {
    function zoom(event) {
      event.preventDefault();
    
      scale += event.deltaY * -0.005;
    
      // Restrict scale
      scale = Math.min(Math.max(1, scale), 8);
    
      // Apply scale transform
      elmnt.style.transform = `scale(${scale})`;
      elmnt.style.fontSize = `${1/scale}em`;
    }
    
    let scale = 1;
    elmnt.onwheel = zoom;
  }
  
  function hoverable(clss) {
    const elements = document.getElementsByClassName(clss)
    for (let i = 0; i < elements.length; i++) {
        const elmnt = elements[i]
        const movieclass = elmnt.classList[0] != "tile"? elmnt.classList[0] : elmnt.classList[1]

        function hover(event) {
            const movie = document.getElementsByClassName(movieclass)
            for (let j = 0; j < movie.length; j++) {
                movie[j].classList.add("hovering")
            }
        }

        function unhover(event) {
            const movie = document.getElementsByClassName(movieclass)
            for (let j = 0; j < movie.length; j++) {
                movie[j].classList.remove("hovering")
            }
        }
        
        elmnt.onmouseover = hover;
        elmnt.onmouseout = unhover;
    }
  }

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
    hiddenGroups,
    onSwapTooltip,
    onShowTooltip,
    onHideTooltip,
}) {
    const layout =  d3
        .treemap()
        .paddingInner(n => n.depth == 0 ? 20 : 0)
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
        filters,
        hiddenGroups
    )
    useEffect(() => {
        const elmnt = document.getElementById("moviemap-container")
        movable(elmnt)
        zoomable(elmnt)
        hoverable('tile')
    })
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
                fill='#3d3c3e' 
            />
            <text
                className='title'
                x={x+6} 
                y={y+8}
                fill={'#eee'}
                style={{fontSize:'1rem', color: 'white'}}
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
/**
 * React component used to render a tile in the treemap.
 * @param {*} properties 
 * @returns 
 */
 function Tile({x, y, width, height, fill, onClick, onMouseEnter, onMouseLeave, movie}) {
    const panel = <>
        <rect
        className={'tile tile-' + movie.id}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={"purple"}
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
                pointerEvents='none'
                style={{fontSize:'0.9rem'}}
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
 function transformTitle(title, width, fontSize=10) {
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
    const scale = d3.scalePow()
        .domain(extent)
        .range([0, 100])
        .exponent(2)
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
        .range([0, 0.5, 1])
    return keys.map(m => interp(scale(m)))
}

/**
 * Generates an array of index and groups which bind an index to a group.
 * @param {*} data - The data used.
 * @param {*} groupKey - The field used to get which groups and object belongs to.
 * @returns Array of {index, group} pairs.
 */
function mapToGroupData(data, groupKey, hidden) {
    const nameOf = x => x.name ? x.name : x
    const membership = data.map(m => [m[groupKey]].flat().map(nameOf))
    const tiles = data.flatMap((_, i) => membership[i].map(g => { return {
        index: i,
        group: g,
    }}))
    .filter(t => !hidden.includes(t.group))
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
function mapToTreeData(data, sizeKey, colorKey, groupKey, gradient, filters, hidden) {
    const sizeData = mapToSizeData(data, sizeKey)
    const colorData = mapToColorData(data, colorKey, gradient)
    const groupData = mapToGroupData(data, groupKey, hidden)

    //console.log(filters)

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
        //return percentile > 1
        return true
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