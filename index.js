loadAllBooks()

function loadAllBooks(){

  fetch(' http://localhost:3000/library')
  .then(res => res.json())
  .then(data => displayLibraryList(data))
  .catch(error => console.error(error))
}

function displayLibraryList(array) {
   
  const listOfBooks = document.getElementById('library-list')

  listOfBooks.innerHTML = ""
  document.getElementById('Book-detail').hidden = true;

  array.forEach(blibrary => {
    const img = document.createElement('img')
    img.src = blibrary.image
    img.width =200 
    img.height= 250
    img.setAttribute('library-id', blibrary.id)
    img.addEventListener('click', showDetail)
    listOfBooks.appendChild(img)
  });
}

function showDetail(event) {
    const img = event.target
    const id = img.getAttribute('library-id')
    fetch(`http://localhost:3000/library/${id}`)
    .then(res => res.json())
    .then(data => {
      displayBookDetail(data)
    })
    .catch(error => console.error(error))
  }

  
function displayBookDetail(data) {
    document.querySelector('.title').textContent = data.title
    document.querySelector('.author').textContent = data.author
    document.querySelector('.publisher').textContent = data.publisher
    document.querySelector('.abstract').textContent = data.abstract
    
    document.getElementById('Book-detail').hidden = false;
    document.getElementById('deleteBtn').setAttribute('data-id', data.id)
    document.getElementById('deleteBtn').hidden = false;

  }

  function postBook(BookData) {
    
    fetch('http://localhost:3000/library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: "application/json"
        },
        body: JSON.stringify({
          "title": BookData.title.value,
          "author":BookData.author.value,
          "publisher":BookData.publisher.value,
          "image": BookData.image.value,
          "abstract":BookData.abstract.value,
          
        })
      })
      .then(res => res.json())
      .then((obj_book) => {

       let new_book = addNewBook(obj_book.id)
      })
  }
 
  const newbookForm = document.querySelector('#new-Book')

  newbookForm.addEventListener('submit', event => {
    event.preventDefault()
    postBook(event.target)
  newbookForm.reset()
  })

  function addNewBook(newid) {
     fetch(`http://localhost:3000/library/${newid}` )
      .then(res => res.json())
      .then(data => addnewBooktolist(data))
  }

  function addnewBooktolist (array){
    const listOfBooks = document.getElementById('library-list')
      const img = document.createElement('img')
      img.src = array.image
      img.width =200 
      img.height= 250
      img.setAttribute('library-id', array.id)
      img.addEventListener('click', showDetail)
      listOfBooks.appendChild(img)
  }



  const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function() {
    const searchInputValue = document.getElementById('searchInput').value;
    const searchTerm = searchInputValue; 
  

    fetch('http://localhost:3000/library')
      .then(response => response.json())
      .then(data => searchRes(data,searchTerm))
  })

function searchRes(jsonData, searchTerm){
    
  const searchResults = jsonData.filter(book => {
  return book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
});
 
const listOfBooks = document.getElementById('library-list')
listOfBooks.innerHTML = ""

document.getElementById('Book-detail').hidden = true;

displayLibraryList (searchResults)

  };


const deleteBtn = document.getElementById('deleteBtn');
deleteBtn.addEventListener('click', () => {

  const bookId =deleteBtn.getAttribute('data-id') ;
  fetch(`http://localhost:3000/library/${bookId}`, { method: 'DELETE' })
    .then(response => response.text())
    .then(message => {
      alert('Book deleted successfully');
      
      loadAllBooks()
    })
    .catch(error => {
      alert('Error deleting book');
      console.error(error);
    });
    
    
});