import './App.css';
import TreeComponent from './components/TreeComponent';
import CheckboxChunks from './components/CheckboxChunks';
import ModulesList from './components/ModulesList';
import react, {useState, useEffect} from 'react';
import {Graph} from '../lib/backtrack-imports-code';
import WorkerBuilder from "./worker/worker-builder";
import TreeObjWorker from "./worker/treeObj.worker";
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

const workerInstance = new WorkerBuilder(TreeObjWorker);

function App() {

    //const workerInstance = new WorkerBuilder(TreeObjWorker);

    const [active, setActive] = useState({
        module : "",
        chunks : allChunksArr,
    })

    //let roots = graph.generateAllRootsNestedTreeObj();

    const handleChunksChange = function(activeChunksList){
        //console.log(activeChunksList);
        setActive(prevActive => ({
          ...prevActive,
          chunks: activeChunksList,
        }));
    }
    const handleModulesChange = function(filepath){
        //console.log(filepath);
        setActive(prevActive => ({
          ...prevActive,
          module: filepath,
        }));
    }

    const [allPathsTreeObj, setAllPathsTreeObj] = useState({});
    const [circularDependency, setCircularDependency] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    workerInstance.onmessage = (message) => {
      if (message) {
        //console.log("Message from worker", message.data);
        setAllPathsTreeObj(message.data);
      }
      setIsLoading(false);
      //workerInstance.terminate();
    };

    useEffect(()=>{
      const setGraphObj = async () => {
        let allPaths = graph.findAllPaths(active.module, active.chunks);
        if(typeof(allPaths) === 'undefined'){
          setCircularDependency(false);
          setAllPathsTreeObj(null);
        }
        else if(typeof(allPaths) === 'string') {
          setCircularDependency(true);
          setAllPathsTreeObj({});
        } else {
          setIsLoading(true);
          setCircularDependency(false);
          workerInstance.postMessage([allPaths]);
          // let updatedAllPathsTreeObj = graph.generateAllPathsTreeObj(allPaths);
          // setAllPathsTreeObj(updatedAllPathsTreeObj);
        }
      }
      setGraphObj();
    },[active])


    return (
        <react.Fragment>
            <div className='ListContainer'>
                <CheckboxChunks allChunksArr={allChunksArr} handleChunksChange={handleChunksChange}/>
                <ModulesList allNodes={graph.allNodes} fuse={fuse} handleModulesChange={handleModulesChange}/>
            </div>
            <div className='moduleGraphContainer'>
                {
                  isLoading &&
                  <div className='Message loading-message'>
                    <p>Loading...</p>
                  </div>
                }
                {
                  !isLoading && allPathsTreeObj && Object.keys(allPathsTreeObj).length !== 0 && !circularDependency &&
                    <div className='graphContainer'>
                      <div className='graphContainerLabel'>
                        <p>Backtrack imports from module : <code>{allPathsTreeObj.name}</code></p>
                      </div>
                      <TreeComponent data = {allPathsTreeObj} />
                    </div>
                } 
                {  
                  !isLoading && circularDependency && 
                  <div className='Message error-message'>
                    <p>Encountered circular dependency in the backtrack path of the selected module.</p>
                  </div>
                }
                {
                  !isLoading && allPathsTreeObj && Object.keys(allPathsTreeObj).length === 0 && !circularDependency &&
                  <div className='Message message'>
                    <p>Empty backtrack path of the selected module for the selected chunks.</p>
                  </div>
                }
                {
                  !isLoading && !allPathsTreeObj && !circularDependency &&
                  <div className='Message empty-message'>
                    <p>Module is not selected or Empty Chunk-List</p>
                  </div>
                }
            </div>
        </react.Fragment>
    );
}

export default App;
