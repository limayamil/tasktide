import React, { useState } from 'react';
import { Button, Input, List, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './NoteTaking.css';

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
    notification.success({
      message: 'Nota eliminada'
    });
  };

  const toggleNoteContent = (note) => {
    setExpandedNote(expandedNote === note ? null : note);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold underline mb-10">Tidier Tasks</h1>
      <Input
        placeholder="Título de nota"
        value={newNoteTitle}
        onChange={(e) => {
          setNewNoteTitle(e.target.value);
          setIsContentVisible(true);  // Show content input when title is clicked or typed
        }}
        onBlur={() => {
          if (!newNoteTitle.trim()) {
            setIsContentVisible(false);  // Hide content input when title input loses focus and content is empty
          }
        }}
        style={{ marginBottom: '8px' }}
      />
      {isContentVisible && (
        <Input.TextArea
          placeholder="Contenido de la nota"
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
            className='bg-zinc-900 rounded-lg mt-5'
            actions={[
              <DeleteOutlined
                className='text-white'
                type="delete"
                onClick={() => handleDeleteNote(item)}
              />,
            ]}
          >
            <div style={{ width: '100%' }} className='text-left px-5'>
              <div className='text-white font-bold' onClick={() => toggleNoteContent(item)} style={{ cursor: 'pointer' }}>
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
