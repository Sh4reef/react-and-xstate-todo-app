import Stories from "components/stories";
import React, { useContext, useEffect } from "react";
import { MachineContext } from "state";

function Home() {
  const [machine, sendToMachine] = useContext(MachineContext);

  let { error, stories } = machine.context;
  stories = Object.keys(stories).map((k) => stories[k]);

  useEffect(() => {
    sendToMachine("LOAD_STORIES");
  }, []);

  return (
    <div className="">
      <h1>Home</h1>
      <button onClick={() => sendToMachine("RELOAD_STORIES")}>
        Reload Stories
      </button>
      <hr />
      {machine.matches("list.loading") && <h2>Loading...</h2>}
      {machine.matches("list.fail") && (
        <div style={{ color: "red" }}>
          Error loading stories: {error.toString()}
        </div>
      )}
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", maxWidth: 300 }}>
          {machine.matches("list.success") && (
            <Stories stories={stories} sendToMachine={sendToMachine} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
