import React, { useState, useMemo, useCallback, useEffect } from 'react'
import * as d3 from 'd3'
import dummyMovies from './dummyData'
import ReactSlider from 'react-slider'
import deepEquals from 'deep-equals'
import MovieGroup from './MovieGroup'
import MovieTooltip from './MovieTooltip'
import { group, min, treemapBinary, treemapSquarify } from 'd3'


const defaultMovies = dummyMovies
const defaultColors = ["red", "gray", "green"]
const defaultRanges = {
    budget: [-Infinity, Infinity],
    revenue: [-Infinity, Infinity],
    profit: [-Infinity, Infinity],
    profitRatio: [-Infinity, Infinity],
}

function MovieMap({ className, id, title, width, height}) {
    const [rawData, setRawData] = useState(defaultMovies)
    const [colors, setColors] = useState(defaultColors)
    const [ranges, setRanges] = useState(defaultRanges)
    const [sizeKey, setSizeKey] = useState("budget")
    const [gradKey, setGradKey] = useState("profit")
    const [groupKey, setGroupKey] = useState("genres")
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipData, setTooltipData] = useState({voteAverage:0, revenue:0, budget:0, profit:0, title:""})
    const [mousePosition, setMousePosition] = useState([0, 0])

    // Process the raw data into more fields.
    const data = useMemo(() => rawData.map((m) => Object.create({
        profit: m.revenue - m.budget,
        profitRatio: m.revenue / m.budget,
        ...m
    })), [rawData])

    // Initialize
    useEffect(() => {
        setRanges({
            budget: d3.extent(data.map(m => m.budget)),
            revenue: d3.extent(data.map(m => m.revenue)),
            profit: d3.extent(data.map(m => m.profit)),
            profitRatio: d3.extent(data.map(m => m.profitRatio)),
        })
    }, [data])

    // Generate treemap data
    const movieData = useMemo(() => {
        const inRange = (value, [min, max]) => value >= min && value <= max
        const pred = (m) => true
            && inRange(m.profit, ranges.profit)
            && inRange(m.budget, ranges.budget)
            && inRange(m.revenue, ranges.revenue)
            && inRange(m.profitRatio, ranges.profitRatio)
        return data.filter(pred)
    }, [data, ranges])

    const sizes = useMemo(() => {
        const keys = movieData.map(m => m[sizeKey])
        const extent = d3.extent(keys)
        const scale = d3.scaleLinear(extent, [0, 100])
        return keys.map(scale)
    }, [movieData, sizeKey])

    const gradients = useMemo(() => {
        const keys = movieData.map(m => m[gradKey])
        const extent = d3.extent(keys)
        const scale = d3.scalePow()
            .exponent(0.1)
            .domain([extent[0], 0, extent[1]])
            .range([0, 1])
        const interp = d3.interpolateRgbBasis(colors)
        return keys.map(m => interp(scale(m)))
    }, [movieData, gradKey, colors])

    const treemap = useMemo(() => {
        const groups = movieData.map(m =>
            [m[groupKey]].flat().map(x => x.name ? x.name : x)
        )
        const tiles = movieData.flatMap((_, i) => {
            return groups[i].map(g => {
                return {
                    index: i,
                    group: g,
                    order: sizes[i],
                    size: sizes[i],
                    gradient: gradients[i],
                }
            })
        })
        const categories = d3.map(d3.union(groups.flat()), group => {
            const name = group
            const children = tiles.filter(m => m.group == group)
            return { name, children }
        })
            .filter(c => d3.sum(c.children.map(x => x.size)) > 1)
        const root = { name: "root", children: categories }
        const order = n => n.children ? d3.sum(n.children.map(order)) : n.data.order
        const tree = d3
            .hierarchy(root)
            .sort((a, b) => order(b) - order(a))
            .sum(n => n.size)
        const layout = d3
            .treemap()
            .paddingInner(1)
            .paddingOuter(4)
            .paddingTop(28)
            .round(true)
            .tile(treemapSquarify)
            .size([width, height])
        return layout(tree);
    }, [movieData, sizes, gradients, groupKey])

    const treemapRender = useMemo(() => {
        const categories = treemap.children.map(m => {
            return {
                className: 'group',
                title: m.data.name,
                x: m.x0,
                y: m.y0,
                width: m.x1 - m.x0,
                height: m.y1 - m.y0,
                onMouseEnter: (_) => setShowTooltip(true),
                onMouseLeave: (_) => setShowTooltip(false),
                members: m.leaves().map(child => Object.create({
                    key: child.data.index,
                    id: movieData[child.data.index].id,
                    title: movieData[child.data.index].title,
                    score: child.data.size,
                    index: child.data.index,
                    x: child.x0,
                    y: child.y0,
                    width: child.x1 - child.x0,
                    height: child.y1 - child.y0,
                    fill: child.data.gradient,
                    onMouseEnter: (_) => {setTooltipData({
                            voteAverage: movieData[child.data.index].vote_average, 
                            revenue: movieData[child.data.index].revenue, 
                            budget: movieData[child.data.index].budget, 
                            profit: movieData[child.data.index].profit,
                            title: movieData[child.data.index].title,
                    })},
                })),
            }
        })
        return <svg>{categories.map(props => <MovieGroup key={props.title} {...props} />)}</svg>
    }, [treemap])

    const tooltipRender = useMemo(() => {
        return <MovieTooltip
            x={mousePosition[0]}
            y={mousePosition[1]}
            offsetX={20}
            offsetY={10}
            boundX={width}
            boundY={height}
            width={400} 
            height={200} 
            visibility={showTooltip ? 'visible' : 'hidden'}
            {...tooltipData}
        />
    }, [mousePosition, showTooltip, tooltipData])

    // Rendering
    if (!treemap.children) {
        return <><text>no movies</text></>
    }

    return <svg id={id + "-treemap"} width={width} height={height} onMouseMove={(e) => {setMousePosition([e.clientX, e.clientY])}}>
        {treemapRender}
        {tooltipRender}
    </svg>
}

















