import React, { useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { StoryMachineContext } from "state/story";

function Story() {
  const { id } = useParams();

  const [currentMachine, sendToMachine] = useContext(StoryMachineContext);

  useEffect(() => {
    sendToMachine("LOAD_STORY", { id });
  }, []);

  const { story, comments } = currentMachine.context;

  return (
    <div className="">
      <Link to="/">{"< Go Back"}</Link>
      <hr />
      <Link to={`${id}/edit`}>Edit</Link>
      <br />
      <br />
      <h2>{story?.title}</h2>
      <hr />
      {currentMachine.matches("loading") && <h3>Loading..</h3>}
      {currentMachine.matches("success") &&
        comments.map((comment) => <div key={comment.id}>{comment.text}</div>)}
    </div>
  );
}

export default Story;
