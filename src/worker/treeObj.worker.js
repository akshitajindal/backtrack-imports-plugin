// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    const makeid = (length) =>  {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {
        let allPaths = message.data[0];
        if(!allPaths || allPaths.length===0){
            postMessage({});
        }
        let tempArrOfObj = [];
        for(let i=0; i<allPaths.length; i++){
            let parent_id = null;
            allPaths[i].forEach(path => {
                let indexInArrOfObj = tempArrOfObj.findIndex((obj) => obj.name === path.name && obj.parentId === parent_id)
                if(indexInArrOfObj>=0) {
                    parent_id = tempArrOfObj[indexInArrOfObj].id;
                } else {
                    let currElemId = makeid(16);
                    tempArrOfObj.push({id: currElemId, parentId: parent_id, name: path.name, size: path.size});
                    parent_id = currElemId;
                }
            })
        }
        const arrMap = tempArrOfObj.reduce((accArr, element, index) => {
            accArr[element.id] = index;
            return accArr;
        }, {});
        const roots = [];
        tempArrOfObj.forEach(element => {
            if (element.parentId === null) {
              roots.push(element);
            } else {
                if(!tempArrOfObj[arrMap[element.parentId]].children)
                    tempArrOfObj[arrMap[element.parentId]].children = [];
                tempArrOfObj[arrMap[element.parentId]].children.push(element);
            }
        })
        postMessage(roots[0]);
    };
};