import react from 'react';
import { useEffect } from 'react';

function RenderForeignObjectNode (props) {
    const clip = function(text, maxWidth, elem) {
      elem.innerHTML = text;
      let currWidth = elem.getBoundingClientRect().width;
      if(currWidth>maxWidth){
          text = text.split("");
          let len = text.length;
          if(len%2===0){
              text.splice(len/2-1, 2, '...');
          } else {
              text.splice(Math.floor(len/2), 1, '...');
          }
          text = text.join("");
          elem.innerHTML = text;
          currWidth = elem.getBoundingClientRect().width;
      }
      while(currWidth>=maxWidth){
          text = text.split('...').join("").split("");
          let len = text.length;
          text.splice(len/2-1, 2, '...')
          text = text.join("");
          elem.innerHTML = text;
          currWidth = elem.getBoundingClientRect().width;
      }
      return text;
  }

  const setTextElem = function () {
    let nodeElem = document.querySelector('.nodeRect');
    if(nodeElem) {
      let widthAvailable = nodeElem.getBoundingClientRect().width - 10;
      let textElem = document.getElementById(props.nodeData.id);
      if(textElem) {
        textElem.innerHTML = clip(props.nodeData.name, widthAvailable, textElem);
      }
    }
  }
  
  useEffect(() => {
    setTextElem();
  }, [])

  return (
    <react.Fragment>
    <g className="node_element_tree" onClick={()=>{props.handleNodeOnClick(props.nodeData); props.toggleNode();}} onMouseOver={(event)=>{props.handleNodeMouseOver(event, props.nodeData)}} onMouseOut={()=>{props.handleNodeMouseOut()}} >
      <rect className='nodeRect' width="220" height="50" x="-110">
      </rect>
      <text strokeWidth="0"  x="0" y="25" alignmentBaseline="middle"  textAnchor="middle" id={props.nodeData.id}>
      </text>
    </g>
    </react.Fragment>
  )
}

export default RenderForeignObjectNode;