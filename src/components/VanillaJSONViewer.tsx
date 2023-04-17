import { JSONEditor } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";
import { whitelist } from "../merkletree/whitelist";

export default function SvelteJSONEditor(props: any) {
  const refContainer = useRef<any>(null);
  const refEditor = useRef<any>(null);

  useEffect(() => {
    // create editor
    console.log("create editor", refContainer.current);
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {},
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        console.log("destroy editor");
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      console.log("update props", props);
      refEditor.current.updateProps(props);
    }

    update();
  }, [props]);

  const right = document.getElementById("jsoneditor-right");

  const backend = whitelist;

  const update = async function () {
    try {
      right?.classList.add("editor-container--computing");
      // eslint-disable-next-line react/prop-types
      const jsonObject = props.innitialJson.json
        ? props.innitialJson.json
        : JSON.parse(props.innitialJson.text);
      const data = backend.run(jsonObject);

      const newData = {
        text: undefined,
        json: data,
      };
      refEditor.current.set(newData);
      right?.classList.remove("editor-container--computing");
    } catch (error) {
      console.log(error);
    }
  };

  const download = function () {
    const json = JSON.stringify(refEditor.current.get().json, null, 4);
    const data = new Blob([json], { type: "text/plain" });
    return window.URL.createObjectURL(data);
  };

  // download button
  const buttonDownload = document.createElement("a");
  buttonDownload.className = "jse-button jse-download";
  buttonDownload.title = "Download";
  buttonDownload.textContent = "Download";
  buttonDownload.addEventListener("click", function () {
    console.log("dl");
    const link = download();
    console.log(link);
    buttonDownload.setAttribute("download", "output.json");
    buttonDownload.href = link;
  });

  // add buttons to menu
  useEffect(() => {
    setTimeout(() => {
      if (right) {
        const jsonEditorMenu = right.querySelector(".jse-menu");
        const jsonMenuSearch = jsonEditorMenu?.querySelector(".jse-search");
        jsonMenuSearch?.after(buttonDownload);
      }
    }, 1);
  }, [right, props]);

  return (
    <div
      className="vanilla-jsoneditor-react jsoneditor-right"
      ref={refContainer}
    ></div>
  );
}
