const { nanoid } = require ('nanoid');
const books = require ('./books');

//Add book baru =================================================
const addBookHandler = (request, h) => {
    const { name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading } = request.payload;

            const id = nanoid(16);
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;
            const finished = (pageCount === readPage);
            const newBook = {
                id,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                insertedAt,
                updatedAt,
            };

    //Respons Gagal (400) jika Client tidak melampirkan Name pada request body.
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    };
    //Response 400 jika readpage > pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    };

    
    books.push(newBook); 
    const isSuccess = books.filter((book)=> book.id === id).length > 0;

    //Success (201)
    if (isSuccess) {
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

    //Response 500 (generic error) 
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;

};
    

//Menampilkan Seluruh Buku / Get All 
const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books:books.map((book)=> ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
    },
});

//Menampilkan buku sesuai Id / getbyId
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((n) => n.id === id)[0];

    //buku ditemukan sesuai ID
    if(book !== undefined){
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    //buku not found (404)
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;

};

//Mengedit buku yang sudah ada sesuai Id
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading } = request.payload;
    const updatedAt = new Date().toISOString();
    
    //finished jika pageCount === readPage
    const finished = (pageCount === readPage);

    //Tidak ada name pada request body (400)
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    };

    //readpage > pageCount (400)
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount.',
        });
        response.code(400);
        return response;
    };

    const index = books.findIndex((book) => book.id === id);

    //berhasil diperbarui
    if(index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt,
            };
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });
            response.code(200);
            return response;
    }

    //Id not found (404)
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response; 
};

//Menghapus Buku sesuai Id
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id); //find delete index by id

    //====buku berhasil dihapus====
    if (index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
        }
    //====buku gagal dihapus====
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

