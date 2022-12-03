import React from "react";
import "./App.css";

import Main from "./components/Main";
import Navbar from "./components/Navbar";

import { StateContext } from "./stateContext";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "path",
      algorithm: "",
    };
    this.changeState = this.changeState.bind(this);
  }

  changeState(obj) {
    this.setState(obj);
  }

  render() {
    return (
      <div className="App">
        <StateContext.Provider
          value={{
            state: this.state,
            setState: this.changeState,
          }}
        >
          <Navbar />
          <Main />
        </StateContext.Provider>
      </div>
    );
  }
}

export default App;
