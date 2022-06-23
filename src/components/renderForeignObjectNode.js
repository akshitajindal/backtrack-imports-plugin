// import ReactTooltip from "react-tooltip";
import react from 'react';
const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  handleNodeMouseOver,
  handleNodeMouseOut
}) => (
  <react.Fragment>
    <g className="node_element_tree" onClick={toggleNode} onMouseOver={(event)=>{handleNodeMouseOver(event, nodeDatum)}} onMouseOut={()=>{handleNodeMouseOut(nodeDatum)}} >
      <rect width="220" height="50" x="-110">
      </rect>
      <text strokeWidth="0"  x="0" y="25" alignmentBaseline="middle"  textAnchor="middle">
        {(nodeDatum.name.length > 20) && nodeDatum.name.slice(0,10)+ "..." + nodeDatum.name.slice(-10)}
        {(nodeDatum.name.length <= 20) && nodeDatum.name}
      </text>
      <title>Title: {nodeDatum.name}  Size: {nodeDatum.size} Bytes</title>    
    </g>
    {/* <ReactTooltip id={nodeDatum.id} place="top" effect="solid">
      Tooltip for the register button
    </ReactTooltip> */}
  </react.Fragment>
);

export default renderForeignObjectNode;