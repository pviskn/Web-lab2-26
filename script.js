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
let draggedItem = null;

// сохранение задач
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// фильтрация и поиск задач
function filterTasks() {
    const filter = filterSelect.value;
    const search = searchInput.value.trim().toLowerCase();

    taskList.querySelectorAll('.task-item').forEach(item => {
        const task = tasks.find(t => t.id === Number(item.dataset.id));

        if (!task) {
            return;
        }

        let matchesFilter = true;

        if (filter === 'done') {
            matchesFilter = task.done;
        } else if (filter === 'active') {
            matchesFilter = !task.done;
        }

        const matchesSearch = task.text.toLowerCase().includes(search);

        item.style.display = matchesFilter && matchesSearch ? '' : 'none';
    });
}

filterSelect.addEventListener('change', filterTasks);
searchInput.addEventListener('input', filterTasks);

// сортировка задач
function sortTasks() {
    const sort = sortSelect.value;
    const sortedTasks = [...tasks];

    if (sort === 'asc') {
        sortedTasks.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sort === 'desc') {
        sortedTasks.sort((a, b) => b.date.localeCompare(a.date));
    }

    sortedTasks.forEach(task => {
        const item = taskList.querySelector('[data-id="' + task.id + '"]');

        if (item) {
            taskList.append(item);
        }
    });

    filterTasks();
}

sortSelect.addEventListener('change', sortTasks);

// создание задачи
function addTask(task) {
    tasks.push(task);

    const item = document.createElement('li');
    item.className = 'task-item';
    item.dataset.id = task.id;

    // перетаскивание задач
    item.draggable = true;

    item.addEventListener('dragstart', function(event) {
        if (sortSelect.value !== 'default') {
            event.preventDefault();
            return;
        }

        draggedItem = item;
        event.dataTransfer.effectAllowed = 'move';
        item.classList.add('dragging');
    });

    item.addEventListener('dragover', function(event) {
        if (draggedItem === null || draggedItem === item) {
            return;
        }

        event.preventDefault();

        const middle = item.getBoundingClientRect().top + item.offsetHeight / 2;

        if (event.clientY < middle) {
            taskList.insertBefore(draggedItem, item);
        } else {
            taskList.insertBefore(draggedItem, item.nextSibling);
        }
    });

    item.addEventListener('dragend', function() {
        item.classList.remove('dragging');

        if (draggedItem === null) {
            return;
        }

        const newOrder = Array.from(taskList.children).map(element => {
            return Number(element.dataset.id);
        });

        tasks.sort((a, b) => {
            return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
        });

        draggedItem = null;
        saveTasks();
    });

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.done;

    item.classList.toggle('completed', task.done);

    checkbox.addEventListener('change', function() {
        task.done = checkbox.checked;
        item.classList.toggle('completed', task.done);
        saveTasks();
        filterTasks();
    });

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    const taskDate = document.createElement('span');
    taskDate.textContent = task.date;

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    taskInfo.append(taskText, taskDate);

    // редактирование
    const editButton = document.createElement('button');
    editButton.textContent = 'Изменить';
    editButton.className = 'edit-button';

    editButton.addEventListener('click', function() {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = task.text;

        const editDate = document.createElement('input');
        editDate.type = 'date';
        editDate.value = task.date;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Отмена';

        taskInfo.replaceChildren(editInput, editDate);
        item.replaceChildren(checkbox, taskInfo, saveButton, cancelButton);

        saveButton.addEventListener('click', function() {
            const newText = editInput.value.trim();
            const newDate = editDate.value;

            if (newText === '' || newDate === '') {
                return;
            }

            task.text = newText;
            task.date = newDate;

            taskText.textContent = task.text;
            taskDate.textContent = task.date;

            taskInfo.replaceChildren(taskText, taskDate);
            item.replaceChildren(checkbox, taskInfo, editButton, deleteButton);

            saveTasks();
            sortTasks();
        });

        cancelButton.addEventListener('click', function() {
            taskInfo.replaceChildren(taskText, taskDate);
            item.replaceChildren(checkbox, taskInfo, editButton, deleteButton);
        });
    });

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

        saveTasks();
        filterTasks();

        if (tasks.length === 0) {
            emptyMessage.hidden = false;
        }
    });

    item.append(checkbox, taskInfo, editButton, deleteButton);
    taskList.append(item);

    emptyMessage.hidden = true;
    sortTasks();
}

// добавление новой задачи
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

    addTask(task);
    saveTasks();
    form.reset();
});

// загрузка сохраненных задач
const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

savedTasks.forEach(task => {
    addTask(task);
});