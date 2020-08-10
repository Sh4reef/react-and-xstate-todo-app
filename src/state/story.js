import React, { createContext } from "react";
import { assign, Machine } from "xstate";
import { useMachine } from "@xstate/react";

const getItemUrl = (id) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

const fetchStory = async (_, event) => {
  const { id } = event;
  const story = await (await fetch(getItemUrl(id))).json();
  const comments = await Promise.all(
    story.kids
      .map((id) => getItemUrl(id))
      .map(async (url) => await (await fetch(url)).json())
  );
  return { story: story, comments };
};

const saveStory = async (_, event) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(event);
    }, 2000);
  });
};

export const StoryMachine = Machine({
  id: "story",
  initial: "init",
  context: {
    story: undefined,
    comments: [],
    error: undefined
  },
  states: {
    init: {},

    loading: {
      invoke: {
        id: "fetchStory",
        src: fetchStory,
        onDone: {
          target: "success",
          actions: assign((_, event) => ({
            story: event.data.story,
            comments: event.data.comments
          }))
        },
        onError: {
          target: "fail",
          actions: assign({ error: (_, event) => event.data })
        }
      }
    },
    success: {
      on: {
        SAVE_STORY: {
          target: "updating"
        }
      }
    },
    updating: {
      invoke: {
        id: "saveStory",
        src: saveStory,
        onDone: {
          target: "success",
          actions: assign((context, event) => {
            event.data.callback && event.data.callback();
            return {
              story: {
                ...context.story,
                ...event.data.story
              }
            };
          })
        },
        onError: {
          target: "fail",
          actions: () => {
            console.log("failure");
          }
        }
      }
    },
    fail: {}
  },
  on: {
    LOAD_STORY: {
      target: "loading",
      actions: assign({
        story: undefined
      }),
      cond: (context, event) => +context.story?.id !== +event.id
    }
  }
});

export const StoryMachineContext = createContext();

export const StoryMachineProvider = ({ children }) => {
  const [currentMachine, sendToMachine] = useMachine(StoryMachine);
  return (
    <StoryMachineContext.Provider value={[currentMachine, sendToMachine]}>
      {children}
    </StoryMachineContext.Provider>
  );
};
