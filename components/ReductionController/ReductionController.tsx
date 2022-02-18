import cytoscape from "cytoscape"

interface props {
    graphInstance: cytoscape.Core
}

export function ReductionController({graphInstance}: props){
    const currentStep = graphInstance.data().currentStep
    const steps = graphInstance.data().reductionSummaries.length
    function nextStep(){
        graphInstance.emit("stepTo", [currentStep + 1])
    }
    function previousStep(){
        graphInstance.emit("stepTo", [currentStep - 1])
    }
    function cancel(){
        graphInstance.emit("reset")
    }
    return (
        <div>
            <div>{currentStep}/{steps}</div>
            <div onClick={nextStep}>Reduce Forward</div>
            <div onClick={previousStep}>Reduce Backward</div>
            <div onClick={cancel}>Cancel</div>
        </div>
    )
}