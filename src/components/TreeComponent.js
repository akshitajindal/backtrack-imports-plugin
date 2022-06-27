import './TreeComponent.css';
import React from 'react';
import Tree from 'react-d3-tree';
import RenderForeignObjectNode from './RenderForeignObjectNode';
import { useCenteredTree } from "./helpers";


function TreeComponent (props) {

    const [dimensions, translate, containerRef] = useCenteredTree();

    function handleNodeMouseOver(event, nodeData) {
        let tooltip = document.querySelector(".tooltip");
        let nodeTitle = document.querySelector(".nodeTitle");
        let nodeSize = document.querySelector(".nodeSize");
        nodeTitle.innerHTML = "Title: " + nodeData.name;
        nodeSize.innerHTML = "Size: " + nodeData.size + " Bytes";
        tooltip.style.display = "block";
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
    }
    
    function handleNodeMouseOut() {
        let tooltip = document.querySelector(".tooltip");
        tooltip.style.display = "none";
    }

    function handleNodeOnClick(nodeData) {
        props.handleNodeOnClick(nodeData);
    }

    return (
        <div className="treeWrapper" style={{ width: '85vw', height: '70vh' }} ref={containerRef}>
            <Tree 
                data={props.data}
                orientation={"vertical"}
                translate={translate}
                dimensions={dimensions}
                renderCustomNodeElement={(rd3tProps) =>
                    <RenderForeignObjectNode nodeData={rd3tProps.nodeDatum} toggleNode={rd3tProps.toggleNode} handleNodeOnClick={handleNodeOnClick} handleNodeMouseOver={handleNodeMouseOver} handleNodeMouseOut={handleNodeMouseOut}/>
                }
                rootNodeClassName="node__root"
                branchNodeClassName="node__branch"
                leafNodeClassName="node__leaf"
                pathFunc="step"
                collapsible={true}
                nodeSize={{
                    x: 240,
                    y: 200
                }}
            />
            <div className='tooltip'>
                <div className='nodeTitle'></div>
                <div className='nodeSize'></div>
            </div>
        </div>
    )

}

export default TreeComponent;