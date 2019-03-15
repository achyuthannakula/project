import React from 'react';
import 'react-quill/dist/quill.snow.css';

export default function(props){
    console.log(props);
    return  <div dangerouslySetInnerHTML={{__html: props.editorHtml}}/>;
}
