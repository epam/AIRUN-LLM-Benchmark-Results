import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Page from "./components/Page/Page";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:url" component={Page} />
        <Route path="/" component={Page} />
      </Switch>
    </Router>
  );
}

export default App;