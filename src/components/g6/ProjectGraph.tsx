// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { Rect, Text, type DisplayObject, type TextStyleProps } from '@antv/g';
// import {
//   Badge,
//   BaseBehavior,
//   BaseNode,
//   BaseTransform,
//   CommonEvent,
//   CubicHorizontal,
//   ExtensionCategory,
//   Graph,
//   GraphEvent,
//   iconfont,
//   idOf,
//   NodeEvent,
// //   positionOf,
//   register,
//   treeToGraphData,
//   type Graph as G6Graph,
// } from '@antv/g6';

// type MindMapData = {
//   id: string;
//   children?: MindMapData[] | string[];
//   depth?: number;
//   style?: { color?: string } & Record<string, unknown>;
// };

// type MindMapModelNode = MindMapData & { children?: string[]; depth?: number };
// type MindmapNodeStyle = {
//   collapsed?: boolean;
//   showIcon?: boolean;
//   color?: string;
//   direction?: 'left' | 'right' | 'center';
// };

// type MindmapNodeAttributes = MindmapNodeStyle & { size?: [number, number]; labelText?: string };
// type CollapseEventPayload = { id: string; collapsed: boolean };
// type PointerEventPayload = { target: { id: string } };

// const ICON_FONT_STYLE_ID = 'g6-iconfont-style';

// const RootNodeStyle = {
//   fill: '#EFF0F0',
//   labelFill: '#262626',
//   labelFontSize: 24,
//   labelFontWeight: 600,
//   labelOffsetY: 8,
//   labelPlacement: 'center' as const,
//   ports: [{ placement: 'right' }, { placement: 'left' }],
//   radius: 8,
// };

// const NodeStyle = {
//   fill: 'transparent',
//   labelPlacement: 'center' as const,
//   labelFontSize: 16,
//   labelFill: '#fff',
//   ports: [{ placement: 'right-bottom' }, { placement: 'left-bottom' }],
// };

// const TreeEvent = {
//   COLLAPSE_EXPAND: 'collapse-expand',
// } as const;

// let textShape: Text | null = null;
// const measureText = (text: TextStyleProps) => {
//   if (!textShape) textShape = new Text({ style: text });
//   textShape.attr(text);
//   return textShape.getBBox().width;
// };

// const getNodeWidth = (nodeId: string, isRoot: boolean) => {
//   const padding = isRoot ? 40 : 30;
//   const nodeStyle = isRoot ? RootNodeStyle : NodeStyle;
//   return measureText({ text: nodeId, fontSize: nodeStyle.labelFontSize, fontFamily: 'Gill Sans' }) + padding;
// };

// const getNodeSize = (nodeId: string, isRoot: boolean): [number, number] => {
//   const width = getNodeWidth(nodeId, isRoot);
//   const height = isRoot ? 48 : 32;
//   return [width, height];
// };

// class MindmapNode extends BaseNode<MindmapNodeStyle> {
//   static defaultStyleProps: MindmapNodeStyle = {
//     showIcon: false,
//   };

//   constructor(options: { style?: MindmapNodeStyle }) {
//     const style = options.style || {};
//     Object.assign(style, MindmapNode.defaultStyleProps);
//     super({ ...options, style });
//   }

//   get childrenData() {
//     return this.context.model.getChildrenData(this.id);
//   }

//   get rootId() {
//     return idOf(this.context.model.getRootsData()[0]);
//   }

//   isShowCollapse(attributes: MindmapNodeStyle) {
//     const { collapsed, showIcon } = attributes;
//     return !collapsed && showIcon && this.childrenData.length > 0;
//   }

//   getCollapseStyle(attributes: MindmapNodeStyle) {
//     const { showIcon, color, direction } = attributes;
//     if (!this.isShowCollapse(attributes)) return false;
//     const [width, height] = this.getSize(attributes);

//     return {
//       backgroundFill: color,
//       backgroundHeight: 12,
//       backgroundWidth: 12,
//       cursor: 'pointer',
//       fill: '#fff',
//       fontFamily: 'iconfont',
//       fontSize: 8,
//       text: '\ue6e4',
//       textAlign: 'center',
//       transform: direction === 'left' ? [['rotate', 90]] : [['rotate', -90]],
//       visibility: showIcon ? 'visible' : 'hidden',
//       x: direction === 'left' ? -6 : width + 6,
//       y: height,
//     };
//   }

//   drawCollapseShape(attributes: MindmapNodeStyle, container: DisplayObject) {
//     const iconStyle = this.getCollapseStyle(attributes);
//     // 方法1: 使用类型断言确保 textAlign 符合要求的类型
//     const btn = this.upsert('collapse-expand', Badge, {
//         ...iconStyle,
//         textAlign: iconStyle.textAlign as "center" | "left" | "right" | "end" | "start" | "middle" | undefined
//     }, container);

//     this.forwardEvent(btn, CommonEvent.CLICK, (event) => {
//       event.stopPropagation();
//       this.context.graph.emit(TreeEvent.COLLAPSE_EXPAND, {
//         id: this.id,
//         collapsed: !attributes.collapsed,
//       });
//     });
//   }

