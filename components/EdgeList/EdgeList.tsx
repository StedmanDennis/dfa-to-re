import cytoscape from "cytoscape";
import { Edge } from "../Edge/Edge";

interface props {
    edgeList: cytoscape.EdgeSingular[]
}

export function EdgeList({edgeList}:props){
    return (
        <div>
            {edgeList.map(edge=><Edge key={edge.id()} edge={edge}></Edge>)}
        </div>
    )
}