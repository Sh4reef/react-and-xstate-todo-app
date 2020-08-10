import React, { createContext } from "react";
import { useMachine } from "@xstate/react";
import { assign, Machine } from "xstate";
import { auth } from "./auth";

const storiesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
const getStoryDataUrl = (id) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

const fetchStories = async () => {
  const storyIds = await fetch(storiesUrl).then((r) => r.json());
  const topTenStories = await Promise.all(
    storyIds
      .slice(0, 10)
      .map((id) => getStoryDataUrl(id))
      .map((url) => fetch(url).then((r) => r.json()))
  );
  return topTenStories;
};

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

export const appMachine = Machine({
  id: "app",
  initial: "init",
  context: {
    user: undefined,
    error: undefined,
    stories: {}
  },
  states: {
    init: {},

    auth,

    list: {
      states: {
        loading: {
          invoke: {
            id: "fetchStories",
            src: fetchStories,
            onDone: {
              target: "success",
              actions: assign((context, event) => ({
                stories: arrayToObject(event.data, "id")
              }))
            },
            onError: {
              target: "fail",
              actions: assign({ error: (context, event) => event.data })
            }
          }
        },
        success: {
          on: {
            UPDATE_STORY: {
              actions: assign((context, event) => {
                return {
                  stories: {
                    ...context.stories,
                    [event.story.id]: {
                      ...context.stories[event.story.id],
                      ...event.story
                    }
                  }
                };
              })
            }
          }
        },
        fail: {}
      }
    }
  },
  on: {
    LOGIN: {
      target: "auth.started"
    },
    LOAD_STORIES: {
      target: "list.loading",
      cond: (context) => !Object.keys(context.stories).length
    },
    RELOAD_STORIES: {
      target: "list.loading"
    }
  }
});

export const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [currentMachine, sendToMachine] = useMachine(appMachine);
  return (
    <MachineContext.Provider value={[currentMachine, sendToMachine]}>
      {children}
    </MachineContext.Provider>
  );
};
