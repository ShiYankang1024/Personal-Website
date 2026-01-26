// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import type { Graph as G6Graph } from '@antv/g6';

// export default function SkillGraph() {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const graphRef = useRef<G6Graph | null>(null);
//     const [graphError, setGraphError] = useState<string | null>(null);
    
//     interface NodeType {
//         id: string;
//         data: {
//             cluster: string;
//         };
//     }

//   useEffect(() => {
//     let cancelled = false;
//     const controller = new AbortController();

//     const initGraph = async () => {
//       try {
//         const container = containerRef.current;
//         if (!container) return;

//         const [{ Graph }, data] = await Promise.all([
//           import('@antv/g6'),
//           fetch('/data/g6collection.json', { signal: controller.signal }).then((res) => res.json()),
//         ]);

//         const groupedNodesByCluster: Record<string, string[]> = (data?.nodes ?? []).reduce(
//           (acc: Record<string, string[]>, node: NodeType) => {
//             const cluster = node.data.cluster;
//             acc[cluster] = acc[cluster] || [];
//             acc[cluster].push(node.id);
//             return acc;
//           },
//           {},
//         );

//         const createStyle = (baseColor: string) => ({
//           fill: baseColor,
//           stroke: baseColor,
//           labelFill: '#fff',
//           labelPadding: 2,
//           labelBackgroundFill: baseColor,
//           labelBackgroundRadius: 5,
//         });

//         const clusterColors: Record<string, string> = {
//           框架: '#1783FF',
//           组件库: '#00C9C9',
//           可视化: '#F08F56',
//           建模: '#D580FF',
//           WebGis: '#9572f3ff',
//         };

//         const hullPlugins = Object.keys(clusterColors).map((clusterKey) => ({
//           key: `hull-${clusterKey}`,
//           type: 'hull',
//           members: groupedNodesByCluster[clusterKey] || [],
//           labelText: `${clusterKey}`,
//           ...createStyle(clusterColors[clusterKey]),
//         }));

//         const width = container.clientWidth || 800;
//         const height = container.clientHeight || 360;

//         const graph = new Graph({
//           container,
//           width,
//           height,
//           data,
//           behaviors: ['zoom-canvas', 'drag-canvas', 'drag-element'],
//           node: {
//             style: {
//               labelText: (d) => d?.data?.name || d.id,
//               labelPlacement: 'middle',
//               labelFill: '#fff',
//               labelPadding: 4,
//               labelFontSize: 12,
//             },
//             palette: { field: 'cluster' },
//           },
//           layout: {
//             type: 'force',
//             preventOverlap: true,
//             linkDistance: (edge: { source: string; target: string }) => {
//               if (edge.source === 'node0' || edge.target === 'node0') {
//                 return 140;
//               }
//               return 60;
//             },
//           },
//           plugins: hullPlugins,
//           autoFit: 'center',
//         });

//         if (cancelled) {
//           graph.destroy?.();
//           return;
//         }

//         graph.render();
//         graphRef.current = graph;
//         setGraphError(null);
//       } catch (error: unknown) {
//         if (!cancelled) {
//             // 类型检查以安全地访问 error.message
//             if (error instanceof Error) {
//             setGraphError(error.message || '图表渲染失败');
//             } else {
//             setGraphError('图表渲染失败');
//             }
//         }
//       }
//     };

//     requestAnimationFrame(initGraph);

//     return () => {
//       cancelled = true;
//       controller.abort();
//       graphRef.current?.destroy?.();
//       graphRef.current = null;
//     };
//   }, []);

//   return (
//     <div className="mt-6 h-[650px] w-full overflow-hidden rounded-xl border border-white/15 bg-white/5 flex items-center justify-center">
//       {graphError ? (
//         <p className="text-sm text-red-200">{graphError}</p>
//       ) : (
//         <div ref={containerRef} className="h-full w-full" />
//       )}
//     </div>
//   );
// }
