import React from "react";
import { render } from "react-dom";

function Hi() {
  debugger;
  return <p>Hi.</p>;
}

render(<Hi></Hi>, document.getElementById("app"));
