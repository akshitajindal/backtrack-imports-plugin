import './TreeComponent.css';
import React from 'react';
import Tree from 'react-d3-tree';
import renderForeignObjectNode from './renderForeignObjectNode';
import { useCenteredTree } from "./helpers";


function TreeComponent (props) {

    // const nodeSize = { x: 200, y: 200 };
    // const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };
    const [dimensions, translate, containerRef] = useCenteredTree();

    function handleNodeMouseOver(event, nodeData) {
        // console.log("here");
        // let tooltip = document.createElement("div");
        // tooltip.className = "tooltip";
        // let svgElement = document.querySelector(".rd3t-svg");
        // let gElement = document.querySelector(".rd3t-g");
        // tooltip.setAttribute("id", nodeData.id);
        // let tooltip = document.getElementById(nodeData.id);
        // let tooltip = document.querySelector(".tooltip");
        // tooltip.innerHTML = nodeData.name;
        // tooltip.style.display = "block";
        // tooltip.style.left = event.pageX + 10 + 'px';
        // tooltip.style.top = event.pageY + 10 + 'px';
        // svgElement.append(tooltip);
        // gElement.append(tooltip);
    }
    
    function handleNodeMouseOut(nodeData) {
        // console.log("out");
        // let tooltip = document.querySelector(".tooltip");
        // let tooltip = document.getElementById(nodeData.id);
        // tooltip.innerHTML = "";
        // tooltip.style.display = "none";
    }

    return (
        <div className="treeWrapper" style={{ width: '85vw', height: '70vh' }} ref={containerRef}>
            <Tree 
                data={props.data}
                orientation={"vertical"}
                translate={translate}
                dimensions={dimensions}
                //allowForeignObjects
                // nodeLabelComponent={
                //     NodeCard()
                // }
                renderCustomNodeElement={(rd3tProps) =>
                    renderForeignObjectNode({ ...rd3tProps, handleNodeMouseOver, handleNodeMouseOut})
                }
                rootNodeClassName="node__root"
                branchNodeClassName="node__branch"
                leafNodeClassName="node__leaf"
                pathFunc="step"
                initialDepth={1}
                collapsible={true}
                nodeSize={{
                    x: 240,
                    y: 200
                }}
            />
        </div>
    )

}

export default TreeComponent;