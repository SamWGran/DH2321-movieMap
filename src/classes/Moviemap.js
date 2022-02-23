import React, { Component } from 'react';
import * as d3 from 'd3';
import dummyMovies from './moviemapData';
import { index, treemap } from 'd3';

function identity(m) {
  return m;
}

// Processing movie data.
function find_min_and_max(array, keyFunction) {
  const max = Math.max(...array.map(keyFunction));
  const min = Math.min(...array.map(keyFunction));
  return [min, max];
}

const [MIN_BUDGET, MAX_BUDGET] = find_min_and_max(dummyMovies, (m) => m.budget);
const [MIN_REVENUE, MAX_REVENUE] = find_min_and_max(dummyMovies, (m) => m.revenue);
const [MIN_RELEASE_DATE, MAX_RELEASE_DATE] = find_min_and_max(dummyMovies, (m) => m.release_date);
const [MIN_PROFIT_RATIO, MAX_PROFIT_RATIO] = find_min_and_max(dummyMovies, (m) => m.revenue/m.budget);
const [MIN_PROFIT_FLAT, MAX_PROFIT_FLAT] = find_min_and_max(dummyMovies, (m) => m.revenue-m.budget);

// D3 treemap helper functions.
function makeTreeFactory(filterFunction, groupsFunction, valueFunction) {
  return (array) => {
    const dataMap = new Map();
    array.filter(filterFunction).forEach((elem) => {
      const value = valueFunction(elem);
      const groups = groupsFunction(elem);
      groups.forEach((group) => {
        if (!dataMap.has(group)) { 
          dataMap.set(group, []);
        }
        dataMap.get(group).push(value);
      });
    });

    const dataArray = Array.from(dataMap.entries()).map(([key, value]) => {
      return {
        name: key,
        children: value,
      };
    });
    return {
      name: "root",
      children: dataArray,
    };
  };
}

function makeNodeSorter(valueFunction) {
  return (nodeA, nodeB) => {
    if (nodeA.depth == 0 && nodeB.depth == 0) {
      const aValue = nodeA.children.length;
      const bValue = nodeB.children.length; 
      return bValue-aValue;
    }
    const aValue = valueFunction(nodeA.data);
    const bValue = valueFunction(nodeB.data);
    return bValue-aValue;
  };
}

function makeNodeSummer(valueFunction) {
  return m => +valueFunction(m);
}

function makeGradient(start, center, end) {
    const startGradient = d3.interpolateHsl(start, center);
    const endGradient = d3.interpolateHsl(center, end);
    const gradient = (v) => {
      const value = v*2;
      if (value < 1) {
        return startGradient(value);
      } else {
        return endGradient(value-1);
      }
    };
    return gradient;
  
}

function makeTreemapLayout(width, height) {
  return d3
    .treemap()
    .paddingInner(0)
    .paddingOuter(2)
    .paddingBottom(2)
    .paddingLeft(4)
    .paddingTop(21)
    .size([width, height])
    .round(true)
    .tile(d3.treemapSquarify);
}

// Movie helper functions
function movieNormalizedProfitRatio(node) {
  return ((node.revenue/node.budget)-MIN_PROFIT_RATIO)/(MAX_PROFIT_RATIO-MIN_PROFIT_RATIO);
}

function movieNormalizedProfitFlat(node) {
  return ((node.revenue-node.budget)-MIN_PROFIT_FLAT)/(MAX_PROFIT_FLAT-MIN_PROFIT_FLAT);
}

function movieNormalizedBudget(node) {
  return (node.budget-MIN_BUDGET)/(MAX_BUDGET-MIN_BUDGET);
}

function movieGenreNames(node) {
  return node.genres.map(m => m.name);
}

class Moviemap extends Component {
  constructor(props) {
    super(props);
    
    // Try changing to test different setups.
    this.state = {
      sortKey: movieNormalizedProfitFlat,
      sumKey: movieNormalizedProfitFlat,
      gradientKey: movieNormalizedProfitFlat,

      filtering: (m => m.vote_average > 8),
      grouping: movieGenreNames,
      trimming: identity,
      
      startColor: "white",
      centerColor: "grey",
      finalColor: "blue",
      
      movies: dummyMovies,

      mousePositionX: 0,
      mousePositionY: 0,

      tooltipVisibility: "hidden",
      tooltipMovie: dummyMovies[0],
    };

    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.setTooltip = this.setTooltip.bind(this);
    this.setMousePosition = this.setMousePosition.bind(this);
  }

  genTreemap() {
    const treeFactory = makeTreeFactory(
      this.state.filtering, 
      this.state.grouping, 
      this.state.trimming
    );
    const sortNodes = makeNodeSorter(this.state.sortKey);
    const sumNodes = makeNodeSummer(this.state.sumKey);
    const layout = makeTreemapLayout(this.props.width-24, this.props.height-24)
    const tree = treeFactory(this.state.movies);
    const root = d3
      .hierarchy(tree)
      .sum(sumNodes)
      .sort(sortNodes);
    return layout(root);
  }

  genGradient() {
    const c1 = this.state.startColor;
    const c2 = this.state.centerColor;
    const c3 = this.state.finalColor;
    return makeGradient(c1, c2, c3);
  }

  setTooltip(movie) {
    this.setState({tooltipMovie: movie});
  }

  hideTooltip() {
    this.setState({tooltipVisibility: "hidden"});
  }
  
  showTooltip() {
    this.setState({tooltipVisibility: "visible"});
  }

  setMousePosition(x, y) {
    this.setState({mousePositionX: x});
    this.setState({mousePositionY: y});
  }

  renderTooltip() {
    const mx = this.state.mousePositionX;
    const my = this.state.mousePositionY;
    const w = 350;
    const h = 250;
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
    </g>;
  }

  renderMovieNode(node, index) {
    const x = node.x0;
    const y = node.y0;
    const w = node.x1 - node.x0;
    const h = node.y1 - node.y0;
    const gradient = this.genGradient();
    const color = gradient(this.state.gradientKey(node.data));
    const ifontSize = w/(node.data.title.length*0.7);
    const fontSize = Math.min(...[16, h-8, ifontSize]);
    let title = <g> </g>;
    if (w > 10 && h > 10) {
      title = <text 
          x={x+4} 
          y={y+fontSize+4}
          fontSize={`${fontSize}`}
        >
          {node.data.title}
        </text>;
    }
    return <g id={"movie-"+node.data.id} key={index}>
      <rect 
        key={index} 
        x={x} 
        y={y} 
        width={w} 
        height={h} 
        fill={color} 
        stroke="black"
        onMouseEnter={(e) => { 
          this.setTooltip(node.data);
          this.showTooltip();
        }} 
        onMouseLeave={(e) => this.hideTooltip()}
      />
      {title}
    </g>;

  }
  
  renderCategoryNode(category, index) {
    const name = category.data.name;
    return <g id={name} key={index}>
      <text x={category.x0+4} y={category.y0+14}>{name}</text>
      <g key={category+"-"+index} id="movies">
        {
          category.children.map((v, i) => this.renderMovieNode(v, i))
        }
      </g>
    </g>;
  }

  render(){
    const treemap = this.genTreemap();

    return <div 
      id={this.props.id+"-treemap"} 
      key={this.props.id} 
      onMouseMove={(e) => this.setMousePosition(e.clientX, e.clientY)} 
    >
      <svg 
        key={this.props.id+"-treemap"}
        width={this.props.width} 
        height={this.props.height}
      >
        {treemap.children.map((v, i) => this.renderCategoryNode(v, i))}
        {this.renderTooltip()}
      </svg>
    </div>
  }
}

export default Moviemap; 