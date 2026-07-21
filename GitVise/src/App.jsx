import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { gitCommand } from './components/gitCommands'; 

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
 
export default function App() {

  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState(" ");

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [stage, setStage] = useState(false);

  const checkEnterKey = (event) => {
    if (event.key === 'Enter') {
      const textWords = text.split(' ')
      if (textWords[0] !== "git") {
        setErrorMsg("Invalid command")
      } else {
        submitGitQuery(textWords.slice(1));
        event.preventDefault();
      }
      setText("");
    };
  };

  function submitGitQuery(query) {
    const queryFunction = gitCommand[query[0]]
    if (!queryFunction) {
      setErrorMsg("Invalid command or not supported yet")
    }
    const queryStatus = queryFunction(query.slice(1), stage)
    console.log("queries sent")
    if (queryStatus.valid) {
      console.log("queries VALID")
      if (queryStatus["treePopulated"]) {
        setStage(true);
        console.log("stage set")
      } else if (queryStatus["hashValue"]) {
        createNode(queryStatus.hashValue)
        console.log("hash value returned")
      }
    } else {
      console.log("queries INVALID")
      setErrorMsg(queryStatus["error"])
    }
  };

  function createNode(value) {
    let updateNodes = [...nodes];
    updateNodes.push({ id: `n${updateNodes.length + 1}`, position: { x: 0, y: (updateNodes.length) * 100 }, data: { label: value }});
    let updateEdges = [...edges];
    updateEdges.push({ id: value, source: `n${updateEdges.length + 1}`, target: `n${updateEdges.length + 2}` });
    setNodes(updateNodes);
    setEdges(updateEdges);
  }
  
 
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
 
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', 
    }}>
      <div style={{ padding: '12px' }}>
        <input 
          type='text' 
          id='git-query' 
          placeholder='Enter git command'
          value={text} 
          onChange={((e) => setText(e.target.value))}
          onKeyDown={(checkEnterKey)}
          required
          style={{
            padding: '12px',
            fontSize: '15px',
            border: '1px solid #6b6b6b',
            borderRadius: '8px',
            outline: 'none',
        }}>
        </input>
      </div>
      <p>{errorMsg}</p>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}