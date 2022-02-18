import { Button } from "@mui/material"
import cytoscape from "cytoscape"
import { useState } from "react"
import { EdgeConfig } from "../EdgeConfig/EdgeConfig"
import { NodeConfig } from "../NodeConfig/NodeConfig"

enum Mode {
    Node,
    Edge
}

interface props {
    graphInstance: cytoscape.Core
    nodeList: cytoscape.NodeSingular[]
    edgeList: cytoscape.EdgeSingular[]
}

export function GraphConfig({graphInstance, nodeList, edgeList}: props) {
    const [mode, setMode] = useState<Mode>(Mode.Node)
    function addNode(node: cytoscape.NodeDataDefinition){
        graphInstance.add({group: 'nodes', data:{id: nodeList.length.toString()}, ...node})
    }
    function addEdge(edge: cytoscape.EdgeDataDefinition){
        graphInstance.add({group: 'edges', data: edge})
    }
    function startConversion(){
        graphInstance.emit("evaluate")
    }
    function cycleMode(){
        setMode((mode + 1) % 2)
    }
    const config = mode === Mode.Node ? <NodeConfig nodeList={nodeList} addNode={addNode}/> : <EdgeConfig nodeList={nodeList} edgeList={edgeList} addEdge={addEdge}/>
    return (
    <div style={{display: 'grid', gridTemplateRows: "auto 1fr auto"}}>
        <div onClick={cycleMode}>{mode ? "Edge" : "Node"}</div>
        {config}
        <Button onClick={startConversion} >Start</Button>
    </div>)
}
