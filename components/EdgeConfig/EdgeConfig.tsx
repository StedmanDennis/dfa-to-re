import { EdgeAdder } from "../EdgeAdder/EdgeAdder";
import { EdgeList } from "../EdgeList/EdgeList";

interface props{
    nodeList: cytoscape.NodeSingular[]
    edgeList: cytoscape.EdgeSingular[]
    addEdge: (edge: cytoscape.EdgeDataDefinition) => void
}

export function EdgeConfig({edgeList, nodeList, addEdge}:props){
    return (
        <div style={{display: 'grid', gridTemplateRows: '1fr auto'}}>
            <EdgeList edgeList={edgeList}></EdgeList>
            <EdgeAdder edgeList={edgeList} nodeList={nodeList} addEdge={addEdge}></EdgeAdder>
        </div>
    )
}