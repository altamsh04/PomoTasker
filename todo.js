/*
This block of code used to check id is created or not inside the sesstion
*/
let id = null;
let temp = sessionStorage.getItem('id');
temp > 0 ? sessionStorage.getItem('id') : sessionStorage.setItem('id', '1');

/*
1. todo() - This function is created for add todo on the session storage 
        by adding current added date and todo which stored in JSON format  
*/
function todo() {
    let sessionId = sessionStorage.getItem('id')
    let todoContainer = document.getElementById('todo-container');
    let todoInput = document.getElementById('todo-input').value

    let date = new Date()
    let currentDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()

    if (todoInput.length === 0) {
        console.log("empty");
    } else {
        sessionId++
        sessionStorage.setItem('id', sessionId)
        sessionStorage.setItem('todo-' + sessionId, JSON.stringify({ date: currentDate, id: sessionId, todo: todoInput, checkFlag: null }))
        display_todo_list();
    }
}

/*
2. display_todo_list() - This function is used to fetch all stored todo and
                    display dynamically on the table on the load or by call
*/
function display_todo_list() {
    let displayTodoList = document.getElementById('display-todo-list')
    displayTodoList.innerHTML = '';
    let id = sessionStorage.getItem('id')

    let table = document.createElement('table');

    for (let index = 1; index <= id; index++) {
        let data = JSON.parse(sessionStorage.getItem('todo-' + index))

        console.log(data)
        if (data) {
            let row = table.insertRow(-1);

            let checkCell = row.insertCell(0);
            let todoCell = row.insertCell(1);
            // let dateCell = row.insertCell(2);
            let actionCell = row.insertCell(2);

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = index;
            checkbox.onchange = function () {
                check_todo(index);
            };

            checkCell.appendChild(checkbox);
            todoCell.innerHTML = data.todo;
            // dateCell.innerHTML = data.date;
            let checkFlag = data.checkFlag;

            if (index === checkFlag) {
                todoCell.style = "text-decoration:line-through";
                checkbox.checked = true;
            }
            actionCell.innerHTML = `<button id='delete-${index}' class='delete-todo-button' onclick='delete_todo(${index}) || display_todo_list()' style='background-color: white'><i class="fa-solid fa-trash"></i></button>`;
        }
    }
    displayTodoList.appendChild(table);
}

/*
3. check_todo(id) - This function is used to check the todo avilable
               on the session storage or not
*/
function check_todo(id) {
    let todoId = 'todo-' + id;
    let data = JSON.parse(sessionStorage.getItem(todoId))
    if (data.checkFlag == null) {
        sessionStorage.setItem('todo-' + id, JSON.stringify({ date: data.date, id: data.id, todo: data.todo, checkFlag: id }))
        display_todo_list();
        return 1
    }
    if (data.checkFlag != null) {
        sessionStorage.setItem('todo-' + id, JSON.stringify({ date: data.date, id: data.id, todo: data.todo, checkFlag: null }))
        display_todo_list();
        return 0
    }
}

/*
4. delete_todo(id) - This function is basically delete or remove the todo
                from the session by its value
*/
function delete_todo(id) {
    let todoId = 'todo-' + id;
    sessionStorage.removeItem(todoId)
}