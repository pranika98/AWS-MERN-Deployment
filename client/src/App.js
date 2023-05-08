import logo from "./logo.svg";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  const onPageLoad = async () => {
    const res = await axios.get(`/api`);
    console.log("App", res.data);
  };

  useEffect(() => {
    onPageLoad();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link className="App-link" to="/other-link">
          Link to Other Page
        </Link>
      </header>
    </div>
  );
}

export default App;
