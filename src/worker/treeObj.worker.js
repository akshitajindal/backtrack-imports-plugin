// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {
        let filePath = message.data[0];
        let parent_id = message.data[1];
        let depth = message.data[2];
        let allPathsArrOfObj = message.data[3];
        let allPaths = message.data[4];
        let pathToNode = message.data[5];
        let updatedAllPathsArrOfObj;
        if (depth === 0) {
            updatedAllPathsArrOfObj = generateNestedTreeObj(filePath, allPaths, parent_id, depth, allPathsArrOfObj, pathToNode);
        } else {
            updatedAllPathsArrOfObj = updateNestedTreeObj(filePath, allPaths, parent_id, depth, allPathsArrOfObj, pathToNode);
        }
        postMessage([updatedAllPathsArrOfObj]);
    };

    const updateNestedTreeObj = function (filePath, allPaths, parent_id, depth, allPathsArrOfObj, pathToNode) {
        let node = allPathsArrOfObj;
        for (let i = 0; i < pathToNode.length; i++) {
            let index = pathToNode[i];
            if (node[index].children) {
                node = node[index].children
            }
        }
        let currNodeindex = node.findIndex(element => element.name === filePath)
        if (!node[currNodeindex].children) {
            node[currNodeindex].children = [];
            let setOfObj = new Set();
            for (let i = 0; i < allPaths.length; i++) {
                if (allPaths[i][depth + 1] && allPaths[i][depth].name === filePath) {
                    let path = allPaths[i][depth + 1];
                    if (!setOfObj.has(path.name)) {
                        setOfObj.add(path.name);
                        let currElemId = makeid();
                        let element = { id: currElemId, parentId: parent_id, parentIndex: currNodeindex, parentRef: node[currNodeindex], name: path.name, size: path.size };
                        node[currNodeindex].children.push(element);
                    }
                }
            }
            if (node[currNodeindex].children.length === 0) {
                delete node[currNodeindex].children;
            } else {
                node[currNodeindex].copyChildren = node[currNodeindex].children;
            }
        } else if (node[currNodeindex].children.length === 0) {
            node[currNodeindex].children = node[currNodeindex].copyChildren;
        } else {
            node[currNodeindex].children = [];
        }
        return allPathsArrOfObj;
    }

    const generateNestedTreeObj = function (filePath, allPaths, parent_id, depth, allPathsArrOfObj, pathToNode) {
        if (depth === 0) {
            if (!allPaths || allPaths.length === 0 || allPaths[0].length === 0) {
                return [];
            }
            allPathsArrOfObj = [];
            let rootId = makeid();
            if (!parent_id) {
                parent_id = rootId;
            }
            allPathsArrOfObj.push({ id: rootId, parentId: null, parentIndex: null, parentRef: null, name: allPaths[0][0].name, size: allPaths[0][0].size });
        }
        if (!pathToNode) {
            let setOfObj = new Set();
            let parent_ref = allPathsArrOfObj[0];
            allPathsArrOfObj[0].children = [];
            for (let i = 0; i < allPaths.length; i++) {
                if (allPaths[i][depth + 1] && allPaths[i][depth].name === filePath) {
                    let path = allPaths[i][depth + 1];
                    if (!setOfObj.has(path.name)) {
                        setOfObj.add(path.name);
                        let currElemId = makeid();
                        let element = { id: currElemId, parentId: parent_id, parentIndex: 0, parentRef: parent_ref, name: path.name, size: path.size };
                        allPathsArrOfObj[0].children.push(element);
                    }
                }
            }
            if (allPathsArrOfObj[0].children.length === 0) {
                delete allPathsArrOfObj[0].children;
            } else {
                allPathsArrOfObj[0].copyChildren = allPathsArrOfObj[0].children;
            }
        }
        return allPathsArrOfObj;
    }

    const makeid = (length = 16) => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        let now = Date.now();
        return (result + "-" + now);
    }
};