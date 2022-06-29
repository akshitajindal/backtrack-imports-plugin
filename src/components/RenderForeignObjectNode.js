import react from 'react';
import { useEffect } from 'react';

function RenderForeignObjectNode(props) {
    const clip = function (text, maxWidth, elem) {
        elem.innerHTML = text;
        let currWidth = elem.getBoundingClientRect().width;
        if (currWidth > maxWidth) {
            text = '...' + text.slice(2);
            elem.innerHTML = text;
            currWidth = elem.getBoundingClientRect().width;
        }
        while (currWidth >= maxWidth) {
            text = '...' + text.slice(5);
            elem.innerHTML = text;
            currWidth = elem.getBoundingClientRect().width;
        }
        return text;
    }

    const setTextElem = function () {
        let nodeElem = document.querySelector('.nodeRect');
        if (nodeElem) {
            let widthAvailable = 2 * (nodeElem.getBoundingClientRect().width - 20);
            let textElem = document.getElementById(props.nodeData.id);
            if (textElem) {
                let clippedText = clip(props.nodeData.name, widthAvailable, textElem);
                widthAvailable = widthAvailable / 2;
                if (textElem.getBoundingClientRect().width > widthAvailable) {
                    textElem.innerHTML = "";
                    let textElem_1 = document.getElementById(props.nodeData.id + "_1");
                    let textElem_2 = document.getElementById(props.nodeData.id + "_2");
                    let len = clippedText.length;

                    let endIndex = len / 2;
                    let text = clippedText.slice(0, endIndex);
                    textElem_1.innerHTML = text;
                    let currWidth = textElem_1.getBoundingClientRect().width;

                    while (currWidth < widthAvailable && endIndex <= len) {
                        endIndex += 1;
                        text = clippedText.slice(0, endIndex);
                        textElem_1.innerHTML = text;
                        currWidth = textElem_1.getBoundingClientRect().width;
                    }
                    if (endIndex >= len) {
                        textElem.innerHTML = clippedText;
                        textElem_1.innerHTML = "";
                    }
                    else
                        textElem_2.innerHTML = clippedText.slice(endIndex);
                }
            }
        }
    }

    useEffect(() => {
        setTextElem();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <react.Fragment>
            <g className="node_element_tree" onClick={() => { props.handleNodeOnClick(props.nodeData); props.toggleNode(); }} onMouseOver={(event) => { props.handleNodeMouseOver(event, props.nodeData) }} onMouseOut={() => { props.handleNodeMouseOut() }} >
                <rect className='nodeRect' width="220" height="70" x="-110">
                </rect>
                <text strokeWidth="0" x="0" y="25" alignmentBaseline="middle" textAnchor="middle" id={props.nodeData.id + "_1"}></text>
                <text strokeWidth="0" x="0" y="35" alignmentBaseline="middle" textAnchor="middle" id={props.nodeData.id}></text>
                <text strokeWidth="0" x="0" y="48" alignmentBaseline="middle" textAnchor="middle" id={props.nodeData.id + "_2"}></text>
            </g>
        </react.Fragment>
    )
}

export default RenderForeignObjectNode;