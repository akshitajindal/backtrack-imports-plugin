import './App.css';
import CheckboxChunks from './components/CheckboxChunks';
import ModulesList from './components/ModulesList';
import GraphContainer from './components/GraphContainer';
import react, { useState, useEffect } from 'react';
import { Graph } from '../lib/backtrack-imports-code';
import WorkerBuilder from "./worker/worker-builder";
import TreeObjWorker from "./worker/treeObj.worker";
import Fuse from 'fuse.js';

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

    const [active, setActive] = useState({
        module: "",
        chunks: allChunksArr,
    })
    const [circularDependencyArr, setCircularDependencyArr] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allPathsArrOfObj, setAllPathsArrOfObj] = useState([]);
    const [allPaths, setAllPaths] = useState([]);

    const handleChunksChange = function (activeChunksList) {
        setActive(prevActive => ({
            ...prevActive,
            chunks: activeChunksList,
        }));
    }
    const handleModulesChange = function (filepath) {
        setActive(prevActive => ({
            ...prevActive,
            module: filepath,
        }));
    }

    const handleNodeOnClick = function (nodeData) {
        let pathToNode = []
        let currNode = nodeData;
        while (currNode.parentIndex !== null) {
            pathToNode.push(currNode.parentIndex);
            currNode = currNode.parentRef;
        }
        pathToNode.reverse();
        workerInstance.postMessage([nodeData.name, nodeData.__rd3t.depth, allPathsArrOfObj, allPaths, pathToNode]);
    }

    workerInstance.onmessage = (message) => {
        if (message) {
            let updatedAllPathsArrOfObj = message.data[0];
            setAllPathsArrOfObj(updatedAllPathsArrOfObj);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const setGraphObj = async () => {
            let updatedAllPaths = graph.findAllPaths(active.module, active.chunks);
            if (typeof (updatedAllPaths) === 'undefined') {
                setAllPathsArrOfObj(null);
                setCircularDependencyArr([]);
                setAllPaths([]);
            }
            else if (updatedAllPaths.msg) {
                setCircularDependencyArr(updatedAllPaths.arr);
                setAllPathsArrOfObj([]);
                setAllPaths([]);
            } else {
                setIsLoading(true);
                setAllPaths(updatedAllPaths);
                setCircularDependencyArr([]);
                workerInstance.postMessage([active.module, 0, [], updatedAllPaths, []]);
            }
        }
        setGraphObj();
    }, [active])


    return (
        <react.Fragment>
            <div className='ListContainer'>
                <CheckboxChunks allChunksArr={allChunksArr} handleChunksChange={handleChunksChange} />
                <ModulesList allNodes={graph.allNodes} fuse={fuse} handleModulesChange={handleModulesChange} />
            </div>
            <div className='moduleGraphContainer'>
                <GraphContainer isLoading={isLoading} allPathsArrOfObj={allPathsArrOfObj} circularDependencyArr={circularDependencyArr} handleNodeOnClick={handleNodeOnClick} />
            </div>
        </react.Fragment>
    );
}

export default App;