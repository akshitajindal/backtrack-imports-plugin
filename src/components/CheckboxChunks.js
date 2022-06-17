import { useState} from "react";
import './CheckboxChunks.css';

function CheckboxChunks (props) {

  const [allChecks, setAllChecks] = useState(true);

  const [checkedState, setCheckedState] = useState(
      new Array(props.allChunksArr.length).fill(true)
  );

  const handleAllChecksOnChange = () => {
    const updatedAllCheckState = !allChecks;
    const updatedCheckedState = Array(props.allChunksArr.length).fill(updatedAllCheckState);
    setAllChecks(updatedAllCheckState);
    setCheckedState(updatedCheckedState);
    let activeChunksList = [];
    updatedCheckedState.forEach((state,index) => {
      if(state)
        activeChunksList.push(props.allChunksArr[index]);
    })
    props.handleChunksChange(activeChunksList);
  }

  const handleOnChange = (position) => {
      const updatedCheckedState = checkedState.map((item, index) =>
        index === position ? !item : item
      );
      updatedCheckedState.includes(false) ? setAllChecks(false) : setAllChecks(true);
      setCheckedState(updatedCheckedState);
      let activeChunksList = [];
      updatedCheckedState.forEach((state,index) => {
        if(state)
          activeChunksList.push(props.allChunksArr[index]);
      })
      props.handleChunksChange(activeChunksList);
  };

    return (
        <div className="chunksListContainer">
          <h3>Select Chunks</h3>
          <div className="chunks-list-item">
            <input
              type="checkbox"
              checked={allChecks}
              id="allChecks"
              onChange={handleAllChecksOnChange}
            />
            <label htmlFor={"allChecks"}>All Chunks</label>
          </div>
          <ul className="chunks-list">
            {props.allChunksArr.map((name, index) => {
              return (
                <li className="chunks-list-item" key={index}>
                      <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={name}
                        value={name}
                        checked={checkedState[index]}
                        onChange={() => handleOnChange(index)}
                      />
                      <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </li>
              );
            })}
          </ul>
        </div>
      );
}

export default CheckboxChunks;