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
    const [allPathsTreeObj, setAllPathsTreeObj] = useState({});
    const [circularDependency, setCircularDependency] = useState(false);
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
        if (!nodeData.children) {
            workerInstance.postMessage([nodeData.name, allPaths, nodeData.id, nodeData.__rd3t.depth, allPathsArrOfObj]);
        }
    }

    workerInstance.onmessage = (message) => {
        if (message) {
            let updatedAllPathsArrOfObj = message.data[0];
            setAllPathsArrOfObj(updatedAllPathsArrOfObj);
            let depth = message.data[1];
            if (depth === 0) {
                if (updatedAllPathsArrOfObj.length > 0)
                    setAllPathsTreeObj({ ...updatedAllPathsArrOfObj[0] });
                else
                    setAllPathsTreeObj({});
            } else {
                if (updatedAllPathsArrOfObj.length > 0)
                    setAllPathsTreeObj({ ...updatedAllPathsArrOfObj[0] });
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const setGraphObj = async () => {
            let updatedAllPaths = graph.findAllPaths(active.module, active.chunks);
            if (typeof (updatedAllPaths) === 'undefined') {
                setCircularDependency(false);
                setAllPathsTreeObj(null);
                setAllPathsArrOfObj(null);
                setCircularDependencyArr(null);
                setAllPaths([]);
            }
            else if (updatedAllPaths.msg) {
                setCircularDependency(true);
                setCircularDependencyArr(updatedAllPaths.arr);
                setAllPathsTreeObj({});
                setAllPathsArrOfObj([]);
                setAllPaths([]);
            } else {
                setIsLoading(true);
                setAllPaths(updatedAllPaths);
                setCircularDependency(false);
                setCircularDependencyArr([]);
                workerInstance.postMessage([active.module, updatedAllPaths, null, 0, allPathsArrOfObj]);
            }
        }
        setGraphObj();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])


    return (
        <react.Fragment>
            <div className='ListContainer'>
                <CheckboxChunks allChunksArr={allChunksArr} handleChunksChange={handleChunksChange} />
                <ModulesList allNodes={graph.allNodes} fuse={fuse} handleModulesChange={handleModulesChange} />
            </div>
            <div className='moduleGraphContainer'>
                <GraphContainer isLoading={isLoading} allPathsTreeObj={allPathsTreeObj} circularDependency={circularDependency} circularDependencyArr={circularDependencyArr} handleNodeOnClick={handleNodeOnClick} />
            </div>
        </react.Fragment>
    );
}

export default App;