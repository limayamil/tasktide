
import React, { useState } from 'react';
import { Button, Input, List } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const NoteTaking = () =>
 {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes
 = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNewNote('');
    }
  };

  const handleDeleteNote = (note) => {
    const updatedNotes = notes.filter((n) => n !== note);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  return (
    <div>
      <h1>Note Taking App</h1>
      <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
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
            {item}
          </List.Item>
        )}
      />
    </div>
  );
};

export default NoteTaking;
