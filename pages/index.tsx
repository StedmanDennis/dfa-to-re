import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Canvas } from '../components/Canvas/Canvas'
import { GraphConfig } from '../components/GraphConfig/GraphConfig'
import { ReductionController } from '../components/ReductionController/ReductionController'
import { testData3 } from '../constants/testData'
import { createGraphInstance } from '../DFAtoRE'
import styles from '../styles/pages/home.module.css'

const graphInstance = createGraphInstance(testData3)

const Home: NextPage = () => {
  const [nodeList, setNodeList] = useState(graphInstance.nodes('*').toArray())
  const [edgeList, setEdgeList] = useState(graphInstance.edges('*').toArray())
  
  useEffect(()=>{
    graphInstance.on('add remove', function({cy}){
      setNodeList([...cy.nodes('*').toArray()])
      setEdgeList([...cy.edges('*').toArray()])
    })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Canvas graphInstance={graphInstance}/>
      {graphInstance.data().started ? <ReductionController graphInstance={graphInstance}/> : <GraphConfig graphInstance={graphInstance} nodeList={nodeList} edgeList={edgeList}/>} 
    </div>
  )
}

export default Home
