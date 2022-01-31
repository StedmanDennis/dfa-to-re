interface props {
    graphInstance: cytoscape.Core
}

export function ReductionWatcher({graphInstance}: props){
    return (
        <div>
            <div onClick={()=>{graphInstance.emit("reduce")}}>Reduce</div>
            <div onClick={()=>{graphInstance.emit("reset")}}>Cancel</div>
        </div>
    )
}