import { Button } from "@mui/material"
import cytoscape from "cytoscape"
import { Edge } from "./Edge"
import { EdgeAdder } from "./EdgeAdder"
import { NodeAdder } from "./NodeAdder"

interface props {
    graphInstance: cytoscape.Core
    nodeList: cytoscape.NodeSingular[]
    edgeList: cytoscape.EdgeSingular[]
}

export function GraphConfig({graphInstance, nodeList, edgeList}:props) {
    function addNode(node: cytoscape.NodeDataDefinition){
        graphInstance.add({group: 'nodes', data:{id: nodeList.length.toString()}, ...node})
    }
    function addEdge(edge: cytoscape.EdgeDataDefinition){
        graphInstance.add({group: 'edges', data: edge})
    }
    function startConversion(){
        graphInstance.emit("start-conversion")
    }
    return (
    <div style={{display: 'grid'}}>
        <div><NodeAdder addNode={addNode}/></div>
        <div><EdgeAdder nodeList={nodeList} edgeList={edgeList} addEdge={addEdge}/></div>
        <Button onClick={startConversion}>Start</Button>
    </div>)
}
