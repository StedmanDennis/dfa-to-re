interface props {
    node: cytoscape.NodeSingular
}

export function Node({node}: props){
    return(
        <div>
            <span>{`${node.id()}`}</span>
        </div>
    )
}