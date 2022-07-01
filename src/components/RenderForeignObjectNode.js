import react from 'react';

function RenderForeignObjectNode(props) {
    const nodeWidth = 220;
    const nodeHeight = 70;
    const nodeShift = -110;
    const strokeWidth = 0;
    const textX = 0;
    const text1Y = 25;
    const textY = 35;
    const text2Y = 48;
    const oneLineTextlen = 20;
    const twoLineTextLen = 40
    return (
        <react.Fragment>
            <g id={props.nodeData.id} className="node_element_tree" onClick={() => { props.handleNodeOnClick(props.nodeData); props.toggleNode(); }} onMouseOver={(event) => { props.handleNodeMouseOver(event, props.nodeData) }} onMouseOut={() => { props.handleNodeMouseOut() }} >
                <rect className='nodeRect' width={nodeWidth} height={nodeHeight} x={nodeShift}>
                </rect>
                <text strokeWidth={strokeWidth} x={textX} y={text1Y} alignmentBaseline="middle" textAnchor="middle" id={props.nodeData.id + "_1"}>
                    {(props.nodeData.name.length > twoLineTextLen) && "..." + props.nodeData.name.slice(-twoLineTextLen, -oneLineTextlen)}
                    {(props.nodeData.name.length <= twoLineTextLen) && (props.nodeData.name.length > oneLineTextlen) && props.nodeData.name.slice(0, oneLineTextlen)}
                </text>
                <text strokeWidth={strokeWidth} x={textX} y={textY} alignmentBaseline="middle" textAnchor="middle" id={props.nodeData.id + "_center"}>
                    {(props.nodeData.name.length <= oneLineTextlen) && props.nodeData.name}
                </text>
                <text strokeWidth={strokeWidth} x={textX} y={text2Y} alignmentBaseline="middle" textAnchor="middle" id={props.nodeData.id + "_2"}>
                    {(props.nodeData.name.length > twoLineTextLen) && props.nodeData.name.slice(-oneLineTextlen)}
                    {(props.nodeData.name.length <= twoLineTextLen) && (props.nodeData.name.length > oneLineTextlen) && props.nodeData.name.slice(oneLineTextlen)}
                </text>
            </g>
        </react.Fragment>
    )
}

export default RenderForeignObjectNode;