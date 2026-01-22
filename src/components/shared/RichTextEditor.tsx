import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <div className={`rich-text-editor ${className || ''}`}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                modules={modules}
                formats={formats}
                className="bg-background text-foreground"
            />
            <style>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: hsl(var(--input)) !important;
          background-color: hsl(var(--background));
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: hsl(var(--input)) !important;
          background-color: hsl(var(--background));
          min-height: 150px;
        }
        .ql-editor {
          min-height: 150px;
        }
        .ql-stroke {
          stroke: hsl(var(--foreground)) !important;
        }
        .ql-fill {
          fill: hsl(var(--foreground)) !important;
        }
        .ql-picker {
          color: hsl(var(--foreground)) !important;
        }
      `}</style>
        </div>
    );
};
