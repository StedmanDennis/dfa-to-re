import { Node } from "../Node/Node";

interface props {
    nodeList: cytoscape.NodeSingular[]
}

export function NodeList({nodeList}:props) {
    return (
        <div>
            {nodeList.map(node=><Node key={node.id()} node={node}></Node>)}
        </div>
    )
}