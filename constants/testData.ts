interface TestData {
    nodes: cytoscape.NodeDefinition[]
    edges: cytoscape.EdgeDefinition[]
  }
  
export const testData1: TestData = {
    nodes: [
        {data:{id:'q0', final: false, start: true}},
        {data:{id:'q1', final: true, start: false}},
        {data:{id:'q2', final: true, start: false}}
    ],
    edges: [
        {data:{source: "q0", target: "q1", expression:"a"}},
        {data:{source: "q1", target: "q0", expression:"a"}},
        {data:{source: "q0", target: "q2", expression:"b"}},
        {data:{source: "q2", target: "q0", expression:"b"}},
        {data:{source: "q1", target: "q1", expression:"b"}},
        {data:{source: "q2", target: "q1", expression:"a"}}
    ]
  }
export const testData2: TestData = {
    nodes: [
        {data:{id:'q0', final: true, start: true}},
        {data:{id:'q1', final: false, start: false}},
        {data:{id:'q2', final: false, start: false}},
        {data:{id:'q3', final: false, start: false}}
    ],
    edges: [
        {data:{source: "q0", target: "q1", expression:"a"}},
        {data:{source: "q0", target: "q3", expression:"b"}},
        {data:{source: "q1", target: "q0", expression:"a"}},
        {data:{source: "q1", target: "q2", expression:"b"}},
        {data:{source: "q2", target: "q3", expression:"a"}},
        {data:{source: "q2", target: "q1", expression:"b"}},
        {data:{source: "q3", target: "q0", expression:"b"}},
        {data:{source: "q3", target: "q2", expression:"a"}},
    ]
  }
export const testData3: TestData = {
    nodes: [
        {data:{id:'q0', final: false, start: true}},
        {data:{id:'q1', final: false, start: false}},
        {data:{id:'q2', final: false, start: false}},
        {data:{id:'q3', final: false, start: false}},
        {data:{id:'q4', final: false, start: false}},
        {data:{id:'q5', final: true, start: false}},
        {data:{id:'q6', final: true, start: false}},
    ],
    edges: [
        {data:{source: "q0", target: "q1", expression:"0"}},
        {data:{source: "q0", target: "q2", expression:"1"}},
        {data:{source: "q1", target: "q3", expression:"0"}},
        {data:{source: "q1", target: "q4", expression:"1"}},
        {data:{source: "q2", target: "q5", expression:"0"}},
        {data:{source: "q2", target: "q6", expression:"1"}},
        {data:{source: "q3", target: "q3", expression:"0"}},
        {data:{source: "q3", target: "q4", expression:"1"}},
        {data:{source: "q4", target: "q5", expression:"0"}},
        {data:{source: "q4", target: "q6", expression:"1"}},
        {data:{source: "q5", target: "q3", expression:"0"}},
        {data:{source: "q5", target: "q4", expression:"1"}},
        {data:{source: "q6", target: "q6", expression:"0+1"}}
    ]
  }
  