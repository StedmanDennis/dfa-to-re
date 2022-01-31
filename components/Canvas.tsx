import { useEffect, useRef } from "react"
import cytoscape from "cytoscape"

interface TestData {
    nodes: cytoscape.NodeDefinition[]
    edges: cytoscape.EdgeDefinition[]
}

interface props {
    graphInstance: cytoscape.Core
}

export function Canvas({graphInstance}: props) {
    const canvasRef = useRef<HTMLDivElement>(null)
    
    useEffect(()=>{
        if (canvasRef.current) {
            console.log('mounted')
            graphInstance.mount(canvasRef.current)
        }
    }, [canvasRef.current])
    return (
        <div id="canvas" ref={canvasRef} style={{height: "100%", width: "100%"}}></div>
    )
}