import { useState } from 'react';
import './ModulesList.css';

function ModulesList(props) {
    const [query, setQuery] = useState('');
    const [filteredNodes, setFilteredNodes] = useState([]);

    const changeHandler = (event) => {
        setQuery(event.target.value);
        setFilteredNodes([...props.fuse.search(event.target.value)]);
    }

    //const filteredNodes = props.fuse.search(query);

    const handleOnClick = function (event) {
        setQuery(event.target.innerHTML);
        props.handleModulesChange(event.target.innerHTML);
    }

    return (
        <div className='modulesListContainer'>
            <div className='searchbox'>
                <input type='text' value={query} onChange={changeHandler} placeholder='Enter Module name' />
            </div>
            <div className='modulesList'>
                <ul>
                    {filteredNodes.map((node) =>
                        <li onClick={handleOnClick} key={node.label}>
                            {node.label}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default ModulesList;