import { JSONEditor, JSONEditorPropsOptional } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";
import { whitelist } from "../merkletree/whitelist";

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

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }

    update();

    addDownloadButton();
  }, [props]);

  const right = document.getElementById("jsoneditor-right");

  const backend = whitelist;

  const update = async function () {
    try {
      right?.classList.add("editor-container-computing");
      // eslint-disable-next-line react/prop-types
      const jsonObject = JSON.parse(props.initialJson.text);
      const data = backend.run(jsonObject);

      const newData = {
        text: undefined,
        json: data,
      };
      refEditor.current?.set(newData);
      right?.classList.remove("editor-container--computing");
    } catch (error) {
      console.log(error);
    }
  };

  const download = function () {
    const json = JSON.stringify(refEditor.current?.get(), null, 4);
    const data = new Blob([json], { type: "text/plain" });
    return window.URL.createObjectURL(data);
  };

  // download button
  const buttonDownload = document.createElement("a");
  buttonDownload.className = "jse-button jse-download";
  buttonDownload.title = "Download";
  buttonDownload.textContent = "Download";
  buttonDownload.addEventListener("click", function () {
    const link = download();
    buttonDownload.setAttribute("download", "output.json");
    buttonDownload.href = link;
  });

  // add buttons to menu
  function addDownloadButton() {
    setTimeout(() => {
      const jsonEditorMenu = right?.querySelector(".jse-menu");
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
