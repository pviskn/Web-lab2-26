
const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'style.css';
document.head.append(style);

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

// форма добавления задачи
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

// поиск, фильтрация
const controls = document.createElement('section');
controls.className = 'controls';

const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск задачи';

const filterSelect = document.createElement('select');

const filters = ['Все задачи', 'Выполненные', 'Невыполненные'];

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

// список задач
const taskSection = document.createElement('section');
taskSection.className = 'task-section';

const taskList = document.createElement('ul');
taskList.className = 'task-list';

const emptyMessage = document.createElement('p');
emptyMessage.className = 'empty-message';
emptyMessage.textContent = 'Список пуст';

taskSection.append(taskList, emptyMessage);
main.append(taskSection);

// добавление, удаление и выполнение задач
const tasks = [];

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const text = taskInput.value.trim();
    const date = dateInput.value;

    if (text === '' || date === '') {
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        date: date,
        done: false
    };

    tasks.push(task);

    const item = document.createElement('li');
    item.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';

    checkbox.addEventListener('change', function() {
        task.done = checkbox.checked;
        item.classList.toggle('completed', task.done);
    });

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    const taskDate = document.createElement('span');
    taskDate.textContent = task.date;

    // удаление
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.className = 'delete-button';

    deleteButton.addEventListener('click', function() {
        const index = tasks.findIndex(t => t.id === task.id);

        if (index !== -1) {
            tasks.splice(index, 1);
        }

        item.remove();

        if (tasks.length === 0) {
            emptyMessage.hidden = false;
        }
    });

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    taskInfo.append(taskText, taskDate);
    item.append(checkbox, taskInfo, deleteButton);
    taskList.append(item);

    emptyMessage.hidden = true;

    form.reset();
});


