
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
