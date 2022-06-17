import './App.css';
import TreeComponent from './components/TreeComponent';
import CheckboxChunks from './components/CheckboxChunks';
import ModulesList from './components/ModulesList';
import react, {useState,useEffect} from 'react';
import {Graph} from './lib/backtrack-imports-code';
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

    useEffect(()=>{
      let allPaths = graph.findAllPaths(active.module, active.chunks);
      // if(!allPaths || allPaths.length===0){
      //   setAllPathsTreeObj({});
      // } else {
        let updatedAllPathsTreeObj = graph.generateAllPathsTreeObj(allPaths);
        setAllPathsTreeObj(updatedAllPathsTreeObj);
        //console.log(updatedAllPathsTreeObj);
        // allPaths.forEach(path => {
        //   console.log(path);
        // })
      //}
    },[active])

    return (
        <react.Fragment>
            <div className='ListContainer'>
                <CheckboxChunks allChunksArr={allChunksArr} handleChunksChange={handleChunksChange}/>
                <ModulesList allNodes={graph.allNodes} fuse={fuse} handleModulesChange={handleModulesChange}/>
            </div>
            <div className='moduleGraphContainer'>
                {
                  Object.keys(allPathsTreeObj).length !== 0 && 
                    <div className='graphContainer'>
                      <div className='graphContainerLabel'>
                        <p>Backtrack imports from module : <code>{active.module}</code></p>
                      </div>
                      <TreeComponent data = {allPathsTreeObj} />
                    </div>
                } 
                {/* {Object.keys(roots[0]).length !== 0 && <TreeComponent data = {roots[0]} />}       */}
                {/* {
                  Object.keys(roots).length > 0 && roots.map((root) => {
                    if(Object.keys(root).length !== 0)
                      return (
                        <div className='graphContainer'>
                          <div className='graphContainerLabel'>
                            <p>Forward Imports From Root Module : <code>{root.name}</code></p>
                          </div>
                          <TreeComponent data = {root} />
                        </div>
                      )
                    else
                      return null;
                })}                  */}
            </div>
        </react.Fragment>
    );
}

export default App;
