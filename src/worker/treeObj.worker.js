// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    const makeid = (length = 16) => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        let now = Date.now();
        return (now + result);
    }

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {
        let filePath = message.data[0];
        let parent_id = message.data[1];
        let depth = message.data[2];
        let allPathsArrOfObj = message.data[3];
        let allPaths = message.data[4];
        let tempArrOfObj = generateAllPathsTreeObj(filePath, allPaths, parent_id, depth, allPathsArrOfObj);
        postMessage([tempArrOfObj]);
    };

    const generateAllPathsTreeObj = function (filePath, allPaths, parent_id, depth, allPathsArrOfObj) {
        let tempArrOfObj = allPathsArrOfObj;
        if (depth === 0) {
            if (!allPaths || allPaths.length === 0 || allPaths[0].length === 0) {
                return [];
            }
            tempArrOfObj = [];
            let rootId = makeid();
            if (!parent_id) {
                parent_id = rootId;
            }
            tempArrOfObj.push({ id: rootId, parentId: null, name: allPaths[0][0].name, size: allPaths[0][0].size });
        }
        let setOfObj = new Set();
        for (let i = 0; i < allPaths.length; i++) {
            if (allPaths[i][depth + 1] && allPaths[i][depth].name === filePath) {
                let path = allPaths[i][depth + 1];
                if (!setOfObj.has(path.name)) {
                    setOfObj.add(path.name);
                    let currElemId = makeid();
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
};