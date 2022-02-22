import React, { Component } from 'react';
import * as d3 from 'd3';
import movies from './moviemapData'



class Moviemap extends Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    this.createSvg();
  }

  // Create hierarchy root object.
  // TODO Filter out more movies.
  createRoot() {
    // Build data map.
    let dataMap = new Map();
    movies.forEach((m) => {
      this.movieGroups(m).forEach((key) => {
        if (!dataMap.has(key)) { 
          dataMap.set(key, []);
        };
        dataMap.get(key).push(m);
      });
    });
    // Construct tree from data map.
    const treeObject = {
      name: "root",
      children: Array.from(dataMap.keys()).map((group) => { 
        return {
          name: group,
          children: dataMap.get(group),
        };
      }),
    }
    // Construct d3 hierarchy object from the tree.
    const rootObject = d3
      .hierarchy(treeObject)
      .sum((movie) => +this.movieValue(movie))
      .sort((nodeA, nodeB) => {
        if (nodeA.depth == 1 && nodeB.depth == 1) {
          const aValue = nodeA.children.length;
          const bValue = nodeB.children.length; 
          return bValue-aValue;
        }
        const aValue = this.movieValue(nodeA.data);
        const bValue = this.movieValue(nodeB.data);
        return bValue-aValue;
      });
    
    return rootObject;
  }

  // Generate a treemap layout.
  createLayout() {
    const layout = d3
      .treemap()
      .paddingInner(0)
      .paddingOuter(4)
      .paddingLeft(2)
      .paddingTop(21)
      .size([this.props.width, this.props.height])
      .round(false)
      .tile(d3.treemapSquarify.ratio(2.5));
    return layout;
  }

  // Generate a color gradient.
  // Todo Fix value ranges.
  createColorGradient() {
    const positive = d3.hsl("green");
    const neutral = d3.hsl("grey");
    const negative = d3.hsl("red");
    const positiveGradient = (value) => d3.interpolateHsl(negative, positive)(value);
    const negativeGradient = (value) => d3.interpolateHsl(neutral, negative)(value);
    const gradient = (value) => {
      const v = (value-0.5)/0.5;
      if (v < 0) {
        return negativeGradient(-v);
      } else {
        return positiveGradient(v);
      }
    };
    return positiveGradient;
  }

  // Draw an svg into this.svgRef.
  createSvg() {
    const root = this.createRoot()
    const layout = this.createLayout();
    const gradient = this.createColorGradient();
    const treemap = layout(root);

    const svg = d3
      .select(this.svgRef.current)
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
      .style("fill", (d) =>  gradient(this.normalizedProfit(d.data)) );
    
    // Add movie titles.
    svg.selectAll("movie_titles")
      .data(treemap.leaves().filter((d) => {
        const title = d.data.title;
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        return width > 70 && height > 10;
      }))
      .join("text")
      .attr("font-size", "0.7vw")
      .attr('x', (d) => d.x0+4)
      .attr('y', (d) => d.y0+16)
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
      <svg ref={this.svgRef} width={this.props.width} height={this.props.height}></svg>
    </div>
  }

  budgetRange() {
    const max = Math.max(...movies.map((m) => m.budget));
    const min = Math.min(...movies.map((m) => m.budget));
    return [min, max];
  }
  
  profitValue(m) {
    return m.revenue/m.budget;
  }

  profitRange() {
    const max = Math.max(...movies.map((m) => this.profitValue(m)));
    const min = Math.min(...movies.map((m) => this.profitValue(m)));
    return [min, max];
  }

  normalizedProfit(movie) {
    const [min, max] = this.profitRange();
    const profit = this.profitValue(movie);
    const normalized = (profit-min)/(max-min);
    return normalized;
  }

  movieValue(movie) {
    return this.normalizedProfit(movie);
  }
  
  movieGroups(movie) {
    return [movie.original_language]; //.map((x) => x.name);
  }
  
  movieName(movie) {
    return movie.title;
  }
}

export default Moviemap;