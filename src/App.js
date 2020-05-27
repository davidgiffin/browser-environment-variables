import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Helmet} from "react-helmet";
import httpClient from "./httpClient";

function App() {
  const makeApiCall = () => {
    console.log("what is process.env when clicking?", process.env)
    const resp = httpClient.get('/users')
  }

  console.log("what is process.env in App", process.env)

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Jerms is here</title>
        <script type="text/javascript">
        {`
        console.log("what is window", window)
        console.log("what is window.process before setting", window.process)
      window.process = window.process || {}
      console.log("what is process.env before setting", process.env)
      process.env = process.env || {}

      process.env = Object.assign({}, process.env, {
        REACT_APP_BACKEND_BASE_URL: "localhost:5000",
      });
      console.log("what is env?", process.env)
          `}

        </script>
      </Helmet>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div onClick={makeApiCall}>
        click me
      </div>
    </div>
  );
}

export default App;
