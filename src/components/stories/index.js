import React from "react";
import { Link } from "react-router-dom";

function Stories({ stories }) {
  return (
    <div className="">
      {stories.map((story) => (
        <div key={story.id}>
          <Link to={`/story/${story.id}`}>{story.title}</Link>
        </div>
      ))}
    </div>
  );
}

export default Stories;
