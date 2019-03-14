import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';

class Editor extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const handleChange = this.props.handleChange;
        const editorHtml = this.props.editorHtml;
        return (
            <div>
                <ReactQuill
                    theme={"snow"}
                    onChange={handleChange}
                    value={editorHtml}
                    modules={Editor.modules}
                    formats={Editor.formats}
                    bounds={'.app'}
                    placeholder={this.props.placeholder}
                />
            </div>
        )
    }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image', 'video'
];

/*
 * PropType validation
 */
Editor.propTypes = {
    placeholder: PropTypes.string,
};

export default Editor;