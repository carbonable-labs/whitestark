import { Content, JSONEditor, Mode, TextContent } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";
import { Grant } from "../Types";

interface Props {
  value: Grant[];
  onChange: React.Dispatch<React.SetStateAction<Grant[]>>;
}

/**
 * It is a React implementation of the vanilla-jsoneditor library.
 *
 * @see https://codesandbox.io/s/svelte-jsoneditor-react-59wxz  The official example of how using lib with React
 */

export default function JsonEditor(props: Props) {
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

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps({
        mode: Mode.text,
        content: { text: JSON.stringify(props.value, null, "\t") },
        onChange: (content: Content) =>
          handleChange(content as TextContent, props.onChange),
      });
    }
  }, [props]);

  function handleChange(
    libraryChange: TextContent,
    componentChange: Props["onChange"]
  ) {
    // check if content is formatted
    if (isJsonString(libraryChange.text)) {
      componentChange(JSON.parse(libraryChange.text));
    }
  }

  function isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  return <div className="vanilla-jsoneditor-react" ref={refContainer}></div>;
}
