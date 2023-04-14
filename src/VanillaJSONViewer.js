import { JSONEditor } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";
import { whitelist } from "./merkletree/whitelist";

export default function SvelteJSONEditor(props) {
  const refContainer = useRef(null);
  const refEditor = useRef(null);

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
      right.classList.add("editor-container--computing");
      // eslint-disable-next-line react/prop-types
      let data = backend.run(props.innitialJson.json);

      const newData = {
        text: undefined,
        json: data,
      };
      refEditor.current.set(newData);
      right.classList.remove("editor-container--computing");
    } catch (error) {
      console.log(error);
    }
  };

  // compute button
  const buttonUpdate = document.createElement("button");
  buttonUpdate.type = "button";
  buttonUpdate.className = "jse-update";
  buttonUpdate.title = "Update";
  buttonUpdate.textContent = "Update";
  buttonUpdate.onclick = function () {
    update();
  };

  const download = function () {
    const json = JSON.stringify(refEditor.current.get(), null, 4);
    const data = new Blob([json], { type: "text/plain" });
    return window.URL.createObjectURL(data);
  };

  // download button
  const buttonDownload = document.createElement("a");
  buttonDownload.className = "jse-download";
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
    if (right) {
      const jsonEditorMenu = right.querySelector(".jse-menu");
      jsonEditorMenu.appendChild(buttonUpdate);
      jsonEditorMenu.appendChild(buttonDownload);
      console.log("add btn");
    }
  }, [right]);

  return (
    <div
      className="vanilla-jsoneditor-react jsoneditor-right"
      ref={refContainer}
    ></div>
  );
}
