import { defineGraph, defineLink, defineNode, type Graph, type GraphConfig, GraphController, type GraphLink, type GraphNode } from "d3-graph-controller";

import { activeTable, getRelationsRelatedTo } from "./data";

export type RelationType = "root" | "incoming" | "outgoing" | "bidirectional";
export type RelationNode = GraphNode<RelationType>;
export type RelationLink = GraphLink<RelationType, RelationNode>;
export type RelationGraph = Graph<RelationType, RelationNode, RelationLink>;
export type RelatinoGraphController = GraphController<RelationType, RelationNode, RelationLink>;
export type RelationGraphConfig = GraphConfig<RelationType, RelationNode, RelationLink>;

function defineClassNode(id: string, text: string, type: RelationType): RelationNode {
	return defineNode<RelationType, RelationNode>({
		color: `var(--color-node-${type})`,
		id,
		isFocused: false,
		label: {
			color: `var(--color-node-${type})`,
			fontSize: "0.875rem",
			text,
		},
		type,
	});
}

function defineRelationLink(source: RelationNode, target: RelationNode, text: string): RelationLink {
	return defineLink<RelationType, RelationNode, RelationNode>({
		color: "var(--color-link)",
		label: {
			color: "var(--color-link-label)",
			fontSize: "0.875rem",
			text,
		},
		source,
		target,
	});
}

export function getRelationGraph(): RelationGraph {
	const table = activeTable.value;
	if (!table) return defineGraph<RelationType, RelationNode, RelationLink>({ links: [], nodes: [] });
	const { nodes, links } = getRelationsRelatedTo(table.table_id),
		rootNode = nodes.find(node => node.class_id === table.table_id.toString()),
		finalNodes = nodes
			.map(
				(
					node
				): {
					class_id: string;
					class_name: string;
					type: RelationType;
				} => {
					if (node.class_id === rootNode?.class_id) {
						return {
							...node,
							type: "root",
						};
					}

					const linksFound = links.filter(link => link.source === node.class_id || link.target === node.class_id),
						outgoing = linksFound.filter(link => link.target === node.class_id),
						incoming = linksFound.filter(link => link.source === node.class_id);

					if (incoming.length > 0 && outgoing.length > 0) {
						return {
							...node,
							type: "bidirectional",
						};
					}

					if (incoming.length > 0) {
						return {
							...node,
							type: "incoming",
						};
					}

					if (outgoing.length > 0) {
						return {
							...node,
							type: "outgoing",
						};
					}

					return {
						...node,
						type: "root",
					};
				}
			)
			.map(node => defineClassNode(node.class_id, node.class_name, node.type));

	if (finalNodes.length === 0) {
		return defineGraph<RelationType, RelationNode, RelationLink>({
			links: [],
			nodes: [defineClassNode(table.table_id.toString(), table.table_name, "root")],
		});
	}

	return defineGraph<RelationType, RelationNode, RelationLink>({
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		links: links.map(link => defineRelationLink(finalNodes.find(n => n.id === link.source)!, finalNodes.find(n => n.id === link.target)!, link.text)),
		nodes: finalNodes,
	});
}
