import React, { Component } from 'react';
import * as d3 from 'd3';
import movies from './moviemapData'

function identity(m) {
  return m;
}

// Processing movie data.
function find_min_and_max(array, keyFunction) {
  const max = Math.max(...array.map(keyFunction));
  const min = Math.min(...array.map(keyFunction));
  return [min, max];
}

const [MIN_BUDGET, MAX_BUDGET] = find_min_and_max(movies, (m) => m.budget);
const [MIN_REVENUE, MAX_REVENUE] = find_min_and_max(movies, (m) => m.revenue);
const [MIN_RELEASE_DATE, MAX_RELEASE_DATE] = find_min_and_max(movies, (m) => m.release_date);
const [MIN_PROFIT_RATIO, MAX_PROFIT_RATIO] = find_min_and_max(movies, (m) => m.revenue/m.budget);
const [MIN_PROFIT_FLAT, MAX_PROFIT_FLAT] = find_min_and_max(movies, (m) => m.revenue-m.budget);

// D3 treemap helper functions.
function makeTreeFactory(groupsFunction, valueFunction, filterFunction) {
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

function makeNodeCompare(valueFunction) {
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
    this.svgRef = React.createRef();
    console.log([MIN_BUDGET, MAX_BUDGET]);
    console.log([MIN_REVENUE, MAX_REVENUE]);
    console.log([MIN_RELEASE_DATE, MAX_RELEASE_DATE]);
    console.log([MIN_PROFIT_RATIO, MAX_PROFIT_RATIO]);
    console.log([MIN_PROFIT_FLAT, MAX_PROFIT_FLAT]);
  }

  componentDidMount() {
    this.createSvg();
  }

  // Create hierarchy root object.
  // TODO Filter out more movies.
  genTreemapRoot() {
    const makeTree = makeTreeFactory(movieGenreNames, identity, ((m) => m.vote_average > 6.5));
    const compNodes = makeNodeCompare(m => movieNormalizedProfitFlat(m));
    const tree = makeTree(movies);

    console.log(tree);
    return d3
      .hierarchy(tree)
      .sum(m => +movieNormalizedProfitFlat(m))
      .sort(compNodes);
  }

  // Generate a treemap layout.
  genTreemapLayout() {
    const layout = d3
      .treemap()
      .paddingInner(2)
      .paddingOuter(4)
      .paddingLeft(2)
      .paddingTop(21)
      .size([this.props.width, this.props.height])
      .round(false)
      .tile(d3.treemapBinary);
    return layout;
  }

  // Generate a color gradient.
  // Todo Fix value ranges.
  genTreemapGradient() {
    const c1 = d3.hsl("green");
    const c2 = d3.hsl("grey");
    const c3 = d3.hsl("red");
    return makeGradient(c1, c2, c3);
  }

  // Draw an svg into this.svgRef.
  createSvg() {
    const treemapRoot = this.genTreemapRoot()
    const treemapLayout = this.genTreemapLayout();
    const treemapGradient = this.genTreemapGradient();

    const treemap = treemapLayout(treemapRoot);

    const svg = d3
      .select(this.svgRef.current)
      //.attr("viewBox", "0 0 100 100")
      .attr("width", this.props.width)
      .attr("height", this.props.height);

    // Add rectangles.
    svg.selectAll("g")
      .data(treemap.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`)
      .append("rect")
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .style("stroke", "black")
      .style("fill", (d) =>  treemapGradient(movieNormalizedBudget(d.data)));
    
    // Add movie titles.
    svg.selectAll("movie_titles")
      .data(treemap.leaves().filter((d) => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        return width > 10 && height > 10;
      }))
      .join("text")
      .attr("font-size", "0.9vw")
      .attr('x', (d) => d.x0+2)
      .attr('y', (d) => d.y0+12)
      .text((d) => {
        const title = d.data.title;
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        return title.slice(0, (width-8)/7);
      });
    
    // Add category titles
    svg.selectAll("category")
      .data(treemap.descendants().filter((d) => d.depth==1))
      .enter()
      .append("text")
      .attr('x', (d) => d.x0+2)
      .attr('y', (d) => d.y0+14)
      .text((d) => d.data.name);
  }

  render(){
    return <div id={"#" + this.props.id}>
      <svg ref={this.svgRef}></svg>
    </div>
  }


}

export default Moviemap;