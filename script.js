let list = JSON.parse(localStorage.getItem('links')) || [];
let activePageNumber = 1;
let numberOfPages = 5;
updateTableView();
let selectedItemIndex;
const linkNameInput = document.getElementById('link-name-input-area');
const linkUrlInput = document.getElementById('link-url-input-area');
const content = document.getElementById('content');
const addNewlinkPage = document.getElementById('add-new-link-page');

function openAdditionSection() {
  content.style.display = 'none';
  addNewlinkPage.style.display = 'inline-block';
  document.querySelector('.add-button').style.display = 'inline-block';
  document.querySelector('.update-button').style.display = 'none';
  document.getElementById('update-link-head').style.display = 'none';
  document.getElementById('new-link-head').style.display = 'inline-block';
}

function addButtonClicked() {
  const listItem = {
    listItemContentHeader: linkNameInput.value,
    listItemContentLink: linkUrlInput.value,
    points: 0,
  };
  list.push(listItem);
  localStorage.setItem('links', JSON.stringify(list));
  content.style.display = 'inline-block';
  addNewlinkPage.style.display = 'none';
  document.querySelector('.add-button').style.display = 'none';
  document.querySelector('.update-button').style.display = 'none';
  updateTableView();
}

function updateTableView() {
  let allRows = '';
  const paginatedList = getPagedListElements();
  paginatedList.forEach((listItem, i) => {
    allRows += `
    <li>
    <div
      id="list-item-div"
      onmouseout="hideDivDeleteButton(${i}),hideDivEditButton(${i})"
      onmouseover="showDivDeleteButton(${i}),showDivEditButton(${i})"
    >
      <div id="delete-button-${i}" class="delete-button" onClick="deleteButtonClicked(${i})">
        <img src="delete-button-pic.png" alt="" />
      </div>
      <div id="edit-button-${i}" class="edit-button" onClick="editButtonClicked(${i})">
      <img src="edit-button-pic.png" alt="" />
    </div>
      <div id="add-button">
        <div id="box">
          <p id="point-number">${listItem.points}</p>
          <p id="point-write">points</p>
        </div>
      </div>
      <div id="list-item-content">
        <div id="list-item-content-header">
          ${listItem.listItemContentHeader}
        </div>
        <div id="list-item-content-middle">
          <p>${listItem.listItemContentLink}</p>
        </div>
        <div id="list-item-content-footer">Up Vote Down Vote</div>
      </div>
    </div>
  </li>
        `;
  });
  document.getElementById('content-list').innerHTML = allRows;
  updatePaginationView();
}

function updatePaginationView() {
  let pageItemsHtml = '';
  const totalItemCount = list.length;
  const pageItemCount = Math.ceil(totalItemCount / numberOfPages);
  const decrementIconHtml = `<li><</li>`;
  const incrementIconHtml = `<li>></li>`;

  for (let start = 1; start <= pageItemCount; start++) {
    if (start === 1 && activePageNumber !== 1) {
      pageItemsHtml += decrementIconHtml;
    }
    pageItemsHtml += `
    <li onclick=onPageItemClicked(${start})>
      ${start}
    </li>
    `;
    if (start === pageItemCount && activePageNumber !== pageItemCount) {
      pageItemsHtml += incrementIconHtml;
    }
  }
  document.getElementById('pagination-list').innerHTML = pageItemsHtml;
}

function onPageItemClicked(pageNumber) {
  activePageNumber = pageNumber;
  updateTableView();
}
function showDivEditButton(i) {
  document.getElementById(`edit-button-${i}`).style.display = 'inline-block';
}
function hideDivEditButton(i) {
  document.getElementById(`edit-button-${i}`).style.display = 'none';
}
function showDivDeleteButton(i) {
  document.getElementById(`delete-button-${i}`).style.display = 'inline-block';
}
function hideDivDeleteButton(i) {
  document.getElementById(`delete-button-${i}`).style.display = 'none';
}
function deleteButtonClicked(i) {
  selectedItemIndex = i;
  openPopup();
  event.stopPropagation();
  document.getElementById('page').style.opacity = 0.7;
}
function editButtonClicked(i) {
  selectedItemIndex = i;
  linkNameInput.value = list[selectedItemIndex].listItemContentHeader;
  linkUrlInput.value = list[selectedItemIndex].listItemContentLink;
  openAdditionSection();
  document.querySelector('.add-button').style.display = 'none';
  document.getElementById('new-link-head').style.display = 'none';
  document.getElementById('update-link-head').style.display = 'inline-block';
  document.querySelector('.update-button').style.display = 'inline-block';
}
function updateButtonClicked() {
  list[selectedItemIndex].listItemContentHeader = linkNameInput.value;
  list[selectedItemIndex].listItemContentLink = linkNameInput.value;
  content.style.display = 'inline-block';
  addNewlinkPage.style.display = 'none';
  updateTableView();
}
function closePopup() {
  document.getElementById('popup-bg').style.display = 'none';
  document.getElementById('page').style.opacity = 1;
  window.removeEventListener('keyup', onPopupKeyup);
  window.removeEventListener('click', onPopupClick);
}
function openPopup() {
  document.getElementById('popup-bg').style.display = 'block';
  document.querySelector('.deletePopupInHeader').innerHTML =
    list[selectedItemIndex].listItemContentHeader;
  window.addEventListener('keyup', onPopupKeyup);
  window.addEventListener('click', onPopupClick);
}
function onPopupKeyup(event) {
  if (event.key === 'Enter') {
    deleteConfirm();
  } else if (event.key === 'Escape') {
    closePopup();
  }
}
function onPopupClick() {
  closePopup();
}
function popupDivClicked(event) {
  event.stopPropagation();
}
function onInputKeyup(event) {
  if (event.key === 'Enter') {
    addButtonClicked();
  }
}
function deleteConfirm() {
  list.splice(selectedItemIndex, 1);
  localStorage.setItem('links', JSON.stringify(list));
  closePopup();
  openCategoryDeletedPopup();
  updateTableView();
}
function openCategoryDeletedPopup() {
  document.getElementById('category-deleted-popup').style.display =
    'inline-block';
  clearTimeout();

  closeCategoryDeletedPopup();
}
function closeCategoryDeletedPopup() {
  setTimeout(
    "document.getElementById('category-deleted-popup').style.visibility = 'hidden'",
    3000
  );

  document.getElementById('category-deleted-popup').style.visibility =
    'visible';
}

// sayfalama & sıralama //

function getPagedListElements() {
  const startIndex = startIndexCalculate();
  const finishIndex = activePageNumber * numberOfPages;
  const pagedListItems = list.slice(startIndex, finishIndex);
  return pagedListItems;
}

function startIndexCalculate() {
  const startIndex = activePageNumber * numberOfPages - numberOfPages;
  return startIndex;
}
// sayfalama & sıralama //

// localStorage.getItem
// localStorage.setItem  string ile yolluyoruz parse ile çeviriyoruz açarken.
// localStorage.removeItem
// localStorage.clear
// sayfalama
// puan arttır azalt
// sıralama points göre ve updated Date
// CSS
// event.preventDefault() event de click varsa click özelliğini kaldırarak açıyor
