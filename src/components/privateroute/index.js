import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { MachineContext } from "state";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export default function PrivateRoute({ children, ...rest }) {
  const [machine] = useContext(MachineContext);
  const { user } = machine.context;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user !== undefined ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
