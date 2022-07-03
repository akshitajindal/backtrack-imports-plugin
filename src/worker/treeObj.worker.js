// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {
        let filePath = message.data[0];
        let depth = message.data[1];
        let allPathsArrOfObj = message.data[2];
        let allPaths = message.data[3];
        let pathToNode = message.data[4];
        let updatedAllPathsArrOfObj = updateNestedTreeObj(filePath, allPaths, depth, allPathsArrOfObj, pathToNode);
        postMessage([updatedAllPathsArrOfObj]);
    };

    //function to form the nested tree object on clicking a node one level at a time. Also disconnect a opened node from it's subtree on cicking the node.
    const updateNestedTreeObj = function (filePath, allPaths, depth, allPathsArrOfObj, pathToNode) {
        if (!allPaths || allPaths.length === 0 || allPaths[0].length === 0) {
            return [];
        }

        //for root node 
        if (depth === 0) {
            if (allPathsArrOfObj.length === 0) {
                let rootId = makeid();
                allPathsArrOfObj.push({ id: rootId, parentIndex: null, parentRef: null, name: allPaths[0][0].name, size: allPaths[0][0].size });
            }
        }

        let node = allPathsArrOfObj;
        let currNodeindex = 0;

        //parsing through the nested tree object to the clicked node's parent
        if (depth !== 0) {
            for (let i = 0; i < pathToNode.length; i++) {
                let index = pathToNode[i];
                if (node[index].children) {
                    node = node[index].children
                }
            }
            currNodeindex = node.findIndex(element => element.name === filePath)
        }

        //appending a node's children or connecting/disconnecting a node to it's previously formed subtree
        if (!node[currNodeindex].children) {
            node[currNodeindex].children = [];
            let setOfObj = new Set();
            for (let i = 0; i < allPaths.length; i++) {
                if (allPaths[i][depth + 1] && allPaths[i][depth].name === filePath) {
                    let path = allPaths[i][depth + 1];
                    if (!setOfObj.has(path.name)) {
                        setOfObj.add(path.name);
                        let currElemId = makeid();
                        let element = { id: currElemId, parentIndex: currNodeindex, parentRef: node[currNodeindex], name: path.name, size: path.size };
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