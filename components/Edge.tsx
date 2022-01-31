interface props {
    edge: cytoscape.EdgeSingular
}

export function Edge({edge}: props){
    return(
        <div>
            <span>{`${edge.source().id()}->${edge.target().id()}`}</span>
        </div>
    )
}