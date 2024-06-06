import React, { useState, useEffect } from 'react';
import { Button, Input, List, Modal, notification, Checkbox } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import './NoteTaking.css';
import dayjs from 'dayjs';

const SortableItem = ({ item, index, handleEditNote, handleDeleteNote, toggleNoteContent, expandedNote, editNote, editTitle, setEditTitle, editContent, setEditContent, handleSaveEdit, handleCancelEdit, toggleNoteCompletion }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <List.Item
      ref={setNodeRef}
      style={style}
      onClick={() => toggleNoteContent(item)}
      {...attributes}
      {...listeners}
      className='bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg mt-5 note-item'
      actions={
        editNote === item ? [] : [
          <div className='flex absolute right-100 -top-1 content-center'>
          <EditOutlined
            className='text-white note-item-actions ml-5'
            onClick={() => handleEditNote(item)}
          />
          <DeleteOutlined
            className='text-white note-item-actions ml-5'
            onClick={() => handleDeleteNote(item)}
          /></div>
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
          <div className="flex items-center">
            <Checkbox
              checked={item.completed}
              onChange={() => toggleNoteCompletion(item)}
              style={{ marginRight: '8px' }}
            />
            <div className='text-white font-bold'  style={{ cursor: 'pointer', textDecoration: item.completed ? 'line-through' : 'none' }}>
              {item.title}
            </div>
            {expandedNote === item ? <UpOutlined className='ml-2 text-zinc-500' /> : <DownOutlined className='ml-2 text-zinc-500' />}
          </div>
          {expandedNote === item && (
            <div className='text-white mt-3 whitespace-pre-wrap'>
              {item.content}
            </div>
          )}
        </div>
      )}
    </List.Item>
  );
};

const NoteTaking = () => {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedNote, setExpandedNote] = useState(null);
  const [editNote, setEditNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [completedNotes, setCompletedNotes] = useState(0);

  useEffect(() => {
    const countCompletedNotes = () => {
      const today = dayjs().startOf('day');
      const completedCount = notes.reduce((count, note) => {
        const noteCompletedDate = note.completedDate ? dayjs(note.completedDate) : null;
        if (note.completed && noteCompletedDate && noteCompletedDate.isSame(today, 'day')) {
          return count + 1;
        }
        return count;
      }, 0);
      setCompletedNotes(completedCount);
    };

    countCompletedNotes();
  }, [notes]);

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const updatedNotes = [...notes, { title: newNoteTitle, content: newNoteContent, completed: false }];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsModalVisible(false);
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
    const today = dayjs().startOf('day');
    const updatedNotes = notes.map((n) =>
      n === note ? { ...n, completed: !n.completed, completedDate: !n.completed ? today.toISOString() : null } : n
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = active.id;
      const newIndex = over.id;
      const updatedNotes = arrayMove(notes, oldIndex, newIndex);
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">📖✍️</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={notes.map((_, index) => index)}>
          <List
            dataSource={notes}
            renderItem={(item, index) => (
              <SortableItem
                key={`item-${index}`}
                index={index}
                item={item}
                handleEditNote={handleEditNote}
                handleDeleteNote={handleDeleteNote}
                toggleNoteContent={toggleNoteContent}
                expandedNote={expandedNote}
                editNote={editNote}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editContent={editContent}
                setEditContent={setEditContent}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                toggleNoteCompletion={toggleNoteCompletion}
              />
            )}
          />
        </SortableContext>
      </DndContext>
      <div className="text-white mt-5 fixed text-right bottom-5 left-10 w-100">
        <p>Notas completadas hoy: {completedNotes}</p>
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        onClick={() => setIsModalVisible(true)}
        style={{ position: 'fixed', bottom: '16px', right: '16px' }}
      />
      <Modal
        title="Añadir nueva nota"
        visible={isModalVisible}
        onOk={handleAddNote}
        onCancel={() => setIsModalVisible(false)}
        okText="Añadir"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Título de nota"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          style={{ marginBottom: '8px' }}
        />
        <Input.TextArea
          placeholder="Contenido de la nota"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default NoteTaking;