//   getCountStyle(attributes: MindmapNodeStyle) {
//     const { collapsed, color, direction } = attributes;
//     const count = this.context.model.getDescendantsData(this.id).length;
//     if (!collapsed || count === 0) return false;
//     const [width, height] = this.getSize(attributes);
//     return {
//       backgroundFill: color,
//       backgroundHeight: 12,
//       backgroundWidth: 12,
//       cursor: 'pointer',
//       fill: '#fff',
//       fontSize: 8,
//       text: count.toString(),
//       textAlign: 'center',
//       x: direction === 'left' ? -6 : width + 6,
//       y: height,
//     };
//   }

//   drawCountShape(attributes: MindmapNodeStyle, container: DisplayObject) {
//     const countStyle = this.getCountStyle(attributes);
//     const btn = this.upsert('count', Badge, countStyle, container);

//     this.forwardEvent(btn, CommonEvent.CLICK, (event) => {
//       event.stopPropagation();
//       this.context.graph.emit(TreeEvent.COLLAPSE_EXPAND, {
//         id: this.id,
//         collapsed: false,
//       });
//     });
//   }

//   forwardEvent(target: DisplayObject | undefined, type: string, listener: (event: PointerEventPayload) => void) {
//     if (target && !Reflect.has(target, '__bind__')) {
//       Reflect.set(target, '__bind__', true);
//       target.addEventListener(type, listener);
//     }
//   }

//   getKeyStyle(attributes: MindmapNodeAttributes) {
//     const [width, height] = this.getSize(attributes);
//     const keyShape = super.getKeyStyle(attributes);
//     return { width, height, ...keyShape };
//   }

//   drawKeyShape(attributes: MindmapNodeAttributes, container: DisplayObject) {
//     const keyStyle = this.getKeyStyle(attributes);
//     return this.upsert('key', Rect, keyStyle, container);
//   }

//   render(attributes: MindmapNodeStyle = this.parsedAttributes, container: DisplayObject = this) {
//     super.render(attributes, container);

//     this.drawCollapseShape(attributes, container);

//     this.drawCountShape(attributes, container);
//   }
// }

// class MindmapEdge extends CubicHorizontal {
//   get rootId() {
//     return idOf(this.context.model.getRootsData()[0]);
//   }

//   getKeyPath(attributes: unknown) {
//     const path = super.getKeyPath(attributes);
//     const isRoot = this.targetNode.id === this.rootId;
//     const labelWidth = getNodeWidth(this.targetNode.id, isRoot);

//     const [, tp] = this.getEndpoints(attributes);
//     const sign = this.sourceNode.getCenter()[0] < this.targetNode.getCenter()[0] ? 1 : -1;
//     return [...path, ['L', tp[0] + labelWidth * sign, tp[1]]];
//   }
// }

// class CollapseExpandTree extends BaseBehavior {
//   status: 'idle' | 'busy' = 'idle';

//   constructor(context: unknown, options: unknown) {
//     super(context, options);
//     this.bindEvents();
//   }

//   update(options: unknown) {
//     this.unbindEvents();
//     super.update(options);
//     this.bindEvents();
//   }

//   bindEvents() {
//     const { graph } = this.context;

//     graph.on(NodeEvent.POINTER_ENTER, this.showIcon);
//     graph.on(NodeEvent.POINTER_LEAVE, this.hideIcon);
//     graph.on(TreeEvent.COLLAPSE_EXPAND, this.onCollapseExpand);
//   }

//   unbindEvents() {
//     const { graph } = this.context;

//     graph.off(NodeEvent.POINTER_ENTER, this.showIcon);
//     graph.off(NodeEvent.POINTER_LEAVE, this.hideIcon);
//     graph.off(TreeEvent.COLLAPSE_EXPAND, this.onCollapseExpand);
//   }

//   showIcon = (event: PointerEventPayload) => {
//     this.setIcon(event, true);
//   };

//   hideIcon = (event: PointerEventPayload) => {
//     this.setIcon(event, false);
//   };

//   setIcon = (event: PointerEventPayload, show: boolean) => {
//     if (this.status !== 'idle') return;
//     const { target } = event;
//     const id = target.id;
//     const { graph, element } = this.context;
//     graph.updateNodeData([{ id, style: { showIcon: show } }]);
//     element.draw({ animation: false, silence: true });
//   };

//   onCollapseExpand = async (event: CollapseEventPayload) => {
//     this.status = 'busy';
//     const { id, collapsed } = event;
//     const { graph } = this.context;
//     await graph.frontElement(id);
//     if (collapsed) await graph.collapseElement(id);
//     else await graph.expandElement(id);
//     this.status = 'idle';
//   };
// }

