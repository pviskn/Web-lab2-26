
const main = document.createElement('main');
main.className = 'container';

const header = document.createElement('header');

const title = document.createElement('h1');
title.textContent = 'Список задач';

const description = document.createElement('p');
description.textContent = 'Какой план на сегодня?'; // взяла идею описания с приложения, которым я пользуюсь для планирования

header.append(title, description);
main.append(header);
document.body.append(main);

const form = document.createElement('form');
form.className = 'task-form';

const taskInput = document.createElement('input');
taskInput.type = 'text';
taskInput.placeholder = 'Название задачи';
taskInput.required = true;

const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.required = true;

const addButton = document.createElement('button');
addButton.type = 'submit';
addButton.textContent = 'Добавить';

form.append(taskInput, dateInput, addButton);
main.append(form);

const controls = document.createElement('section');
controls.className = 'controls';

const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск задачи';

const filterSelect = document.createElement('select');

const filters = ['Все задачи', 'Завершенные', 'Незавершенные'];

filters.forEach((filter, index) => {
    const option = document.createElement('option');
    option.value = ['all', 'done', 'active'][index];
    option.textContent = filter;
    filterSelect.append(option);
});

const sortSelect = document.createElement('select');

const sorts = ['Без сортировки', 'Сначала ближайшие', 'Сначала поздние'];

sorts.forEach((sort, index) => {
    const option = document.createElement('option');
    option.value = ['default', 'asc', 'desc'][index];
    option.textContent = sort;
    sortSelect.append(option);
});

controls.append(searchInput, filterSelect, sortSelect);
main.append(controls);

const taskSection = document.createElement('section');
taskSection.className = 'task-section';

const taskList = document.createElement('ul');
taskList.className = 'task-list';

const emptyMessage = document.createElement('p');
emptyMessage.className = 'empty-message';
emptyMessage.textContent = 'Список пуст';

taskSection.append(taskList, emptyMessage);
main.append(taskSection);

