import ajax from "licia/ajax";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import querystring from "querystring";
import * as rrweb from "rrweb";
import "./index.scss";
import "rrweb/dist/replay/rrweb-replay.min.css";
type IIprops = Partial<{
  domain: string;
  pid: string;
  id: string;
  el: HTMLDivElement;
}>;

function Tlor(props: IIprops) {
  const { domain, pid, id, el } = props;
  useEffect(() => {
    ajax.get(domain + "/find?project_id=" + pid + "&id=" + id, function (ret) {
      if (ret.code !== 0) {
        return alert("找不到数据");
      }
      let { events } = ret.data;

      events = JSON.parse(events);
      console.log(events);
      const replay = new rrweb.Replayer(events, {
        root: el,
      });
      replay.play();
    });
  }, []);
  return <></>;
}

Tlor.init = (config: IIprops) => {
  let container = document.body.appendChild(document.createElement("div"));
  container.id = "tlor-replay";
  const { id } = querystring.parse(location.search.replace("?", ""));
  if (!id) {
    return alert("query上缺少id");
  }
  const defaultConfig = {
    domain: "",
    id,
  };
  ReactDOM.render(
    <Tlor {...Object.assign({}, defaultConfig, config)} el={container}></Tlor>,
    container
  );
};

export default Tlor;
