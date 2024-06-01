import React, { useState } from 'react';
import { Button, Input, List } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const NoteTaking = () => {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [expandedNote, setExpandedNote] = useState(null);

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const updatedNotes = [...notes, { title: newNoteTitle, content: newNoteContent }];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsContentVisible(false);
    }
  };

  const handleDeleteNote = (note) => {
    const updatedNotes = notes.filter((n) => n !== note);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const toggleNoteContent = (note) => {
    setExpandedNote(expandedNote === note ? null : note);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold underline mb-10">Tasktide</h1>
      <Input
        placeholder="Note Title"
        value={newNoteTitle}
        onChange={(e) => {
          setNewNoteTitle(e.target.value);
          setIsContentVisible(true);  // Show content input when title is clicked or typed
        }}
        onBlur={() => {
          if (!newNoteContent.trim()) {
            setIsContentVisible(false);  // Hide content input when title input loses focus and content is empty
          }
        }}
        style={{ marginBottom: '8px' }}
      />
      {isContentVisible && (
        <Input.TextArea
          placeholder="Note Content"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          rows={4}
          style={{ marginBottom: '8px' }}
        />
      )}
      <Button type="primary" onClick={handleAddNote}>Añadir nota</Button>
      <List
        dataSource={notes}
        renderItem={(item) => (
          <List.Item
            actions={[
              <DeleteOutlined
                className='text-white absolute top-0 right-0'
                type="delete"
                onClick={() => handleDeleteNote(item)}
              />,
            ]}
          >
            <div style={{ width: '100%' }}>
              <div className='text-white' onClick={() => toggleNoteContent(item)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {item.title}
              </div>
              {expandedNote === item && (
                <div className='text-white mt-3 whitespace-pre-wrap'>
                  {item.content}
                </div>
              )}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NoteTaking;
