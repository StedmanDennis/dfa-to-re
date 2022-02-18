import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { ChangeEvent, useState } from "react";

interface props{
    addNode: (edge: cytoscape.NodeDataDefinition) => void
}

export function NodeAdder({addNode}:props) {
    const [start, setStart] = useState(false)
    const [final, setFinal] = useState(false)

    function changeStart({target: {checked}}: ChangeEvent<HTMLInputElement>){
        setStart(checked)
    }

    function changeFinal({target: {checked}}: ChangeEvent<HTMLInputElement>){
        setFinal(checked)
    }

    function add(){
        addNode({start, final})
        setStart(false)
        setFinal(false)
    }

    return(
        <div>
            <FormControlLabel label="start?" control={<Checkbox value={start} onChange={changeStart}/>}></FormControlLabel>
            <FormControlLabel label="final?" control={<Checkbox value={final} onChange={changeFinal}/>}></FormControlLabel>
            <Button onClick={add}>Add Node</Button>
        </div>
    )
}