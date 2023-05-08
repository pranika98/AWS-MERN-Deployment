import logo from "./logo.svg";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

function OtherComponent() {
  const onPageLoad = async () => {
    const res = await axios.get(`/api/other-link`);
    console.log("OtherComponent", res.data);
  };

  useEffect(() => {
    onPageLoad();
  }, []);

  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: "#000" }}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link className="App-link" to="/">
          Link to Home Page
        </Link>
      </header>
    </div>
  );
}

export default OtherComponent;
