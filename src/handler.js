const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString(); // Use insertedAt instead of createdAt
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;


  const newBook = { 
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    reading, 
    finished, 
    id, 
    insertedAt, 
    updatedAt, 
  };
  books.push(newBook);


  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, finished, reading } = request.query;
  
  let filteredBooks = books;

  // Filter by name (e.g., "Dicoding")
  if (name) {
    filteredBooks = filteredBooks.filter(book => book.name && book.name.includes(name));
  }

  // Filter by finished status
  if (finished !== undefined) {
    const isFinished = finished === '1'; // Expecting '1' for finished, '0' for unfinished
    filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
  }

  // Filter by reading status
  if (reading !== undefined) {
    const isReading = reading === '1'; // Expecting '1' for reading, '0' for not reading
    filteredBooks = filteredBooks.filter(book => book.reading === isReading);
  }

  const mappedBooks = filteredBooks.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: mappedBooks,
    },
  }).code(200);
};




const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }
  
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }
  
  
  const index = books.findIndex((book) => book.id === id);
  
  if (index !== -1) {
    
    books[index] = {
      id,  
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      insertedAt: books[index].insertedAt, 
      updatedAt,  
    };
    
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { 
  addBookHandler, 
  getAllBooksHandler, 
  getBookByIdHandler, 
  editBookByIdHandler, 
  deleteBookByIdHandler 
};
