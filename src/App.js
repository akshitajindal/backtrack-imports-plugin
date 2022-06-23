import './App.css';
import TreeComponent from './components/TreeComponent';
import CheckboxChunks from './components/CheckboxChunks';
import ModulesList from './components/ModulesList';
import react, {useState,useEffect} from 'react';
import {Graph} from '../lib/backtrack-imports-code';
const Fuse = require('fuse.js')

const graph = new Graph();
console.time(graph.setGraphObj);
graph.setGraphObj();
console.timeEnd(graph.setGraphObj);

let allChunksArr = [];
graph.allChunks.forEach((value, key) => {
  value.forEach(val => {
    allChunksArr.push(val);
  })
})

const fuse = new Fuse(graph.allNodes, {
    keys: ['label']
})

function App() {

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

    useEffect(()=>{
      console.time(graph.findAllPaths);
      let allPaths = graph.findAllPaths(active.module, active.chunks);
      //console.log(allPaths);
      console.timeEnd(graph.findAllPaths);
      if(typeof(allPaths) === 'string') {
        setCircularDependency(true);
        setAllPathsTreeObj({});
      } else {
        setCircularDependency(false);
        console.time(graph.generateAllPathsTreeObj);
        let updatedAllPathsTreeObj = graph.generateAllPathsTreeObj(allPaths);
        console.timeEnd(graph.generateAllPathsTreeObj);
        setAllPathsTreeObj(updatedAllPathsTreeObj);
      }
    },[active])

    return (
        <react.Fragment>
            <div className='ListContainer'>
                <CheckboxChunks allChunksArr={allChunksArr} handleChunksChange={handleChunksChange}/>
                <ModulesList allNodes={graph.allNodes} fuse={fuse} handleModulesChange={handleModulesChange}/>
            </div>
            <div className='moduleGraphContainer'>
                {
                  Object.keys(allPathsTreeObj).length !== 0 && !circularDependency &&
                    <div className='graphContainer'>
                      <div className='graphContainerLabel'>
                        <p>Backtrack imports from module : <code>{active.module}</code></p>
                      </div>
                      <TreeComponent data = {allPathsTreeObj} />
                    </div>
                } 
                {  
                  circularDependency && 
                  <div className='error-message'>
                    <p>Encountered circular dependency in the backtrack path of the selected module.</p>
                  </div>
                }
                {
                  Object.keys(allPathsTreeObj).length === 0 && !circularDependency &&
                  <div className='message'>
                    <p>Empty backtrack path of the selected module for the selected chunks.</p>
                  </div>
                }
            </div>
        </react.Fragment>
    );
}

export default App;
