import React, { useState } from 'react';
import { Button, Input, List, notification, Checkbox } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import './NoteTaking.css';

const NoteTaking = () => {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [expandedNote, setExpandedNote] = useState(null);
  const [editNote, setEditNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const updatedNotes = [...notes, { title: newNoteTitle, content: newNoteContent, completed: false }];
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

  const handleEditNote = (note) => {
    setEditNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    const updatedNotes = notes.map((note) =>
      note === editNote ? { ...note, title: editTitle, content: editContent } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setEditNote(null);
    setEditTitle('');
    setEditContent('');
    notification.success({
      message: 'Nota actualizada'
    });
  };

  const handleCancelEdit = () => {
    setEditNote(null);
    setEditTitle('');
    setEditContent('');
  };

  const toggleNoteContent = (note) => {
    setExpandedNote(expandedNote === note ? null : note);
  };

  const toggleNoteCompletion = (note) => {
    const updatedNotes = notes.map((n) =>
      n === note ? { ...n, completed: !n.completed } : n
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const completedCount = notes.filter(note => note.completed).length;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">📖✍️</h1>
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
            actions={
              editNote === item ? [] : [
                <EditOutlined
                  className='text-white'
                  onClick={() => handleEditNote(item)}
                />,
                <DeleteOutlined
                  className='text-white'
                  onClick={() => handleDeleteNote(item)}
                />,
              ]
            }
          >
            {editNote === item ? (
              <div style={{ width: '100%' }} className='text-left px-5'>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ marginBottom: '8px' }}
                />
                <Input.TextArea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  style={{ marginBottom: '8px' }}
                />
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveEdit} style={{ marginRight: '8px' }}>
                  Guardar
                </Button>
                <Button type="default" icon={<CloseOutlined />} onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div style={{ width: '100%' }} className='text-left px-5'>
                <div className="flex">
                <Checkbox
                  checked={item.completed}
                  onChange={() => toggleNoteCompletion(item)}
                  style={{ marginRight: '8px' }}
                />
                <div className='text-white font-bold' onClick={() => toggleNoteContent(item)} style={{ cursor: 'pointer', textDecoration: item.completed ? 'line-through' : 'none' }}>
                  {item.title}
                </div>
                </div>
                {expandedNote === item && (
                  <div className='text-white mt-3 whitespace-pre-wrap'>
                    {item.content}
                  </div>
                )}
              </div>
            )}
          </List.Item>
        )}
      />
      <div className="text-white mt-5">
        Notas completadas: {completedCount}
      </div>
    </div>
  );
};

export default NoteTaking;