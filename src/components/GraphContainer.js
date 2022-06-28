import './GraphContainer.css';
import TreeComponent from './TreeComponent';
function GraphContainer(props){
    let {isLoading, allPathsTreeObj, circularDependency, handleNodeOnClick} = props;
    if(isLoading){
        return (
            <div className='Message loading-message'>
                <p>Loading...</p>
            </div>
        )
    }
    if(circularDependency){ 
        return(
            <div className='Message error-message'>
                <p>Encountered circular dependency in the backtrack path of the selected module.</p>
            </div>
        )
    }
    if(!allPathsTreeObj){
        return(   
            <div className='Message empty-message'>
                <p>Module is not selected or Empty Chunk-List</p>
            </div>
        )
    }
    if(Object.keys(allPathsTreeObj).length === 0){
        return(
            <div className='Message message'>
                <p>Empty backtrack path of the selected module for the selected chunks.</p>
            </div>
        )
    }
    return(
        <div className='graphContainer'>
            <div className='graphContainerLabel'>
                <p>Backtrack imports from module : <code>{allPathsTreeObj.name}</code></p>
            </div>
            <TreeComponent data = {allPathsTreeObj} handleNodeOnClick = {handleNodeOnClick} />
        </div>
    )
}

export default GraphContainer;