import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import BookService from '../../Services/BookService'; // Assuming you have a BookService similar to UserService
import { showToastSuccess, showToastError, showToastDeleteConfirmation } from '../../core/utils/Toasts'; // Adjust the import path as needed
import { toast } from 'react-toastify';

const AddBookModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [summary, setSummary] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTitle('');
    setAuthor('');
    setGenre('');
    setSummary('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newBook = {
        title: title,
        author: author,
        genre: genre,
        summary: summary,
      };
      await BookService.createBook(newBook);
      showToastSuccess('Book added successfully');
      closeModal();
    } catch (error) {
      console.error('Error adding book:', error);
      showToastError('Failed to add book' + error);
    }
  };

  const handleDeleteConfirmation = (id: number, name: string) => {
    showToastDeleteConfirmation(id, name, async () => {
      try {
        await BookService.deleteBook(id);
        showToastSuccess('Book deleted successfully');
      } catch (error) {
        showToastError('Failed to delete book');
      }
    });
  };

  return (
    <div>
      <button onClick={openModal} className="bg-purple-700 text-white px-4 py-2 rounded mb-4">
        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Book
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
           <div className="bg-white rounded-lg w-[60vh]  shadow-2xl p-6 ml-20 border-4">
          <h2 className="text-2xl mb-4 text-center font-bold text-gray-800">Add Book</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
            </div>
            <div className="mb-4">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input type="text" id="author" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
            </div>
            <div className="mb-4">
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <input type="text" id="genre" name="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
            </div>
            <div className="mb-4">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
              <textarea id="summary" name="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded mr-2">Add</button>
              <button type="button" onClick={closeModal} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">Cancel</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddBookModal;
