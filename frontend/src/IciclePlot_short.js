// src/components/IciclePlot.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const IciclePlot = ({ data, decisionRoute, targetDecode }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(ref.current);
    const width = parseInt(svg.style('width'));
    const height = parseInt(svg.style('height'));

    svg.selectAll('*').remove();

    const root = d3.hierarchy(data)
      .sum((d) => d.size)
      .sort((a, b) => b.value - a.value);

    const partition = d3.partition().size([width, height])(root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const nodes = svg.selectAll('rect')
      .data(partition.descendants())
      .enter().append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => color((d.children ? d : d.parent).data.name))
      .on('mouseover', function (event, d) {
        d3.select(this).style('stroke', '#000').style('stroke-width', 2);
        highlightDecisionRoute(decisionRoute.node_index);
      })
      .on('mouseout', function (event, d) {
        d3.select(this).style('stroke', null).style('stroke-width', null);
        svg.selectAll('rect').style('opacity', 1);
      });

    svg.selectAll('text')
      .data(partition.descendants())
      .enter().append('text')
      .attr('x', (d) => d.x0 + 4)
      .attr('y', (d) => (d.y0 + d.y1) / 2)
      .text((d) => d.data.name)
      .style('font', '10px sans-serif')
      .style('fill', '#fff');

    svg.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .text(`Target: ${targetDecode}`)
      .style('font', '14px sans-serif')
      .style('fill', '#000');

    const highlightDecisionRoute = (nodeIndex) => {
      const routeNodes = partition.descendants().filter(d => Object.values(nodeIndex).includes(d.data.featureid));
      svg.selectAll('rect').style('opacity', 0.3);
      routeNodes.forEach(d => {
        svg.selectAll('rect')
          .filter(node => node.data === d.data)
          .style('opacity', 1);
      });
    };
  }, [data, decisionRoute, targetDecode]);

  return (
    <svg ref={ref} style={{ width: '100%', height: '400px' }}></svg>
  );
};

export default IciclePlot;
