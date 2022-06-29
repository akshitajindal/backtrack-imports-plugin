import './GraphContainer.css';
import TreeComponent from './TreeComponent';
function GraphContainer(props) {
    let { isLoading, allPathsTreeObj, circularDependency, circularDependencyArr, handleNodeOnClick } = props;
    if (isLoading) {
        return (
            <div className='Message loading-message'>
                <p>Loading...</p>
            </div>
        )
    }
    if (circularDependency) {
        return (
            <div className='Message error-message'>
                <p>Encountered circular dependency between the following modules in the backtrack path of the selected module.</p>
                <br />
                <ol>
                    {circularDependencyArr.map((element) =>
                        <li key={element.name}>
                            {element.name}
                        </li>
                    )}
                </ol>
            </div>
        )
    }
    if (!allPathsTreeObj) {
        return (
            <div className='Message empty-message'>
                <p>Module is not selected or Empty Chunk-List</p>
            </div>
        )
    }
    if (Object.keys(allPathsTreeObj).length === 0) {
        return (
            <div className='Message info-message'>
                <p>Empty backtrack path of the selected module for the selected chunks.</p>
            </div>
        )
    }
    return (
        <div className='graphContainer'>
            <div className='graphContainerLabel'>
                <p>Backtrack imports from module : <code>{allPathsTreeObj.name}</code></p>
            </div>
            <TreeComponent data={allPathsTreeObj} handleNodeOnClick={handleNodeOnClick} />
        </div>
    )
}

export default GraphContainer;