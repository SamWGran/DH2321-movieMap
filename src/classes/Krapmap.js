import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { color } from 'd3';
import { buildQueries } from '@testing-library/react';

export default function Krapmap({ data, width, height }) {
    const svgRef = useRef(null);

    function renderKrapmap() {
        const svg = d3.select(svgRef.current);
        svg.selectAll('g').remove();
        
        svg.attr('width', width).attr('height', height);

        const nodes = svg
        .selectAll('g')
        .data(data)
        .join('g')
        .classed('krap', true)
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

        nodes
        .append('rect')
        .attr('width', (d) => 100)
        .attr('height', (d) => 100)
        .attr('fill', (d) => d3.interpolateRgb(d.color, '#fff')(0.3))
        .append('title')
        .text((d) => `Color is ${d.color}`);
    }

    useEffect(() => {
        renderKrapmap();
    }, [data]);

    Array.from(document.getElementsByClassName("krap")).forEach((el) => {
        //alert("hello");
        el.addEventListener("mouseover", () => {
            alert("LOL");
            console.log("lol");
        }, false);
    });
    
    return (
    <div>
        <svg ref={svgRef} />
    </div>
    );

}