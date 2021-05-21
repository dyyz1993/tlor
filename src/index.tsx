import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import Draggabilly from "draggabilly";
import "./index.scss";
import Dialog from "rmc-dialog";
import "rmc-dialog/assets/index.css";
import ajax from "licia/ajax";
import randomId from "licia/randomId";
import * as rrweb from "rrweb";
import { eventWithTime } from "rrweb/typings/types";

// import { Modal } from "antd-mobile"; // 引入官方提供的 less 样式入口文件
// import "antd-mobile/lib/modal/style";
type ITlorProps = Partial<{
  domain: string;
  id: string | number;
  network: boolean;
  console: boolean;
}>;

function Tlor(props: ITlorProps & any) {
  const { el, domain, project_id, eventsMatrix } = props;
  const clickFnc = useCallback((event, pointer) => {}, []);
  useEffect(() => {
    el.on("staticClick", clickFnc);
    return () => {
      el.off("staticClick", clickFnc);
    };
  }, []);
  return (
    <>
      上报BUG
      <Dialog
        wrapClassName={"tlor-modal-wrap"}
        visible={true}
        className={"tlor-modal"}
        title={"上报BUG"}
      >
        {[
          {
            title: "上报最近30秒",
            second: 1,
          },
          {
            title: "上报最近60秒",
            second: 2,
          },
          {
            title: "上报最近90秒",
            second: 3,
          },
        ].map(({ title, second }, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                let events = (eventsMatrix as []).slice(-second);
                console.log(eventsMatrix, events, -(second + 1));
                ajax({
                  type: "post",
                  url:
                    domain +
                    "/upload?project_id=" +
                    project_id +
                    "&id=" +
                    randomId(5),
                  data: events,
                });
              }}
            >
              {title}
            </button>
          );
        })}
      </Dialog>
    </>
  );
}

Tlor.init = function (config: ITlorProps) {
  let container = document.body.appendChild(document.createElement("div"));
  container.id = "tlor";
  let draggie = new Draggabilly(container, {
    //   containment:document.body
  });
  // 使用二维数组来存放多个 event 数组
  const eventsMatrix: Array<Array<eventWithTime>> = [[]];

  let defaultConfig = {
    project_id: randomId(5),
    domain: "",
  };

  rrweb.record({
    emit(event, isCheckout) {
      // isCheckout 是一个标识，告诉你重新制作了快照
      if (isCheckout) {
        // 超过2分钟移除快照
        if (eventsMatrix.length >= 4) {
          eventsMatrix.shift();
        }
        eventsMatrix.push([]);
      }
      const lastEvents = eventsMatrix[eventsMatrix.length - 1];
      lastEvents.push(event);
    },
    checkoutEveryNms: 30 * 1000, // 每30秒重新制作快照
  });

  ReactDOM.render(
    <Tlor
      {...Object.assign({}, defaultConfig, config)}
      el={draggie}
      eventsMatrix={eventsMatrix}
    ></Tlor>,
    container
  );
};

export default Tlor;
