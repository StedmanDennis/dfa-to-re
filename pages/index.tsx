import cytoscape from 'cytoscape'
import type { NextPage } from 'next'
import Head from 'next/head'
import {  useEffect, useState } from 'react'
import { Canvas } from '../components/Canvas'
import { GraphConfig } from '../components/GraphConfig'
import { ReductionWatcher } from '../components/ReductionWatcher'
import { testData3 } from '../constants/testData'
import styles from '../styles/pages/home.module.css'

const {nodes, edges} = testData3

const graphInstance = cytoscape({
  data:{
    lambda: '\u03BB',
    epsilon: '\u03B5',
    started: false,
    target: null
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
  elements: {
    nodes,
    edges
  },
})

const Home: NextPage = () => {

  const [nodeList, setNodeList] = useState(graphInstance.nodes('*').toArray())
  const [edgeList, setEdgeList] = useState(graphInstance.edges('*').toArray())
  
  useEffect(()=>{
    graphInstance.on('add remove', function({cy}){
      setNodeList([...cy.nodes('*').toArray()])
      setEdgeList([...cy.edges('*').toArray()])
    })
    
    graphInstance.on('start-conversion', function({cy}){
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
    })

    graphInstance.on('reduce', function({cy}){
      console.log("reducing")
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
      function evaluateRemovalTarget(removalTarget: cytoscape.NodeSingular){
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
        

        const newEdges: cytoscape.EdgeDefinition[] = []
        const oldEdges: cytoscape.EdgeSingular[] = []

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

            const newEdge: cytoscape.EdgeDefinition = {data:{source: incomingSourceId, target: outgoingTargetId, expression:reducedExpression}}
            newEdges.push(newEdge)
          })
        })

        cy.remove(removalTarget.union(oldEdges))
        cy.add(newEdges)
      }
      const targetNodes = cy.nodes('[id != "final"][id != "start"]')
      const canReduce = targetNodes.length
      if (canReduce) {
        evaluateRemovalTarget(targetNodes[0])
      }
    })

    graphInstance.on('reset', function({cy}){
      cy.remove(cy.elements())
      cy.add(cy.data('initial-graph'))
      cy.data('started', false)
    })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Canvas graphInstance={graphInstance}/>
      {graphInstance.data().started ? 
      <ReductionWatcher graphInstance={graphInstance}/> : 
      <GraphConfig graphInstance={graphInstance} nodeList={nodeList} edgeList={edgeList}/>}
      
    </div>
  )
}

export default Home
