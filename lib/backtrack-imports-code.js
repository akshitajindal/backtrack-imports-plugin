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
    }

    findAllPaths = function (filePath, relevantChunks) {
        if (!this.nodeMap.has(filePath)) {
            return;
        }
        if (!relevantChunks || relevantChunks.length === 0) {
            return;
        }
        let backtrackMap = new Map();
        let node = this.nodeMap.get(filePath);
        let allPaths = [];
        let arr = [];
        let flag = node.chunkNames.some(chunk => relevantChunks.indexOf(chunk) >= 0);
        if (this.findParents(node, arr, allPaths, relevantChunks, backtrackMap, flag) === -1) {
            return { arr, msg: "Circular Dependency" };
        }
        return allPaths;
    }

    findParents = function (node, arr, allPaths, relevantChunks, backtrackMap, flag) {
        if (backtrackMap.has(node.value)) {
            let indexOfNode = arr.findIndex(element => element.name === node.value);
            arr.splice(0, indexOfNode);
            return -1;
        }
        arr.push({ name: node.value, size: node.size });
        backtrackMap.set(node.value, 1);
        if (!node.parents.size && flag) {
            allPaths.push([...arr]);
        }
        for (let parent of node.parents) {
            let newFlag = parent.chunkNames.some(chunk => relevantChunks.indexOf(chunk) >= 0);
            if (flag === true && newFlag === false) {
                allPaths.push([...arr]);
            } else {
                if (this.findParents(parent, arr, allPaths, relevantChunks, backtrackMap, newFlag) === -1) {
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

}
