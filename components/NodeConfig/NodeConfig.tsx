import { NodeAdder } from "../NodeAdder/NodeAdder";
import { NodeList } from "../NodeList/NodeList";

interface props {
    nodeList: cytoscape.NodeSingular[]
    addNode: (node: cytoscape.NodeDataDefinition) => void 
}

export function NodeConfig({nodeList, addNode}: props){
    return (
        <div style={{display: 'grid', gridTemplateRows: '1fr auto'}}>
            <NodeList nodeList={nodeList}></NodeList>
            <NodeAdder addNode={addNode}></NodeAdder>
        </div>
    )
}