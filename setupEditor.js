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

// import { EditorState } from '@codemirror/state';
// import { EditorView } from '@codemirror/view';
// import { keymap } from '@codemirror/view';
// import { defaultTabBinding } from '@codemirror/commands';
// import { json } from '@codemirror/lang-json';
// import { basicSetup } from 'codemirror';

// const jsonRequestBody = document.querySelector('[data-json-request-body]');
// const jsonResponseBody = document.querySelector('[data-json-response-body]');

// export default function setupEditor() {
//     const basicExtensions = [
//         basicSetup,
//         keymap.of([defaultTabBinding]),
//         json(),
//         EditorState.tabSize.of(2)
//     ];

//     const requestEditor = new EditorView({
//         state: EditorState.create({
//             doc: "{\n\t\n}",
//             extensions: basicExtensions
//         }),
//         parent: jsonRequestBody
//     });

//     const responseEditor = new EditorView({
//         state: EditorState.create({
//             doc: "{}",
//             extensions: [...basicExtensions, EditorView.editable.of(false)]
//         }),
//         parent: jsonResponseBody
//     });

//     function updateResponseEditor(value) {
//         responseEditor.dispatch({
//             changes: {
//                 from: 0,
//                 to: responseEditor.state.doc.length,
//                 insert: JSON.stringify(value, null, 2)
//             }
//         });
//     }

//     return { requestEditor, updateResponseEditor };
// }

// import { keymap } from '@codemirror/view';
// import { defaultTabBinding } from '@codemirror/commands';
// import { json } from '@codemirror/lang-json';
// import { EditorState } from '@codemirror/state';
// import { EditorView, basicSetup } from "codemirror";

// const jsonRequestBody = document.querySelector('[data-json-request-body]');
// const jsonResponseBody = document.querySelector('[data-json-response-body]');

// export default function setupEditor() {
//     const basicExtensions = [
//         basicSetup,
//         keymap.of([defaultTabBinding]),
//         json(),
//         EditorState.tabSize.of(2)
//     ];

//     const requestEditor = new EditorView({
//         state: EditorState.create({
//             doc: "{\n\t\n}",
//             extensions: basicExtensions
//         }),
//         parent: jsonRequestBody
//     });

//     const responseEditor = new EditorView({
//         state: EditorState.create({
//             doc: "{}",
//             extensions: [...basicExtensions, EditorView.editable.of(false)]
//         }),
//         parent: jsonResponseBody
//     });

//     function updateResponseEditor(value) {
//         responseEditor.dispatch({
//             changes: {
//                 from: 0,
//                 to: responseEditor.state.doc.length,
//                 insert: JSON.stringify(value, null, 2)
//             }
//         });
//     }

//     return { requestEditor, updateResponseEditor };
// }

// // import { EditorState ,} from '@codemirror/state';
// import {  keymap } from '@codemirror/view';
// //! import { EditorView, keymap } from '@codemirror/view';
// // import { basicSetup } from '@codemirror/basic-setup';
// import { defaultTabBinding } from '@codemirror/commands';
// // import {defaultKeymap} from "@codemirror/commands"
// import { json } from '@codemirror/lang-json';
// import { EditorState } from '@codemirror/basic-setup';
// //! import { EditorState, basicSetup } from '@codemirror/basic-setup';
// import {EditorView, basicSetup} from "codemirror"

// const jsonRequestBody = document.querySelector('[data-json-request-body]');
// const jsonResponseBody = document.querySelector('[data-json-response-body]');

// export default function setupEditor() {
//     const basicExtensions = [
//         basicSetup,
//         // keymap.of([defaultKeymap]),
//         keymap.of([defaultTabBinding]),
//         json(),
//         EditorState.tabSize.of(2)
//     ];

//     const requestEditor = new EditorView({
//         state: EditorState.create({
//             doc: "{\n\t\n}",
//             extensions: basicExtensions
//         }),
//         parent: jsonRequestBody
//     });

//     const responseEditor = new EditorView({
//         state: EditorState.create({
//             doc: "{}",
//             extensions: [...basicExtensions, EditorView.editable.of(false)]
//         }),
//         parent: jsonResponseBody
//     });

//     function updateResponseEditor(value) {
//         responseEditor.dispatch({
//             changes: {
//                 from: 0,
//                 to: responseEditor.state.doc.length,
//                 insert: JSON.stringify(value, null, 2)
//             }
//         });
//     }

//     return { requestEditor, updateResponseEditor };
// }
