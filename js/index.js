// create the editor
const left = document.getElementById("jsoneditor-left")
const right = document.getElementById("jsoneditor-right")

// set json
const initialJson = [
    {
        "address": "0x208555013ffe57ce0f78be91ce8b368eba6645a52bb90fed2c427617d619d03",
        "quantity": 5,
    },
    {
        "address": "0x009d02bAA050B9e8F3eb98fF0FA1eDe8e1b20D65CEae9f05E018b4d8dA3E4b7f",
        "quantity": 1,
    }
]

const update = async function () {
    try {
        right.classList.add("editor-container--computing")
        const data = backend.run(editor.get())
        view.set(data);
        right.classList.remove("editor-container--computing")
        view.expandAll();
    } catch (error) { }
}

const download = function () {
    update();
    const json = JSON.stringify(view.get(), null, 4);
    const data = new Blob([json], { type: 'text/plain' });
    return window.URL.createObjectURL(data);
}

const backend = whitelist;
const view = new JSONEditor(right, { mode: "view" })
const editor = new JSONEditor(left, {
    mode: "code",
}, initialJson)

update()

// compute button
const buttonUpdate = document.createElement('button');
buttonUpdate.type = 'button';
buttonUpdate.className = 'jsoneditor-update';
buttonUpdate.title = 'Update';
buttonUpdate.onclick = function () { update(); }

// download button
const buttonDownload = document.createElement('a');
buttonDownload.className = 'jsoneditor-download';
buttonDownload.title = 'Download';
buttonDownload.addEventListener('click', function () {
    console.log("dl");
    const link = download();
    console.log(link);
    buttonDownload.setAttribute('download', 'output.json');
    buttonDownload.href = link;
})

// add buttons to menu
const jsonEditorMenu = right.querySelector('.jsoneditor-menu');
jsonEditorMenu.appendChild(buttonUpdate)
jsonEditorMenu.appendChild(buttonDownload)