import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Write your content here...'
}) => {
    // Create a controlled component with internal state
    const [editorValue, setEditorValue] = useState(value);

    // Update internal state when props change (for reset/init)
    useEffect(() => {
        setEditorValue(value);
    }, [value]);

    // Handle changes from the editor
    const handleChange = (content: string) => {
        setEditorValue(content);
        onChange(content);
    };

    // Define the modules/format options
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ]
    };

    return (
        <div className="rich-text-editor">
            <ReactQuill
                value={editorValue}
                onChange={handleChange}
                modules={modules}
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;