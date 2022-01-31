import { Autocomplete, Button, TextField } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"

interface props {
    edgeList: cytoscape.EdgeSingular[]
    nodeList: cytoscape.NodeSingular[] 
    addEdge: (edge: cytoscape.EdgeDataDefinition) => void
}

export function EdgeAdder({edgeList, nodeList, addEdge}:props) {
    const [source, setSource] = useState('')
    const [target, setTarget] = useState('')
    const [expression, setExpression] = useState('')
    const [isValid, setIsValid] = useState(false)
    const nodes = nodeList.map((node)=>node.id())
    useEffect(()=>{
        setIsValid(!!source && !!target)    
    }, [source, target])
    function isEdgeAddable(){
        return isValid && !edgeList.some((edge)=>(edge.source().id() === source && edge.target().id() === target))
    }
    function add(){
        addEdge({source, target, expression})
        setSource('')
        setTarget('')
        setExpression('')
    }
    function changeSource(e: React.SyntheticEvent, value: string | null){
        setSource(value!)
    }
    function changeTarget(e: React.SyntheticEvent, value: string | null){
        setTarget(value!)
    }
    function changeExpression({target:{value}}:ChangeEvent<HTMLInputElement>){
        setExpression(value)
    }
    return (
        <div>
            <Autocomplete renderInput={(params) => <TextField {...params} label="Source" />} options={nodes} value={source} onChange={changeSource}/>
            <Autocomplete renderInput={(params) => <TextField {...params} label="Target" />} options={nodes} value={target} onChange={changeTarget}/>
            <TextField label="Expression" value={expression} onChange={changeExpression}/>
            <Button disabled={!isEdgeAddable()} onClick={add}>Add Edge</Button>
        </div>
    )
}