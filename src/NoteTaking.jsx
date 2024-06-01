import React, { useState } from 'react';
import { Button, Input, List } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const NoteTaking = () => {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [expandedNote, setExpandedNote] = useState(null);

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const updatedNotes = [...notes, { title: newNoteTitle, content: newNoteContent }];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNewNoteTitle('');
      setNewNoteContent('');
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
      <h1>Tasktide</h1>
      <Input
        placeholder="Note Title"
        value={newNoteTitle}
        onChange={(e) => setNewNoteTitle(e.target.value)}
        style={{ marginBottom: '8px' }}
      />
      <Input.TextArea
        placeholder="Note Content"
        value={newNoteContent}
        onChange={(e) => setNewNoteContent(e.target.value)}
        rows={4}
        style={{ marginBottom: '8px' }}
      />
      <Button type="primary" onClick={handleAddNote}>Add Note</Button>
      <List
        dataSource={notes}
        renderItem={(item) => (
          <List.Item
            actions={[
              <DeleteOutlined
                type="delete"
                onClick={() => handleDeleteNote(item)}
              />,
            ]}
          >
            <div style={{ width: '100%' }}>
              <div onClick={() => toggleNoteContent(item)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {item.title}
              </div>
              {expandedNote === item && (
                <div style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
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
