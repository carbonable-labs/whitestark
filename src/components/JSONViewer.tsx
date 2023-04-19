import { JSONEditor, JSONEditorPropsOptional } from "vanilla-jsoneditor";
import { useEffect, useRef, useCallback } from "react";
import { whitelist } from "../merkletree/whitelist";
const downloadButton = require("../images/download.png");

interface propsType extends JSONEditorPropsOptional {
  initialJson: any;
}

export default function SvelteJSONEditor(props: propsType) {
  const refContainer = useRef<any>(null);
  const refEditor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {},
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  const right = document.getElementById("jsoneditor-right");

  const backend = whitelist;

  const update = useCallback(async () => {
    try {
      right?.classList.add("editor-container-computing");
      const jsonObject = JSON.parse(props.initialJson.text);
      const data = await backend.run(jsonObject);

      const newData = {
        text: undefined,
        json: data,
      };
      refEditor.current?.set(newData);
      right?.classList.remove("editor-container-computing");

      addDownloadButton();
    } catch (error) {
      console.log(error);
    }
  }, [props.initialJson]);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }

    update();
  }, [update]);

  const download = function () {
    const json = JSON.stringify(refEditor.current?.get(), null, 4);
    const data = new Blob([json], { type: "text/plain" });
    return window.URL.createObjectURL(data);
  };

  // download button
  const buttonDownload = document.createElement("a");
  buttonDownload.className = "jse-button jse-download";
  buttonDownload.title = "Download";
  buttonDownload.innerHTML = `<img src="${downloadButton}" alt="download" />`;
  buttonDownload.addEventListener("click", function () {
    const link = download();
    buttonDownload.setAttribute("download", "output.json");
    buttonDownload.href = link;
  });

  // add buttons to menu
  function addDownloadButton() {
    setTimeout(() => {
      const jsonEditorMenu = document.querySelectorAll(".jse-menu")[1];
      const jsonMenuSearch = jsonEditorMenu?.querySelector(".jse-search");
      jsonMenuSearch?.after(buttonDownload);
    }, 1);
  }

  return (
    <div
      className="vanilla-jsoneditor-react jsoneditor-right"
      ref={refContainer}
    ></div>
  );
}
