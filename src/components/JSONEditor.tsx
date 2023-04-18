import { JSONEditor, JSONEditorPropsOptional } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";

export default function SvelteJSONEditor(props: JSONEditorPropsOptional) {
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
  }, [props]);

  return <div className="vanilla-jsoneditor-react" ref={refContainer}></div>;
}
