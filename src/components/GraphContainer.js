import './GraphContainer.css';
import TreeComponent from './TreeComponent';
function GraphContainer(props) {
    let { isLoading, allPathsArrOfObj, circularDependencyArr, handleNodeOnClick } = props;
    if (isLoading) {
        return (
            <div className='Message loading-message'>
                <p>Loading...</p>
            </div>
        )
    }
    if (circularDependencyArr.length) {
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
    if (!allPathsArrOfObj) {
        return (
            <div className='Message empty-message'>
                <p>Module is not selected or Empty Chunk-List</p>
            </div>
        )
    }
    if (allPathsArrOfObj.length === 0) {
        return (
            <div className='Message info-message'>
                <p>Empty backtrack path of the selected module for the selected chunks.</p>
            </div>
        )
    }
    return (
        <div className='graphContainer'>
            <div className='graphContainerLabel'>
                <p>Backtrack imports from module : <code>{allPathsArrOfObj[0].name}</code></p>
            </div>
            <TreeComponent data={allPathsArrOfObj[0]} handleNodeOnClick={handleNodeOnClick} />
        </div>
    )
}

export default GraphContainer;