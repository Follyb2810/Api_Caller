import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';

const jsonRequestBody = document.querySelector('[data-json-request-body]');
const jsonResponseBody = document.querySelector('[data-json-response-body]');

export default function setupEditor() {
    // Define a simple set of extensions instead of using basicSetup
    const basicExtensions = [
        keymap.of([indentWithTab]),
        json(),
        EditorState.tabSize.of(2)
    ];

    const requestEditor = new EditorView({
        state: EditorState.create({
            doc: "{\n\t\n}",
            extensions: basicExtensions
        }),
        parent: jsonRequestBody
    });

    const responseEditor = new EditorView({
        state: EditorState.create({
            doc: "{}",
            extensions: [...basicExtensions, EditorView.editable.of(false)]
        }),
        parent: jsonResponseBody
    });

    function updateResponseEditor(value) {
        responseEditor.dispatch({
            changes: {
                from: 0,
                to: responseEditor.state.doc.length,
                insert: JSON.stringify(value, null, 2)
            }
        });
    }

    return { requestEditor, updateResponseEditor };
}

