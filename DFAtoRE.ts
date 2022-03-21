import cytoscape, { EdgeCollection, EdgeDefinition, EdgeSingular, NodeSingular } from "cytoscape"
import { CytoscapeOptions, ElementsDefinition } from "cytoscape"

interface ReductionSummary {
    node: NodeSingular
    edges: EdgeCollection
}

const baseOptions: CytoscapeOptions = {
    data:{
        lambda: '\u03BB',
        epsilon: '\u03B5',
        started: false,
        target: null,
        currentStep: null,
        reductionSummaries: null
      },
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(id)',
            'text-valign': 'bottom'
          }
        },
        {
          selector: 'node[?start]',
          style: {
            'background-color': 'green'
          }
        },
        {
          selector: 'node[?final]',
          style: {
            'background-color': 'red'
          }
        },
        {
          selector: 'node[?start][?final]',
          style: {
            'background-color': 'yellow'
          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'loop-direction': '0',
            'loop-sweep': '150',
            'label': 'data(expression)'
          }
        }
      ],
}

export function createGraphInstance(elements?: ElementsDefinition){
    const options = baseOptions
    options.elements = elements
    const graphInstance = cytoscape(options)
  
      graphInstance.on('evaluate', function({cy}){
        function bracketExpression(expression: string){
          /*
          taken from
          https://github.com/citiususc/jflap-lib/blob/master/jflaplib-core/src/main/java/edu/duke/cs/jflap/regular/Discretizer.java
          or function
          */
          let start = 0;
          let level = 0;
          const subExpressions = []
          for (let i = 0; i < expression.length; i++) {
            if (expression[i] == '(')
              level++;
            if (expression[i] == ')')
              level--;
            if (expression[i] != '+')
              continue;
            if (level != 0)
              continue;
            // First level or!
            subExpressions.push(expression.substring(start, i));
            start = i + 1;
          }
          subExpressions.push(expression.substring(start)); 
          return subExpressions.length > 1 ? `(${expression})` : expression
        }
        function determineRemovalTarget(){
          const minId = cy.nodes('[id = "start"]')[0].outgoers().nodes().min((node)=>{
            return parseInt(node.data("id"))
          })
          return minId.ele
        }
        function evaluateRemovalTarget(removalTarget: NodeSingular){
          console.log(`id: ${removalTarget.id()}`)
          cy.data("target", removalTarget)
          const emptyRepresentation = cy.data().lambda
          const targetId = removalTarget.id()
          const removalTargetIncomingEdges = removalTarget.incomers().edges()
          const removalTargetOutgoingEdges = removalTarget.outgoers().edges()
          
          const {left, right, both} = removalTargetIncomingEdges.diff(removalTargetOutgoingEdges)
          const incomingEdges = left.edges()
          const outgoingEdges = right.edges()
          const loopEdge = both.edges()[0]
          //assuming loop edge expressions are never empty strings
          let loopExpression = loopEdge ? loopEdge.data().expression : ''
          console.log(`loop: ${loopExpression ? loopExpression : "none"}`)
          loopExpression = loopExpression ? loopExpression.length > 1 ? `(${loopExpression})*` : `${loopExpression}*` : loopExpression
  
          console.log(incomingEdges.edges().map((edge)=>`${edge.source().id()} -> ${edge.target().id()}`))
          console.log(outgoingEdges.edges().map((edge)=>`${edge.source().id()} -> ${edge.target().id()}`))
  
          const newEdges: EdgeDefinition[] = []
          const oldEdges: EdgeSingular[] = []
  
          incomingEdges.forEach((incomingEdge)=>{
            outgoingEdges.forEach((outgoingEdge)=>{
              const incomingSourceId = incomingEdge.source().id()
              const incomingExpression = incomingEdge.data().expression
  
              const outgoingTargetId = outgoingEdge.target().id()
              const outgoingExpression = outgoingEdge.data().expression
  
              const currentPath = `${incomingSourceId} -> ${targetId} -> ${outgoingTargetId}`
              const currentExpression = `${bracketExpression(incomingExpression)}${loopExpression}${bracketExpression(outgoingExpression)}`
  
              const existingReducedEdge = cy.edges(`[source = '${incomingSourceId}'][target = '${outgoingTargetId}']`)[0]
              const hasExistingReducedEdge = !!existingReducedEdge
              let existingReducedEdgeExpression = hasExistingReducedEdge ? existingReducedEdge.data().expression : ''
              existingReducedEdgeExpression = hasExistingReducedEdge && (existingReducedEdgeExpression || emptyRepresentation)
  
              hasExistingReducedEdge && oldEdges.push(existingReducedEdge)
  
              const reducedPath = `${incomingSourceId} -> ${outgoingTargetId}`
              const reducedExpression = existingReducedEdgeExpression ? `${existingReducedEdgeExpression}+${currentExpression}` : `${currentExpression}`
  
              console.log(`${currentPath} | ${currentExpression}`)
              console.log(`${reducedPath} | ${reducedExpression}`)
  
              const newEdge: EdgeDefinition = {data:{source: incomingSourceId, target: outgoingTargetId, expression:reducedExpression}}
              newEdges.push(newEdge)
            })
          })
  
          cy.remove(removalTarget.union(oldEdges))
          cy.add(newEdges)
  
          const reductionSummary: ReductionSummary = {
            node: removalTarget,
            edges: cy.edges()
          }
  
          return reductionSummary
        }
        //
        console.log("started")
        cy.data("started", true)
        cy.data("initial-graph", cy.elements().copy())
        const startNodes = cy.nodes('[?start]')
        const endNodes = cy.nodes('[?final]')
        cy.add({group: 'nodes', data:{id: 'start', start: true, final: false}})
        cy.add({group: 'nodes', data:{id: 'final', start: false, final: true}})
        startNodes.forEach((node)=>{  
          cy.add({group: 'edges', data: {source: 'start', target: node.id(), expression: ''}})
          node.data().start = false
        })
        endNodes.forEach((node)=>{  
          cy.add({group: 'edges', data: {source: node.id(), target: 'final', expression: ''}})
          node.data().final = false
        })
        cy.data("starting-graph", cy.elements().copy())
        
        const reductionSummaries: ReductionSummary[] = []
        let targetNode = determineRemovalTarget()
  
        while (targetNode) {
          const summary: ReductionSummary = evaluateRemovalTarget(targetNode)
          reductionSummaries.push(summary)
          targetNode = determineRemovalTarget()
        }
        cy.data('reductionSummaries', reductionSummaries)
        cy.emit("stepTo", [0])
      })
  
      graphInstance.on('stepTo', function({cy}, targetStep: number){
        const reductionSummaries: ReductionSummary[] = cy.data('reductionSummaries')
        const minStep = 0
        const maxStep = reductionSummaries.length
        if (targetStep < minStep || targetStep > maxStep) return
        const stepSummaries = reductionSummaries.slice(0,targetStep)
        const newGraph = cy.data("starting-graph")
        cy.elements().remove()
        cy.add(newGraph)
        if (stepSummaries.length) {
          cy.remove(cy.edges())
          const edgesToAdd = stepSummaries.at(-1)!.edges   
          cy.remove(stepSummaries.map(({node}) => `[id="${node.id()}"]`).join(","))// nodes to remove
          cy.add(edgesToAdd)
        }
  
        cy.data("currentStep", targetStep)
        console.log(cy.data("currentStep"))
      })
  
      graphInstance.on('reset', function({cy}){
        cy.remove(cy.elements())
        cy.add(cy.data('initial-graph'))
        cy.data('started', false)
      })

    return graphInstance
}