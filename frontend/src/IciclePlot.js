// src/components/IciclePlot.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Helper hook to get the size of the container
const useResizeObserver = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };

    handleResize(); // Initial call

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref]);

  return size;
};

const IciclePlot = ({ data, decisionRoute, targetDecode }) => {
  const ref = useRef();
  const { width, height } = useResizeObserver(ref);

  useEffect(() => {
    if (!data) {
      console.error('No data provided to IciclePlot');
      return;
    }

    if (!width || !height) return; // Don't render until dimensions are available

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const partition = (data) => {
      const root = d3.hierarchy(data)
        .sum((d) => d.size)
        .sort((a, b) => b.size - a.size);
      return d3.partition()
        .size([width, height])(root);
    };

    const root = partition(data);

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll("*").remove(); // Clear previous contents if any

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("box-shadow", "0 0 10px rgba(0,0,0,0.5)");

    svg.selectAll("rect")
      .data(root.descendants())
      .enter().append("rect")
      .attr("class", "node")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => color((d.children ? d : d.parent).data.feature))
      .style("stroke", "#fff")
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible")
          .text(`${d.data.feature}`);
        // .text(`${d.data.feature}: ${d.data.size}`);
        highlightDecisionRoute(decisionRoute.node_index);
      })
      .on("mousemove", function (event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        svg.selectAll('rect').style('opacity', 1);
      });

    svg.selectAll("text")
      .data(root.descendants())
      .enter().append("text")
      .attr("class", "label")
      .attr("x", (d) => d.x0 + 4)
      .attr("y", (d) => (d.y0 + d.y1) / 2)
      .text((d) => d.data.feature)
      .style("fill", "#fff")
      .style("font", "10px sans-serif")
      .style("text-anchor", "start")
      .style("dominant-baseline", "middle");

    svg.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .text(`Target: ${targetDecode}`)
      .style('font', '14px sans-serif')
      .style('fill', '#000');

    const highlightDecisionRoute = (nodeIndex) => {
      const routeNodes = root.descendants().filter(d => Object.values(nodeIndex).includes(d.data.featureid));
      svg.selectAll('rect').style('opacity', 0.3);
      routeNodes.forEach(d => {
        svg.selectAll('rect')
          .filter(node => node.data === d.data)
          .style('opacity', 1);
      });
    };
  }, [data, width, height, decisionRoute, targetDecode]);

  return (
    <svg ref={ref} style={{ width: '100%', height: '100%' }}></svg>
  );
};

export default IciclePlot;
