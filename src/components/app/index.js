import Home from "components/home";
import Login from "components/login";
import Story from "components/story";
import EditStory from "components/editstory";
import PrivateRoute from "components/privateroute";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Compose } from "utils/compose";
import { MachineProvider } from "state";
import { StoryMachineProvider } from "state/story";
import "./App.css";

const providers = [MachineProvider, StoryMachineProvider];

function App() {
  return (
    <Compose components={providers}>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/story/:id/edit">
              <EditStory />
            </PrivateRoute>
            <PrivateRoute path="/story/:id">
              <Story />
            </PrivateRoute>
            <PrivateRoute path="/">
              <Home />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </Compose>
  );
}

export default App;
