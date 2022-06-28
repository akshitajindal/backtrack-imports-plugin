import './App.css';
import CheckboxChunks from './components/CheckboxChunks';
import ModulesList from './components/ModulesList';
import GraphContainer from './components/GraphContainer';
import react, {useState, useEffect} from 'react';
import {Graph} from '../lib/backtrack-imports-code';
// import WorkerBuilder from "./worker/worker-builder";
// import TreeObjWorker from "./worker/treeObj.worker";
const Fuse = require('fuse.js')

const graph = new Graph();
graph.setGraphObj();

let allChunksArr = [];
graph.allChunks.forEach((value, key) => {
  value.forEach(val => {
    allChunksArr.push(val);
  })
})

const fuse = new Fuse(graph.allNodes, {
    keys: ['label']
})

//const workerInstance = new WorkerBuilder(TreeObjWorker);

function App() {

    //const workerInstance = new WorkerBuilder(TreeObjWorker);

    const [active, setActive] = useState({
        module : "",
        chunks : allChunksArr,
    })
    const [allPathsTreeObj, setAllPathsTreeObj] = useState({});
    const [circularDependency, setCircularDependency] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allPathsArrOfObj, setAllPathsArrOfObj] = useState([]);

    //let roots = graph.generateAllRootsNestedTreeObj();

    const handleChunksChange = function(activeChunksList){
        setActive(prevActive => ({
          ...prevActive,
          chunks: activeChunksList,
        }));
    }
    const handleModulesChange = function(filepath){
        setActive(prevActive => ({
          ...prevActive,
          module: filepath,
        }));
    }

    const handleNodeOnClick = function (nodeData) {
      if(!nodeData.children) {
        let updatedAllPathsArrOfObj = graph.generateAllPathsTreeObj(nodeData.name, nodeData.id, nodeData.__rd3t.depth, allPathsArrOfObj);
        if(updatedAllPathsArrOfObj.length>0)
          setAllPathsTreeObj({...updatedAllPathsArrOfObj[0]});
      }
    }

    // workerInstance.onmessage = (message) => {
    //   if (message) {
    //     //console.log("Message from worker", message.data);
    //     setAllPathsTreeObj(message.data);
    //   }
    //   setIsLoading(false);
    //   workerInstance.terminate();
    // };

    useEffect(()=>{
      const setGraphObj = async () => {
        let allPaths = graph.findAllPaths(active.module, active.chunks);
        if(typeof(allPaths) === 'undefined'){
          setCircularDependency(false);
          setAllPathsTreeObj(null);
          setAllPathsArrOfObj(null);
        }
        else if(typeof(allPaths) === 'string') {
          setCircularDependency(true);
          setAllPathsTreeObj({});
          setAllPathsArrOfObj([]);
        } else {
          //setIsLoading(true);
          setCircularDependency(false);
          //workerInstance.postMessage([allPaths]);
          let updatedAllPathsArrOfObj = graph.generateAllPathsTreeObj(active.module, null, 0, allPathsArrOfObj);
          setAllPathsArrOfObj(updatedAllPathsArrOfObj);
          if(updatedAllPathsArrOfObj.length>0)
            setAllPathsTreeObj({...updatedAllPathsArrOfObj[0]});
          else
            setAllPathsTreeObj({});
        }
      }
      setGraphObj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[active])


    return (
        <react.Fragment>
            <div className='ListContainer'>
                <CheckboxChunks allChunksArr={allChunksArr} handleChunksChange={handleChunksChange}/>
                <ModulesList allNodes={graph.allNodes} fuse={fuse} handleModulesChange={handleModulesChange}/>
            </div>
            <div className='moduleGraphContainer'>
                <GraphContainer isLoading={isLoading} allPathsTreeObj={allPathsTreeObj} circularDependency={circularDependency} handleNodeOnClick={handleNodeOnClick}/>
            </div>
        </react.Fragment>
    );
}

export default App;