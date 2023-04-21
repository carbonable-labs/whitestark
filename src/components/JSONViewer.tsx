import { JSONContent, JSONEditor, JSONValue } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { MerkleTree } from "../types";

const downloadButton = require("../images/download.png");

interface Props {
  loading: boolean;
  value: MerkleTree;
}

/**
 * It is a React implementation of the vanilla-jsoneditor library.
 *
 * @see https://codesandbox.io/s/svelte-jsoneditor-react-59wxz  The official example of how using lib with React
 */

export default function JsonViewer(props: Props) {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current as Element,
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

  const update = () => {
    const right = document.getElementById("jsoneditor-right");
    refEditor.current?.update({ json: props.value as JSONValue });
    right?.classList.remove("editor-container-computing");
  };

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps({
        readOnly: true,
      });
    }

    update();
  }, [props.value]);

  useEffect(() => {
    addDownloadButton();
  }, []);

  const download = function () {
    const json = JSON.stringify(
      (refEditor.current?.get() as JSONContent).json,
      null,
      4
    );
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
      className={classNames("vanilla-jsoneditor-react", {
        "vanilla-jsoneditor-react-loading": props.loading,
      })}
      ref={refContainer}
    />
  );
}
