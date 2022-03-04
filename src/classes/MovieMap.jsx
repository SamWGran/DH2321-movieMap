import React, { useState, useMemo, useCallback } from 'react'
import * as d3 from 'd3'
import dummyMovies from './dummyData'
import ReactSlider from 'react-slider'
import deepEquals from 'deep-equals'
import MovieGroup from './MovieGroup'

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
    const value = v * 2
    if (value < 1) {
      return startGradient(value)
    } else {
      return endGradient(value - 1)
    }
  }
  return gradient

}

function normalize(array) {
  const [min, max] = findMinMax(array)
  return array.map(m => (m - min) / (max - min))
}

const defaultMovies = dummyMovies
const defaultGradient = gradient3("orange", "yellow", "green")

function MovieMap({ className, id, title, width, height}) {

  const [data, setData] = useState(defaultMovies)
  const [gradient, setGradient] = useState(() => defaultGradient)

  const [budgetRange, setBudgetRange] = useState([-Infinity, Infinity])
  const [profitRange, setProfitRange] = useState([-Infinity, Infinity])
  const [revenueRange, setRevenueRange] = useState([-Infinity, Infinity])
  const [profitRatioRange, setProfitRatioRange] = useState([-Infinity, Infinity])

  const [sortKey, setSortKey] = useState("profit")
  const [sizeKey, setSizeKey] = useState("profit")
  const [gradKey, setGradKey] = useState("test")
  const [groupKey, setGroupKey] = useState("genres")

  // Generate additional data fields.
  const derivedData = useMemo(() => {
    return data.map((m) => {
      return {
        test: m.revenue/Math.log(m.budget), // Looks cool
        profit: m.revenue - m.budget,
        profitRatio: m.revenue / m.budget,
        ...m
      }
    })
  }, [data])

  // Find limits for the data.
  // Add more limits
  const budgetLimits = useMemo(() => findMinMax(derivedData.map(m => m.budget)), [derivedData])
  const revenueLimits = useMemo(() => findMinMax(derivedData.map(m => m.revenue)), [derivedData])
  const profitLimits = useMemo(() => findMinMax(derivedData.map(m => m.profit)), [derivedData])
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
        const found = index != -1
        if (found) {
          groupArray[index].children.push(i)
        } else {
          groupArray.push({ group: g, children: [i] })
        }
      })
    })
    const groups = groupArray.map(m => Object.create({ ...m.group, children: m.children }))
    const root = { name: "root", children: groups }

    // Assign D3 mapping functions
    const order = n => (n.children) ? d3.sum(n.children.map(order)) : movieData[n.data][sortKey]
    const sort = (a, b) => order(b) - order(a)
    console.log(root)
    const size = n => {
      return (n.children) ? 0 : movieData[n][sizeKey] 
    }
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
      width,
      height
  ])

  // Rendering


  if (!treemap.children) {
    return <><text>no movies</text></>
  }


  const onSelected = (i) => {}
  const onShowDetails = (i) => {}
  const onHideDetails = (i) => {}

  console.log(treemap)

  const componentData = treemap.children.map(m => { return {
      className: 'group',
      title: m.data.name,
      x: m.x0,
      y: m.y0,
      width: m.x1-m.x0,
      height: m.y1-m.y0,
      members: m.children.map(child => Object.create({
          id: movieData[child.data].id,
          title: movieData[child.data].title,
          score: movieData[child.data][sizeKey],
          index: child.data,
          x: child.x0,
          y: child.y0,
          width: child.x1-child.x0,
          height: child.y1-child.y0,
          fill: movieColors[child.data],
      })),
      onSelected: onSelected,
      onShowDetails: onShowDetails,
      onHideDetails: onHideDetails,
  }})

  const zoom = 1;
  const pan_x = 0;
  const pan_y = 0;
  //moveable(document.getElementById(id + "-treemap"))


  return <div>
    <svg id={id + "-treemap"} width={width} height={height} viewBox={`${pan_x} ${pan_y} ${width / zoom + pan_x} ${height / zoom + pan_x}`}>
      {componentData.map(props => <MovieGroup key={props.title} {...props}/>)}
    </svg>
  </div>
}


  /*
  
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