// class AssignColorByBranch extends BaseTransform<{ colors: string[] }> {
//   static defaultOptions = {
//     colors: [
//       '#1783FF',
//       '#F08F56',
//       '#D580FF',
//       '#00C9C9',
//       '#7863FF',
//       '#DB9D0D',
//       '#60C42D',
//       '#FF80CA',
//       '#2491B3',
//       '#17C76F',
//     ],
//   };

//   constructor(context: unknown, options: { colors?: string[] }) {
//     super(context, Object.assign({}, AssignColorByBranch.defaultOptions, options));
//   }

//   beforeDraw<T>(input: T): T {
//     const nodes: MindMapModelNode[] = this.context.model.getNodeData();

//     if (nodes.length === 0) return input;

//     let colorIndex = 0;
//     const dfs = (nodeId: string, color?: string) => {
//       const node = nodes.find((datum) => datum.id === nodeId);
//       if (!node) return;

//       node.style ||= {};
//       node.style.color = color || this.options.colors[colorIndex++ % this.options.colors.length];
//       const childIds = (node.children || []).map((child) => (typeof child === 'string' ? child : child.id));
//       childIds.forEach((childId) => dfs(childId, node.style?.color as string));
//     };

//     nodes.filter((node) => node.depth === 1).forEach((rootNode) => dfs(rootNode.id));

//     return input;
//   }
// }

// let hasRegisteredExtensions = false;
// const registerExtensions = () => {
//   if (hasRegisteredExtensions) return;
//   register(ExtensionCategory.NODE, 'mindmap', MindmapNode);
//   register(ExtensionCategory.EDGE, 'mindmap', MindmapEdge);
//   register(ExtensionCategory.BEHAVIOR, 'collapse-expand-tree', CollapseExpandTree);
//   register(ExtensionCategory.TRANSFORM, 'assign-color-by-branch', AssignColorByBranch);
//   hasRegisteredExtensions = true;
// };

// const ensureIconFont = () => {
//   if (document.getElementById(ICON_FONT_STYLE_ID)) return;
//   const style = document.createElement('style');
//   style.id = ICON_FONT_STYLE_ID;
//   style.innerHTML = `@import url('${iconfont.css}');`;
//   document.head.appendChild(style);
// };

// const getNodeSide = (_nodeData: MindMapModelNode, parentData?: MindMapModelNode | null) =>
//   parentData ? 'right' : 'center';

// export default function ProjectGraph() {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const graphRef = useRef<G6Graph | null>(null);
//   const [graphError, setGraphError] = useState<string | null>(null);

//   useEffect(() => {
//     let cancelled = false;
//     const controller = new AbortController();
//     ensureIconFont();
//     registerExtensions();

//     const initGraph = async () => {
//       try {
//         const container = containerRef.current;
//         if (!container) return;

//         const response = await fetch('/data/mindMapProject1.json', { signal: controller.signal });
//         const data: MindMapData = await response.json();
//         if (cancelled) return;

//         const rootId = data.id;
//         const width = container.clientWidth || 800;
//         const height = container.clientHeight || 600;

//         const graph = new Graph({
//           container,
//           width,
//           height,
//           data: treeToGraphData(data),
//           node: {
//             type: 'mindmap',
//             style: function (d: MindMapModelNode) {
//               const direction = getNodeSide(d, this.getParentData(idOf(d), 'tree'));
//               const isRoot = idOf(d) === rootId;

//               return {
//                 direction,
//                 labelText: idOf(d),
//                 size: getNodeSize(idOf(d), isRoot),
//                 labelFontFamily: 'Gill Sans',
//                 labelBackground: true,
//                 labelBackgroundFill: 'transparent',
//                 labelPadding: direction === 'left' ? [2, 0, 10, 40] : [2, 40, 10, 0],
//                 ...(isRoot ? RootNodeStyle : NodeStyle),
//               };
//             },
//           },
//           edge: {
//             type: 'mindmap',
//             style: {
//               lineWidth: 3,
//               stroke: function (edgeData: { target: string }) {
//                 const targetNode = this.getNodeData(edgeData.target) as { style?: { color?: string } };
//                 return targetNode?.style?.color || '#99ADD1';
//               },
//             },
//           },
//           layout: {
//             type: 'mindmap',
//             direction: 'H',
//             getHeight: () => 30,
//             getWidth: (node: MindMapModelNode) => getNodeWidth(node.id, node.id === rootId),
//             getVGap: () => 6,
//             getHGap: () => 60,
//             animation: false,
//           },
//           behaviors: ['drag-canvas', 'zoom-canvas', 'collapse-expand-tree'],
//           transforms: ['assign-color-by-branch'],
//           animation: false,
//           autoFit: 'center',
//         });

//         if (cancelled) {
//           graph.destroy?.();
//           return;
//         }

//         graph.once(GraphEvent.AFTER_RENDER, () => {
//           graph.fitView();
//         });

//         graph.render();
//         graphRef.current = graph;
//         setGraphError(null);
//       } catch (error: unknown) {
//         if (!cancelled && !controller.signal.aborted) {
//           const message = error instanceof Error ? error.message : '图表渲染失败';
//           setGraphError(message);
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
