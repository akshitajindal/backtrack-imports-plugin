import react from 'react';

function RenderForeignObjectNode (props) {
  return (
    <react.Fragment>
    <g className="node_element_tree" onClick={()=>{props.handleNodeOnClick(props.nodeData); props.toggleNode();}} onMouseOver={(event)=>{props.handleNodeMouseOver(event, props.nodeData)}} onMouseOut={()=>{props.handleNodeMouseOut()}} >
      <rect width="220" height="50" x="-110">
      </rect>
      <text strokeWidth="0"  x="0" y="25" alignmentBaseline="middle"  textAnchor="middle">
        {(props.nodeData.name.length > 20) && props.nodeData.name.slice(0,9)+ "..." + props.nodeData.name.slice(-9)}
        {(props.nodeData.name.length <= 20) && props.nodeData.name}
      </text>
    </g>
  </react.Fragment>
  )
}

export default RenderForeignObjectNode;