/*
<div>
        <text>Budget</text>

      </div>
      <div>
        <text>Profit</text>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          max={profitLimits[1]}
          min={profitLimits[0]}
          defaultValue={profitLimits}
          onAfterChange={(e) => setProfitRange(e) }
        />
      </div>
      <div>      
        <text>Revenue</text>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          max={revenueLimits[1]}
          min={revenueLimits[0]}
          defaultValue={revenueLimits}
          onAfterChange={(e) => setRevenueRange(e) }
        />
      </div>
 
  const treemapRender = useMemo(() => {
    return treemap.children.map((cat, i) => {
      const children = cat.children.map((child, i) => { 
        const title = movieData[child.data].title
        const width = child.x1-child.x0
        const height = child.y1-child.y0
        const scaledFs = width/(title.length*0.7)
        const fontSize = Math.min(...[20, height-8, scaledFs])
        return <g id={"movie-"+i} key={i}>
          <rect
            className='movie-node'
            x={child.x0}
            y={child.y0}
            width={width}
            height={height}
            fill={movieColors[i]}
            stroke="black"
            onMouseEnter={(e) => onMovieEnter(setShowTooltip(e))} 
            onMouseLeave={(e) => onMovieLeave(movieData[child.data])}
          />
          <text x={child.x0+4} y={child.y0+fontSize+4} fontSize={fontSize}>
            {(width > 10 && height > 10) ? movieData[child.data].title : ""}
          </text>
        </g>
      })
      return <g key={i} id={'category-'+cat.data.name}>
        <text x={cat.x0+6} y={cat.y0+14}>{cat.data.name}</text>
        <g id={cat.data.name+'-movies'}>{children}</g>
      </g>
    })
  }, [
    treemap, 
    movieData, 
    movieColors
  ])
 
tooltipVisibility: "hidden",
tooltipMovie: dummyMovies[0],
 
this.showTooltip = this.showTooltip.bind(this)
this.hideTooltip = this.hideTooltip.bind(this)
this.setTooltip = this.setTooltip.bind(this)
this.setMousePosition = this.setMousePosition.bind(this)
 
setTooltip(movie) {
  this.setState({tooltipMovie: movie})
}
 
hideTooltip() {
  this.setState({tooltipVisibility: "hidden"})
}
 
showTooltip() {
  this.setState({tooltipVisibility: "visible"})
}
 
setMousePosition(x, y) {
  this.setState({mousePositionX: x})
  this.setState({mousePositionY: y})
}
 
  renderTooltip() {
    const mx = this.state.mousePositionX
    const my = this.state.mousePositionY
    const w = 350
    const h = 250
    return <g 
      key={this.props.id+"-tooltip"} 
      transform={`translate(${mx+100}, ${my-2})`} 
      visibility={this.state.tooltipVisibility}
    >
      <rect
        id="tooltip"
        width={w}
        height={h}
        fill="white" 
        strokeWidth="2" 
        stroke="black" 
      />
      <text x={4} y={16}>
        {this.state.tooltipMovie.title}
      </text>
    </g>
  }
  { 
    this.setTooltip(node.data)
    this.showTooltip()
  }
    onMouseMove={(e) => this.setMousePosition(e.clientX, e.clientY)} 
*/

export default MovieMap 