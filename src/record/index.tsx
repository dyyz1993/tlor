import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import Draggabilly from "draggabilly";
// import "./index.scss";
import Dialog from "rmc-dialog";
import ajax from "licia/ajax";
import randomId from "licia/randomId";
import * as rrweb from "rrweb";
import { eventWithTime } from "rrweb/typings/types";
type ITlorProps = Partial<{
  domain: string;
  pid: string | number;
  network: boolean;
  console: boolean;
  el: HTMLDivElement;
  eventsMatrix: Array<Array<eventWithTime>>;
}>;

function Tlor(props: ITlorProps) {
  const { el, domain, pid, eventsMatrix } = props;
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<string | undefined>();
  const [index, setIndex] = useState<number | undefined>();
  const [uploadStatus, setUploadStatus] = useState<number>();

  const clickFnc = useCallback((event: Event) => {
    setVisible(true);

    event.stopPropagation();
    event.stopImmediatePropagation();
  }, []);

  // const eventsMatrixRef = useRef<Array<Array<unknown>>>([]);

  useEffect(() => {
    (el as HTMLDivElement).addEventListener("click", clickFnc);
    return () => {
      (el as HTMLDivElement).removeEventListener("click", clickFnc);
      // record!();
    };
  }, []);

  let refTimer = useRef<any>();
  function onClose() {
    refTimer.current && clearTimeout(refTimer.current);
    setVisible(false);
    setUploadStatus(0);
    setId(undefined);
    setIndex(undefined);
  }

  useMemo(() => {
    Object.defineProperty(Dialog.prototype, "container", {
      // writable: true,
      // value: null,
      get: function () {
        if (!this.value) {
          this.value = el?.parentNode?.appendChild(
            document.createElement("div")
          );
        }
        return this.value;
      },
      set: function (val) {
        this.value = val;
      },
    });
  }, []);
  return (
    <>
      上报BUG
      <Dialog
        onClose={onClose}
        wrapClassName={"tlor-modal-wrap"}
        visible={visible}
        className={"tlor-modal"}
        title={"上报BUG"}
      >
        {index === undefined ? (
          [
            {
              title: 30,
              second: 1,
            },
            {
              title: 60,
              second: 2,
            },
            {
              title: 90,
              second: 3,
            },
          ].map(({ title, second }, i) => {
            return (
              <button
                key={i}
                onClick={() => {
                  let events = (eventsMatrix as [])
                    .slice(-second)
                    .reduce((cur, arr) => cur.concat(arr), []);
                  let id = randomId(5);
                  setIndex(i);
                  setUploadStatus(0);
                  // console.log(eventsMatrix, events, -(second + 1));
                  ajax({
                    type: "post",
                    url: domain + "/upload?project_id=" + pid + "&id=" + id,
                    data: { events: JSON.stringify(events) },
                    timeout: 30000,
                    success: () => {
                      // setIndex(undefined);
                      setUploadStatus(1);
                      setId(id);
                    },
                    error: () => {
                      // setIndex(undefined);
                      refTimer.current = setTimeout(() => {
                        onClose();
                      }, 2000);
                      setUploadStatus(-1);
                    },
                  });
                }}
              >
                上报最近<span style={{ color: "red" }}>{title}</span>秒
              </button>
            );
          })
        ) : (
          <div className={"tlor-modal-result"}>
            {uploadStatus === -1 && <span>上报失败</span>}
            {uploadStatus === 1 && (
              <>
                <p>{id}</p> <span>上报成功</span>
              </>
            )}
            {uploadStatus === 0 && <span>上报中ing</span>}
          </div>
        )}
      </Dialog>
    </>
  );
}

Tlor.init = function (config: ITlorProps) {
  // const fragment = document.body.create();
  const shadow = document.body
    .appendChild(document.createElement("div"))
    .attachShadow({ mode: "open" });
  const container = shadow.appendChild(document.createElement("div"));
  container.id = "tlor";
  container.className = "tlor";
  const css = require("./index.scss").default.toString();
  const css2 = require("rmc-dialog/assets/index.css").default.toString();

  const el = document.createElement("style");
  el.innerHTML = css + css2;
  el.type = "text/css";
  // container.appendChild(el)
  shadow.appendChild(el);
  new Draggabilly(container, {
    // containment: true,
  });
  // 使用二维数组来存放多个 event 数组
  const eventsMatrix: Array<Array<eventWithTime>> = [[]];

  let defaultConfig = {
    pid: randomId(5),
    domain: "",
  };

  rrweb.record({
    recordLog: true,
    recordNetwork: true,
    emit(event, isCheckout) {
      // const eventsMatrix = eventsMatrixRef.current;
      // console.log("emit");
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
      // console.log(eventsMatrix);
    },
    checkoutEveryNms: 30 * 1000, // 每30秒重新制作快照
  });
  ReactDOM.render(
    <Tlor
      {...Object.assign({}, defaultConfig, config)}
      el={container}
      eventsMatrix={eventsMatrix}
    ></Tlor>,
    container
  );
};

export default Tlor;
