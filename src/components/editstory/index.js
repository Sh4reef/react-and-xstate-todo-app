import React, { useContext, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { MachineContext } from "state";
import { StoryMachineContext } from "state/story";

function EditStory() {
  const sendToAppMachine = useContext(MachineContext)[1];
  const [currentMachine, sendToMachine] = useContext(StoryMachineContext);
  const { id } = useParams();

  useEffect(() => {
    sendToMachine("LOAD_STORY", { id });
  }, []);

  const saveStory = () => {
    const story = {
      id,
      title: inputRef.current.value
    };

    sendToMachine("SAVE_STORY", {
      story,
      callback: () => {
        sendToAppMachine("UPDATE_STORY", { story });
      }
    });
  };

  const { story } = currentMachine.context;

  const inputRef = useRef();

  return (
    <div className="">
      <Link to={`/story/${id}`}>{"< Go Back"}</Link>
      {currentMachine.matches("updating") && <h2>Loading...</h2>}
      {currentMachine.matches("success") && (
        <>
          <h2>
            <span>Edit: </span>
            {story?.title}
          </h2>

          <input type="text" ref={inputRef} defaultValue={story?.title} />
          <button onClick={saveStory}>Save</button>
        </>
      )}
    </div>
  );
}

export default EditStory;
