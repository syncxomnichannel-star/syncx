import React, { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

interface EditableTextProps {
  textKey: string;
  defaultText: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div';
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  textKey,
  defaultText,
  as: Component = 'span',
  className = '',
  inputClassName = '',
  multiline = false
}) => {
  const { editMode, getText, updateText } = useCustomization();
  const value = getText(textKey, defaultText);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateText(textKey, draft.trim() ? draft : defaultText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setDraft(value);
      setIsEditing(false);
    }
  };

  if (!editMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`w-full p-2 text-sm bg-white border-2 border-indigo-500 rounded-lg shadow-sm focus:outline-none ${inputClassName}`}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`px-2 py-0.5 text-inherit font-inherit bg-white border-2 border-indigo-500 rounded-md shadow-sm focus:outline-none ${inputClassName}`}
      />
    );
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      title="Click to edit text"
      className={`group relative cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-indigo-400 hover:outline-offset-2 rounded transition-all inline-block ${className}`}
    >
      {value}
      <span className="opacity-0 group-hover:opacity-100 inline-block ml-1.5 transition-opacity align-middle text-indigo-500">
        <Pencil className="w-3 h-3 inline" />
      </span>
    </Component>
  );
};
