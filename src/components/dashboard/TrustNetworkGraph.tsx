import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// Types for nodes and links
type Node = {
  id: string;
  name: string;
  trustScore: number;
  isCurrentUser?: boolean;
};

type Link = {
  source: string;
  target: string;
  trust: number;
};

interface TrustNetworkGraphProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
}

const TrustNetworkGraph: React.FC<TrustNetworkGraphProps> = ({ nodes, links, width = 600, height = 400 }) => {
  const fgRef = useRef<any>();

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3ReheatSimulation();
    }
  }, [nodes, links]);

  return (
    <div style={{ width: '100%', height }}>
      <ForceGraph2D
        ref={fgRef}
        width={width}
        height={height}
        graphData={{ nodes, links }}
        nodeLabel={node => `${node.name} (Trust: ${node.trustScore})`}
        nodeAutoColorBy={node => node.isCurrentUser ? 'current' : 'trustScore'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = `${node.name}`;
          const fontSize = 14/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.isCurrentUser ? 12 : 8, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.isCurrentUser ? '#4CAF50' : '#2196F3';
          ctx.shadowColor = node.isCurrentUser ? '#6DE77B' : '#2196F3';
          ctx.shadowBlur = node.isCurrentUser ? 10 : 0;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#fff';
          ctx.fillText(label, node.x, node.y + 10);
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkWidth={link => Math.max(1, link.trust / 20)}
        linkColor={() => '#6DE77B'}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current && fgRef.current.zoomToFit(400)}
      />
    </div>
  );
};

export default TrustNetworkGraph; 