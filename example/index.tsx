import querystring from "querystring";
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import Tlor from "../src/record/index";
import TlorReplay from "../src/replay/index";
import ajax from "licia/ajax";

const { mode } = querystring.parse(location.search.replace("?", ""));
console.log(mode);
if ((mode as any) == 1) {
  (Tlor as any).init({ pid: "test", domain: "http://localhost:3000/demo" });
} else {
  (TlorReplay as any).init({
    pid: "test",
    domain: "http://localhost:3000/demo",
  });
}

function App() {
  const [state, setstate] = useState<number>(0);
  useEffect(() => {
    let timer = setInterval(() => {
      setstate(state + 1);
      console.log(state);
      ajax.get(
        "http://localhost:3000/demo/find?project_id=test&id=cLwyj",
        () => {}
      );
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [state]);
  return (
    <div>
      <button onClick={() => setstate(state + 1)}> {state}</button>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#app"));

// declare var Tlor: any
// (Tlor as any).default.init({ id: 1111 })
