interface TestData {
    nodes: cytoscape.NodeDefinition[]
    edges: cytoscape.EdgeDefinition[]
  }
  
export const testData1: TestData = {
    nodes: [
        {data:{id:'0', final: false, start: true}},
        {data:{id:'1', final: true, start: false}},
        {data:{id:'2', final: true, start: false}}
    ],
    edges: [
        {data:{source: "0", target: "1", expression:"a"}},
        {data:{source: "1", target: "0", expression:"a"}},
        {data:{source: "0", target: "2", expression:"b"}},
        {data:{source: "2", target: "0", expression:"b"}},
        {data:{source: "1", target: "1", expression:"b"}},
        {data:{source: "2", target: "1", expression:"a"}}
    ]
  }
export const testData2: TestData = {
    nodes: [
        {data:{id:'0', final: true, start: true}},
        {data:{id:'1', final: false, start: false}},
        {data:{id:'2', final: false, start: false}},
        {data:{id:'3', final: false, start: false}}
    ],
    edges: [
        {data:{source: "0", target: "1", expression:"a"}},
        {data:{source: "0", target: "3", expression:"b"}},
        {data:{source: "1", target: "0", expression:"a"}},
        {data:{source: "1", target: "2", expression:"b"}},
        {data:{source: "2", target: "3", expression:"a"}},
        {data:{source: "2", target: "1", expression:"b"}},
        {data:{source: "3", target: "0", expression:"b"}},
        {data:{source: "3", target: "2", expression:"a"}},
    ]
  }
export const testData3: TestData = {
    nodes: [
        {data:{id:'0', final: false, start: true}},
        {data:{id:'1', final: false, start: false}},
        {data:{id:'2', final: false, start: false}},
        {data:{id:'3', final: false, start: false}},
        {data:{id:'4', final: false, start: false}},
        {data:{id:'5', final: true, start: false}},
        {data:{id:'6', final: true, start: false}},
    ],
    edges: [
        {data:{source: "0", target: "1", expression:"0"}},
        {data:{source: "0", target: "2", expression:"1"}},
        {data:{source: "1", target: "3", expression:"0"}},
        {data:{source: "1", target: "4", expression:"1"}},
        {data:{source: "2", target: "5", expression:"0"}},
        {data:{source: "2", target: "6", expression:"1"}},
        {data:{source: "3", target: "3", expression:"0"}},
        {data:{source: "3", target: "4", expression:"1"}},
        {data:{source: "4", target: "5", expression:"0"}},
        {data:{source: "4", target: "6", expression:"1"}},
        {data:{source: "5", target: "3", expression:"0"}},
        {data:{source: "5", target: "4", expression:"1"}},
        {data:{source: "6", target: "6", expression:"0+1"}}
    ]
  }
  