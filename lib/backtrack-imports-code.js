import { v4 as uuidv4 } from 'uuid';

let stats = require('./stats-backtrack-imports.json');

class Node {
    constructor(value) {
        this.value = value;
        this.descendants = new Set();
        this.parents = new Set();
        this.chunkNames = [];
        this.size = -1;
    }

    addChunks = function (chunkIDs, graph) {
        chunkIDs.forEach(chunkID => {
            let files = graph.allChunks.get(chunkID);
            files.forEach(file => {
                this.chunkNames.push(file);
            })
        })
    }
}

export class Graph {
    constructor() {
        this.nodeMap = new Map();
        this.rootNodes = new Set();
        this.RegExpArr = [];
        this.allChunks = new Map();
        this.allNodes = [];
        this.allPaths = [];
    }

    // findAllPathsFromRoot = function (filePath) {
    //     let paths = [];
    //     let arr = [filePath];
    //     this.findDescendants(filePath, arr, paths);
    //     return paths;
    // }

    // findDescendants = function (filePath, arr, paths) {
    //     let node = this.nodeMap.get(filePath);
    //     if (!node.descendants.size) {
    //         paths.push([...arr]);
    //     }
    //     node.descendants.forEach(descendant => {
    //         arr.push(descendant.value);
    //         this.findDescendants(descendant.value, arr, paths);
    //         arr.pop();
    //     });
    // }

    findAllPaths = function (filePath, relevantChunks) {
        if (!this.nodeMap.has(filePath)) {
            return;
        }
        if (!relevantChunks || relevantChunks.length === 0) {
            return;
        }
        let backtrackMap = new Map();
        let node = this.nodeMap.get(filePath);
        this.allPaths = [];
        let arr = [];
        let flag = node.chunkNames.some(chunk => relevantChunks.indexOf(chunk) >= 0);
        if (this.findParents(node, arr, relevantChunks, backtrackMap, flag) === -1) {
            return { arr, msg: "Circular Dependency" };
        }
        return this.allPaths;
    }

    findParents = function (node, arr, relevantChunks, backtrackMap, flag) {
        if (backtrackMap.has(node.value)) {
            let indexOfNode = arr.findIndex(element => element.name === node.value);
            arr.splice(0, indexOfNode);
            return -1;
        }
        arr.push({ name: node.value, size: node.size });
        backtrackMap.set(node.value, 1);
        if (!node.parents.size && flag) {
            this.allPaths.push([...arr]);
        }
        for (let parent of node.parents) {
            let newFlag = parent.chunkNames.some(chunk => relevantChunks.indexOf(chunk) >= 0);
            if (flag === true && newFlag === false) {
                this.allPaths.push([...arr]);
            } else {
                if (this.findParents(parent, arr, relevantChunks, backtrackMap, newFlag) === -1) {
                    return -1;
                }
            }
        }
        let poppedVal = arr.pop();
        backtrackMap.delete(poppedVal.name);
    }

    getChunks = function (filePath) {
        if (!this.nodeMap.has(filePath)) {
            throw new Error("Invalid file path!");
        }
        let node = this.nodeMap.get(filePath);
        return node.chunkNames;
    }

    generateAllChunks = function () {
        stats.chunks.forEach(chunk => {
            this.allChunks.set(chunk.id, chunk.files);
        })
    }

    generateGraph = function () {
        stats.modules.forEach(module => {
            if (module.reasons.length) {
                if (this.nodeMap.has(module.name) && this.nodeMap.get(module.name).size < 0) {
                    this.nodeMap.get(module.name).size = module.size;
                }
                let numParents = 0;
                module.reasons.forEach(reason => {
                    if (reason.moduleName && this.RegExpArr.every(regexp => !regexp.test(reason.moduleName))) {
                        numParents++;
                    }
                });
                if (numParents === 0) {
                    if (this.RegExpArr.every(regexp => !regexp.test(module.name))) {
                        if (!this.nodeMap.has(module.name)) {
                            let node = new Node(module.name);
                            node.size = module.size;
                            this.nodeMap.set(module.name, node);
                        }
                        let rootNode = this.nodeMap.get(module.name);
                        rootNode.addChunks(module.chunks, this);
                        this.rootNodes.add(rootNode);
                    }
                } else {
                    if (!this.nodeMap.has(module.name)) {
                        let node = new Node(module.name);
                        node.size = module.size;
                        this.nodeMap.set(module.name, node);
                    }
                    let currModule = this.nodeMap.get(module.name);
                    currModule.addChunks(module.chunks, this);
                    module.reasons.forEach(reason => {
                        if (reason.moduleName && this.RegExpArr.every(regexp => !regexp.test(reason.moduleName))) {
                            if (!this.nodeMap.has(reason.moduleName)) {
                                let newNode = new Node(reason.moduleName);
                                this.nodeMap.set(reason.moduleName, newNode);
                            }
                            let childNode = this.nodeMap.get(module.name);
                            let parentNode = this.nodeMap.get(reason.moduleName);
                            if (childNode.value !== parentNode.value) {
                                parentNode.descendants.add(childNode);
                                childNode.parents.add(parentNode);
                            }
                        }
                    })
                }
            }
        })
    }

