import React, { useState, useMemo, useCallback } from 'react'
import * as d3 from 'd3'
import dummyMovies from './moviemapData'
import ReactSlider from 'react-slider'
import deepEquals from 'deep-equals'

// useMemo = Stored Calculations.
// useState = State of component.

// Processing movie data.
function findMinMax(array) {
  const max = Math.max(...array)
  const min = Math.min(...array)
  return [min, max]
}

function inRange(value, [min, max]) {
  return value >= min && value <= max
}

function gradient3(start, center, end) {
    const startGradient = d3.interpolateHsl(start, center)
    const endGradient = d3.interpolateHsl(center, end)
    const gradient = (v) => {
      const value = v*2
      if (value < 1) {
        return startGradient(value)
      } else {
        return endGradient(value-1)
      }
    }
    return gradient
  
}

function normalize(array) {
  const [min, max] = findMinMax(array)
  return array.map(m => (m-min)/(max-min))
}

const defaultMovies = dummyMovies
const defaultGradient = gradient3("orange", "yellow", "green")

function Moviemap({id, width, height, title, onMovieEnter, onMovieLeave }) {
  
  const [data, setData] = useState(defaultMovies)
  const [gradient, setGradient] = useState(() => defaultGradient)

  const [budgetRange, setBudgetRange] = useState([-Infinity, Infinity])
  const [profitRange, setProfitRange] = useState([-Infinity, Infinity])
  const [revenueRange, setRevenueRange] = useState([-Infinity, Infinity])
  const [profitRatioRange, setProfitRatioRange] = useState([-Infinity, Infinity])
  
  const [sortKey, setSortKey]   = useState("budget")
  const [sizeKey, setSizeKey]   = useState("budget")
  const [gradKey, setGradKey]   = useState("budget")
  const [groupKey, setGroupKey] = useState("genres")
  
  // Generate additional data fields.
  const derivedData = useMemo(() => {
    return data.map((m) => { return {
      profit: m.revenue-m.budget,
      profitRatio: m.revenue/m.budget,
      ...m
    }})
  }, [data])

  // Find limits for the data.
  const budgetLimits      = useMemo(() => findMinMax(derivedData.map(m => m.budget)), [derivedData])
  const revenueLimits     = useMemo(() => findMinMax(derivedData.map(m => m.revenue)), [derivedData])
  const profitLimits      = useMemo(() => findMinMax(derivedData.map(m => m.profit)), [derivedData])
  const profitRatioLimits = useMemo(() => findMinMax(derivedData.map(m => m.profitRatio)), [derivedData])

  // Filter data.
  const movieData = useMemo(() => {
    const pred = (m) => inRange(m.profit, profitRange)
      && inRange(m.budget, budgetRange)
      && inRange(m.revenue, revenueRange)
      && inRange(m.profitRatio, profitRatioRange)
    return derivedData.filter(pred)
  }, [
    derivedData,
    budgetRange,
    profitRange,
    revenueRange,
    profitRatioRange,
  ])

  // Assign color to each data point 
  // Currently based on filtered data.
  const movieColors = useMemo(() => {
    return normalize(movieData.map(m => m[gradKey])).map(gradient)
  }, [
    gradient, 
    movieData
  ])

  const treemap = useMemo(() => {
    
    // Restructure data into a tree
    const groupsOf = i => [movieData[i][groupKey]].flat()
    let groupArray = []
    movieData.forEach((_, i) => {
      groupsOf(i).forEach(g => {
        const index = groupArray.findIndex(m => deepEquals(m.group, g));
        const found = index == -1
        if (found) {
          groupArray[index].children.push(i)          
        } else {
          groupArray.push({ group: g, children: [i]})
        }
      })
    })
    const groups = groupArray.map(m => Object.create(m.group, {children: m.children}))
    const root = { name: "root", children: groups }
    
    // Assign D3 mapping functions
    const order = n => (n.children) ? d3.sum(n.children.map(order)) : movieData[n.data][sortKey]
    const sort = (a, b) => order(b) - order(a)
    const size = n => (n.children) ? 0 : movieData[n][sizeKey]
    const layout = d3
      .treemap()
      .paddingInner(0)
      .paddingOuter(4)
      .paddingLeft(6)
      .paddingTop(24)
      .size([width, height])
      .round(true)
      .tile(d3.treemapSquarify)
    const tree = d3
      .hierarchy(root)
      .sum(size)
      .sort(sort)
    return layout(tree);
  },
  [
    movieData,
    sortKey, 
    sizeKey, 
    groupKey,
  ])

  // Rendering
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
            onMouseEnter={(e) => onMovieEnter(movieData[child.data])} 
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
  
  if (!treemap.children) {
    return <><text>no movies</text></>
  }

  return <div className='flex-container'>
    <div className='vertical-flex'>
      <div>
        <text>Budget</text>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          max={budgetLimits[1]}
          min={budgetLimits[0]}
          defaultValue={budgetLimits}
          onAfterChange={(e) => setBudgetRange(e) }
        />
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
    </div>
    <div>
      <svg
        id={id+"-treemap"} 
        width={width} 
        height={height}
        >
        {treemapRender}
      </svg>
    </div>
  </div>
}


/*
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

export default Moviemap 