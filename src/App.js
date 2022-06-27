import './App.css';
import TreeComponent from './components/TreeComponent';
import CheckboxChunks from './components/CheckboxChunks';
import ModulesList from './components/ModulesList';
import react, {useState, useEffect} from 'react';
import {Graph} from '../lib/backtrack-imports-code';
// import WorkerBuilder from "./worker/worker-builder";
// import TreeObjWorker from "./worker/treeObj.worker";
import { v4 as uuidv4 } from 'uuid';
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

    const handleNodeOnClick = function (nodeData) {
      //console.log(nodeData);
      if(!nodeData.children) {
        //let allPaths = graph.findAllPaths(nodeData.name, active.chunks);
        generateAllPathsTreeObj(nodeData.name, graph.allPaths, nodeData.id, nodeData.__rd3t.depth);
      }
    }

    const generateAllPathsTreeObj = function (filePath, allPaths, parent_id, depth) {
      let tempArrOfObj = allPathsArrOfObj;
      if(filePath === active.module) {
        if(!allPaths || allPaths.length===0){
            setAllPathsTreeObj({});
            return;
        }
        tempArrOfObj = [];
        let rootId = uuidv4();
        if(!parent_id){
          parent_id = rootId;
        }
        tempArrOfObj.push({id: rootId, parentId: null, name: allPaths[0][0].name, size: allPaths[0][0].size});
        setAllPathsArrOfObj(tempArrOfObj);
      }
      let setOfObj = new Set();
      for(let i=0; i<allPaths.length; i++){
        if(allPaths[i][depth+1] && allPaths[i][depth].name===filePath) {
          let path = allPaths[i][depth+1];
          if(!setOfObj.has(path.name)) {
              setOfObj.add(path.name);
              let currElemId = uuidv4();
              let element = {id: currElemId, parentId: parent_id, name: path.name, size: path.size};
              tempArrOfObj.push(element);
          }
        }
      }
      let indexOfParent = tempArrOfObj.findIndex(element => element.id === parent_id);
      tempArrOfObj.forEach(element => {
          if (element.parentId !== null) {
            if(element.parentId === parent_id) {
              if(!tempArrOfObj[indexOfParent].children)
                  tempArrOfObj[indexOfParent].children = [];
              tempArrOfObj[indexOfParent].children.push(element);
            }
          }
      })
      setAllPathsTreeObj({...tempArrOfObj[0]});
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
          //let updatedAllPathsTreeObj = generateAllPathsTreeObj(allPaths);
          //setAllPathsTreeObj(updatedAllPathsTreeObj[0]);
          //setAllPathsArrOfObj(updatedAllPathsTreeObj);
          generateAllPathsTreeObj(active.module, graph.allPaths, null, 0);
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
                      <TreeComponent data = {allPathsTreeObj} handleNodeOnClick = {handleNodeOnClick} />
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
