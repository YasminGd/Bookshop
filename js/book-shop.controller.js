'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    renderModalOnPageLoad()
    renderButtons()
}

function renderBooks() {
    const books = getBooksForDisplay()
    const elBooks = document.querySelector('tbody')
    if (books.length === 0) {
        elBooks.innerHTML = ''
        return
    }

    const booksHTML = books.map(book => `
    <article>
        <tr>
            <td>
                ${book.id}
            </td>
            <td>
                <img onerror="this.src='img/1.jpg'" src="img/${book.img}.jpg"/>
            </td>
            <td>
                ${book.title}
            </td>
            <td>
                $${book.price}
            </td>
            <td>
                <button onclick="onShowBookDetails('${book.id}')"> Read </button> 
            </td>
            <td> 
                <form onsubmit="onUpdateBook('${book.id}', event)">
                    <input type="text" class="update-price ${book.id}">
                    <button> Update </button> 
                </form>
            </td>
            <td>
                <button onclick="onRemoveBook('${book.id}')"> Delete </button> 
            </td>
        </tr>
    </article>`)
    elBooks.innerHTML = booksHTML.join('')
}

function renderModalOnPageLoad() {
    if (getActiveBook()) onShowBookDetails(getActiveBook().id)
}

function onRemoveBook(bookId) {
    const book = removeBook(bookId)
    flashMsg(`Book Id ${book.id} removed`)
    renderButtons()
    renderBooks()
}

function onAddBook(ev) {
    ev.preventDefault()

    const elName = document.querySelector('.new-book-name')
    const elPrice = document.querySelector('.new-book-price')

    if (!elName.value || !+elPrice.value) {
        const elWarning = document.querySelector('.warning')
        elWarning.style.display = 'inline'
        setTimeout(() => elWarning.style.display = 'none', 2000)
        return
    }

    const book = addBook(elName.value, +elPrice.value)
    flashMsg(`Book Id ${book.id} added`)
    renderBooks()
    elName.value = ''
    elPrice.value = ''
}

function onUpdateBook(bookId, ev) {
    ev.preventDefault()
    const newPrice = +document.querySelector(`.${bookId}`).value

    if (!newPrice) return
    const book = updateBook(bookId, newPrice)
    flashMsg(`Book price updated to $${book.price}`)
    renderBooks()
}

function flashMsg(msg) {
    const elBookModal = document.querySelector('.modal-update')
    elBookModal.innerText = msg
    elBookModal.classList.remove('modal-hide')
    setTimeout(() => elBookModal.classList.add('modal-hide'), 2000)
}

function onShowBookDetails(bookId) {
    const book = getBookById(bookId)
    const elBookModal = document.querySelector('.modal-details')
    elBookModal.querySelector('h1').innerText = book.title
    elBookModal.querySelector('img').src = `img/${book.img}.jpg`
    elBookModal.querySelector('h2 span').innerText = book.price
    elBookModal.querySelector('p').innerText = book.summery
    elBookModal.querySelector('.rating').innerText = book.rate
    elBookModal.classList.remove('modal-hide')
}

function onHideBookDetails() {
    const elBookModal = document.querySelector('.modal-details')
    elBookModal.classList.add('modal-hide')
    removeActiveBook()
}

function onChangeRating(rating) {
    changeRating(+rating)

    const book = getActiveBook()
    console.log(book);
    const elBookModal = document.querySelector('.modal-details')
    elBookModal.querySelector('.rating').innerText = book.rate
}

function onSetFilterBy(filter) {
    const filterOptions = setBookFilter(filter)
    renderBooks()
    renderButtons()

    const queryStringParams = `?maxPrice=${filterOptions.maxPrice}&minRate=${filterOptions.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetSortBy(sort) {
    SetSortBy(sort.toLowerCase())
    renderBooks()
    renderButtons()
}

function onSetSearchByTitle(value) {
    setSearchTitle(value)
    renderBooks()
    renderButtons()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || 100,
        minRate: +queryStringParams.get('minRate') || 0
    }

    document.querySelector('.filter-by-max-price').value = filterBy.maxPrice
    document.querySelector('.filter-by-min-rate').value = filterBy.minRate
    setBookFilter(filterBy)
}

function onPageChange(change) {
    pageChange(change)
    renderButtons()
    renderBooks()
}

function renderButtons() {
    const page = getPageDetails()
    const elNext = document.querySelector('.next')
    const elPrev = document.querySelector('.prev')

    elNext.disabled = page.page === page.maxPage ? true : false
    elPrev.disabled = page.page === 0 ? true : false
}