    generateAllNodesArr = function () {
        for (const key of this.nodeMap.keys()) {
            this.allNodes.push({ label: key });
        }
    }

    setGraphObj = function (RegExpArr = [/\.\/node_modules/]) {
        this.generateAllChunks();
        this.RegExpArr = RegExpArr;
        this.generateGraph();
        this.generateAllNodesArr();
    }

    generateAllPathsTreeObj = function (filePath, parent_id, depth, allPathsArrOfObj) {
        let tempArrOfObj = allPathsArrOfObj;
        if (depth === 0) {
            if (!this.allPaths || this.allPaths.length === 0 || this.allPaths[0].length === 0) {
                return [];
            }
            tempArrOfObj = [];
            let rootId = uuidv4();
            if (!parent_id) {
                parent_id = rootId;
            }
            tempArrOfObj.push({ id: rootId, parentId: null, name: this.allPaths[0][0].name, size: this.allPaths[0][0].size });
        }
        let setOfObj = new Set();
        for (let i = 0; i < this.allPaths.length; i++) {
            if (this.allPaths[i][depth + 1] && this.allPaths[i][depth].name === filePath) {
                let path = this.allPaths[i][depth + 1];
                if (!setOfObj.has(path.name)) {
                    setOfObj.add(path.name);
                    let currElemId = uuidv4();
                    let element = { id: currElemId, parentId: parent_id, name: path.name, size: path.size };
                    tempArrOfObj.push(element);
                }
            }
        }
        let indexOfParent = tempArrOfObj.findIndex(element => element.id === parent_id);
        tempArrOfObj.forEach(element => {
            if (element.parentId !== null) {
                if (element.parentId === parent_id) {
                    if (!tempArrOfObj[indexOfParent].children)
                        tempArrOfObj[indexOfParent].children = [];
                    tempArrOfObj[indexOfParent].children.push(element);
                }
            }
        })
        return tempArrOfObj;
    }

    // generateAllRootsNestedTreeObj = function () {
    //     const roots = [];
    //     if(!this.rootNodes.size){
    //         throw new Error("No starting node");
    //     }
    //     this.rootNodes.forEach(root => {
    //         let allPathsFromRoot = this.findAllPathsFromRoot(root.value);
    //         let tempArrOfObj = this.generateAllPathsTreeObj(allPathsFromRoot)
    //         roots.push(tempArrOfObj);
    //     })
    //     return roots;
    // }

    // generateAllPathsTreeObj = function (allPaths) {
    //     if(!allPaths || allPaths.length===0){
    //         return {};
    //     }
    //     let tempArrOfObj = [];
    //     for(let i=0; i<allPaths.length; i++){
    //         let parent_id = null;
    //         allPaths[i].forEach((path) => {
    //             let indexInArrOfObj = tempArrOfObj.findIndex((obj) => obj.name === path && obj.parentId === parent_id)
    //             if(indexInArrOfObj>=0) {
    //                 parent_id = tempArrOfObj[indexInArrOfObj].id;
    //             } else {
    //                 let currElemId = uuidv4();
    //                 tempArrOfObj.push({id: currElemId, parentId: parent_id, name: path, size: this.nodeMap.get(path).size});
    //                 parent_id = currElemId;
    //             }
    //         })
    //     }
    //     const arrMap = tempArrOfObj.reduce((accArr, element, index) => {
    //         accArr[element.id] = index;
    //         return accArr;
    //       }, {});
    //       const roots = [];
    //       tempArrOfObj.forEach(element => {
    //         if (element.parentId === null) {
    //           roots.push(element);
    //         } else {
    //             if(!tempArrOfObj[arrMap[element.parentId]].children)
    //                 tempArrOfObj[arrMap[element.parentId]].children = [];

    //             tempArrOfObj[arrMap[element.parentId]].children.push(element);
    //         }
    //       });
    //       return roots[0];
    // }

}
