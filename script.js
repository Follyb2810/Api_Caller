

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import prettyBytes from 'pretty-bytes'
import setupEditor from './setupEditor'


const form = document.querySelector('[data-form]')
const queryParamsContainer = document.querySelector('[data-query-params]')
const requestHeadersContainer = document.querySelector('[data-request-headers]')
const jsonContainer = document.querySelector('[data-json-request-body]')
const keyValueTemplate = document.querySelector('[data-key-value-template]')
const addQueryParamsBtn = document.querySelector('[data-add-query-param-btn]')
const addRequestHeadersBtn = document.querySelector('[data-add-request-headers-btn]')
const dataResponseSection = document.querySelector('[data-response-section]')
const ResponseHeaderContainer = document.querySelector('[data-response-headers]')
const ResponseStatus = document.querySelector('[data-status]')
const ResponseTime = document.querySelector('[data-time]')
const ResponseSize = document.querySelector('[data-size]')
const multipartFieldsContainer = document.querySelector('[data-multipart-fields]');
const addMultipartFieldBtn = document.querySelector('[data-add-multipart-field]');
const multipartFieldTemplate = document.querySelector('[data-multipart-field-template]');

addMultipartFieldBtn.addEventListener('click', () => {
    multipartFieldsContainer.append(createMultipartField());
});

addQueryParamsBtn.addEventListener('click',(e)=>{
    queryParamsContainer.append(CreateKeyValuePair())
})
addRequestHeadersBtn.addEventListener('click',(e)=>{
    requestHeadersContainer.append(CreateKeyValuePair())
})

function createMultipartField() {
    const element = multipartFieldTemplate.content.cloneNode(true);
    const fieldTypeSelect = element.querySelector('[data-field-type]');
    const fileInput = element.querySelector('[data-file]');
    const textInput = element.querySelector('[data-text]');

    fieldTypeSelect.addEventListener('change', () => {
        if (fieldTypeSelect.value === 'file') {
            fileInput.classList.remove('d-none');
            textInput.classList.add('d-none');
        } else {
            fileInput.classList.add('d-none');
            textInput.classList.remove('d-none');
        }
    });

    element.querySelector('[data-remove-btn]').addEventListener('click', (e) => {
        e.target.closest('[data-multipart-field]').remove();
    });

    return element;
}

axios.interceptors.request.use(request =>{
    request.customData = request.customData ||{}
    request.customData.startTime = new Date().getTime()
    return request  
})

function updateEndTime(response){
    response.customData = response.customData || {}
    response.customData.time = new Date().getTime() - response.config.customData.startTime
    return response
}
axios.interceptors.response.use(updateEndTime,e=>{
   return Promise.reject(updateEndTime(e.response))
})

const {requestEditor,updateResponseEditor} = setupEditor()

// form.addEventListener('submit',(e)=>{
//     e.preventDefault()
    
//     const formData = new FormData();

//     // Add multipart fields to FormData
//     multipartFieldsContainer.querySelectorAll('[data-multipart-field]').forEach(field => {
//         const key = field.querySelector('[data-key]').value;
//         const fieldType = field.querySelector('[data-field-type]').value;

//         if (fieldType === 'file') {
//             const file = field.querySelector('[data-file]').files[0];
//             if (file) formData.append(key, file);
//         } else {
//             const text = field.querySelector('[data-text]').value;
//             if (text) formData.append(key, text);
//         }
//     });

//     // Add query params and headers
//     const params = keyValuePairsToObject(queryParamsContainer);
//     const headers = keyValuePairsToObject(requestHeadersContainer);
    
//     let data;
//     try {
//         data  = JSON.parse(requestEditor.state.doc.toString() || null)
//     } catch (error) {
//         alert('json data is malforme')
//         return
//     }
//     axios({
//         url:document.querySelector('[data-url]').value,
//         method:document.querySelector('[data-method]').value,
//         params,
//         headers,
//         data,
//     })
//     .catch((e)=>e)
//     .then((response)=>{
//         dataResponseSection.classList.remove('d-none')
//         updateResponseDetails(response)
//         updateResponseEditor(response.data)
//         updateResponseHeaders(response.headers)
//         console.log(response)
//     })
// })
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData();
    let isMultipart = false;

    // Handle Multipart Fields
    multipartFieldsContainer.querySelectorAll('[data-multipart-field]').forEach(field => {
        const key = field.querySelector('[data-key]').value;
        const fieldType = field.querySelector('[data-field-type]').value;

        if (fieldType === 'file') {
            const file = field.querySelector('[data-file]').files[0];
            console.log(file)
            if (file) {
                formData.append(key, file);
                isMultipart = true;
            }
        } else {
            const text = field.querySelector('[data-text]').value;
            if (text) {
                formData.append(key, text);
                isMultipart = true;
            }
        }
    });

    // Convert query params & headers
    const params = keyValuePairsToObject(queryParamsContainer);
    const headers = keyValuePairsToObject(requestHeadersContainer);

    // Prepare JSON data
    let jsonData = null;
    try {
        jsonData = JSON.parse(requestEditor.state.doc.toString() || '{}');
    } catch (error) {
        alert('Malformed JSON data');
        return;
    }

    // Set content type only if JSON data exists and it's not multipart
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }

    // Make Axios Request
    axios({
        url: document.querySelector('[data-url]').value,
        method: document.querySelector('[data-method]').value,
        params,
        headers,
        data: isMultipart ? formData : jsonData,
    })
    .catch((e) => e)
    .then((response) => {
        dataResponseSection.classList.remove('d-none');
        updateResponseDetails(response);
        updateResponseEditor(response.data);
        updateResponseHeaders(response.headers);
        console.log(response);
    });
});


function updateResponseDetails(response){
    ResponseStatus.textContent = response.status
    ResponseTime.textContent = response.customData.time
    ResponseSize.textContent = prettyBytes(JSON.stringify(response.data).length + JSON.stringify(response.headers).length)
}

function updateResponseHeaders(headers){
    ResponseHeaderContainer.innerHTML = ''
    Object.entries(headers).forEach(([key,value])=>{
        const keyElement = document.createElement('div')
        keyElement.textContent = key;
        ResponseHeaderContainer.append(keyElement)
        const valueElement = document.createElement('div')
        valueElement.textContent = value;
        ResponseHeaderContainer.append(valueElement)
    })
}

function keyValuePairsToObject(container){
    const pairs = container.querySelectorAll('[data-key-value-pair]')
    console.log(pairs,'pairs')
    return [...pairs].reduce((data,pair)=>{
        const key = pair.querySelector('[data-key]').value       
        const value = pair.querySelector('[data-value]').value
        console.log(key,'key')
        console.log(value,'value')
        console.log(data,'data')
        if(key == '') return data;
        return {...data,[key]:value}       
    },{})
}

function CreateKeyValuePair(){
    const element = keyValueTemplate.content.cloneNode(true)
    element.querySelector('[data-remove-btn]').addEventListener('click',(e)=>{
        e.target.closest('[data-key-value-pair]').remove()
    })
    return element;
}
queryParamsContainer.append(CreateKeyValuePair())
requestHeadersContainer.append(CreateKeyValuePair())