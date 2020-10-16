const todos = {};
todos.UlElement = document.getElementById('todos');
todos.LiElement = todos.UlElement.getElementsByTagName('li');

todos.list = [];
todos.filter = {};
todos.prior = ['low', 'middle', 'high'];
todos.newList = {};

todos.addList = (data) => {
    todos.list.push(data)
    todos.setNewUlLi(data);
    todos.setStorage('list', todos.list);
    console.log('success add');
}

todos.deleteList = (id) => {
    let newList = todos.list.filter(l => l.id != id);
    todos.setStorage('list', newList);
}

todos.setNewUlLi = (data) => {
    let div = document.createElement('div');
    div.setAttribute('class', 'w3-animate-zoom');
    let baru = '<div class="w3-text-red w3-large">New</div>'
    div.innerHTML = baru + todos.getTemplateList(data);
    todos.UlElement.prepend(div);
}

todos.showTodos = () => {
    todos.list = todos.getStorage('list');
    todos.newList = todos.list;

    if (todos.filter.keyword && todos.filter.keyword.length != 0) {
        todos.newList = todos.setFilterByKeyword();
    }
    if (todos.filter.prior && todos.filter.prior.length != 0) {
        todos.newList = todos.setFilterByPrior();
    }
    if (todos.list.length == 0) {
        todos.UlElement.innerHTML = todos.getTemplateNoList();
    } else {
        todos.UlElement.innerHTML = todos.newList.map(list => todos.getTemplateList(list)).join('');
    }
}

todos.setStorage = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
}
todos.getStorage = (name) => {
    let data = localStorage.getItem(name);
    if (data) {
        return JSON.parse(data);
    } else {
        return [];
    }
}

todos.onkeyupKeyword = (elem) => {
    todos.filter.keyword = [];
    if (elem.value.length != 0) {
        todos.filter.keyword.push(elem.value);
    } else {
        todos.filter.keyword = [];
    }
    todos.setValueByKeyword();
    todos.showTodos();
}


todos.onchangePrior = (elem) => {
    let idx;
    if (elem.id != idx) {
        if (elem.checked) {
            let p = todos.prior.filter(el => el == elem.value);
            if (p.length == 0) {
                todos.prior.push(elem.value);
            }
        } else {
            todos.prior = todos.prior.filter(el => el != elem.value);
        }
        idx = elem.id
    }
    todos.filter.prior = todos.prior;
    todos.setValueByPrior();
    todos.showTodos();
}

todos.setFilterByPrior = () => {
    let list = [];
    for (let i = 0; i < todos.newList.length; i++) {
        for (let k = 0; k < todos.filter.prior.length; k++) {
            let prior = todos.newList[i].prior;
            let word = todos.filter.prior[k];
            if (prior == word) {
                list.push(todos.newList[i]);
            }
        }
    }
    return list;
}

todos.setFilterByKeyword = () => {
    let list = [];
    let idx = 0;
    for (let i = 0; i < todos.list.length; i++) {
        for (let k = 0; k < todos.filter.keyword.length; k++) {
            let title = todos.list[i].title.toUpperCase();
            let desc = todos.list[i].desc.toUpperCase();
            let word = todos.filter.keyword[k].toUpperCase();
            if (title.indexOf(word) > -1 || desc.indexOf(word) > -1) {
                if (todos.list[i].id != idx) {
                    list.push(todos.list[i]);
                    idx = todos.list[i].id
                }
            }
        }
    }
    return list;
}

todos.setValueByPrior = () => {
    let fprior = document.getElementById('fprior');
    if (todos.filter.prior && todos.filter.prior.length != 0) {
        fprior.style.display = 'block';
        let val = []
        todos.filter.prior.forEach(elem => {
            val.push(`<div class="w3-tag w3-blue">${elem}</div>`)
        });
        fprior.children[1].innerHTML = val.join(' ');
    } else {
        fprior.style.display = 'none';
    }
}

todos.setValueByKeyword = () => {
    let fkeyword = document.getElementById('fkeyword');
    if (todos.filter.keyword && todos.filter.keyword.length != 0) {
        fkeyword.style.display = 'block';
        let val = []
        todos.filter.keyword.forEach(elem => {
            val.push(`<div class="w3-tag w3-green">" ${elem} "</div>`)
        });
        fkeyword.children[1].innerHTML = val.join(' ');
    } else {
        fkeyword.style.display = 'none';
    }
}

todos.getTemplateList = (list) => {
    return `
        <li class="w3-white w3-row w3-margin-bottom w3-border-0 w3-leftbar w3-display-container">
            <div class="w3-col s3">
                <div class="w3-xlarge">${list.id}</div>
                <div class="">${list.prior}</div>
            </div>
            <div class="w3-rest w3-margin-left">
                <div class="w3-xlarge">${list.title}</div>
                <div class="w3-text-gray">${list.desc}</div>
            </div>
            <div class="w3-button w3-large w3-blue w3-display-right" style="height: 100%;" onmouseover="todos.showAction(this)">
                <span>&ii;</span>
                <div class="w3-display-middle w3-animate-left" style="display: none;">
                    <button class="w3-bar-item w3-button w3-blue">Edit</button>
                    <button class="w3-bar-item w3-button w3-green">Check</button>
                    <button class="w3-bar-item w3-button w3-red" onclick="todos.actionDeleteList(this, '${list.id}')">Delete</button>
                </div>
            </div>
        </li>
    `;
}

todos.getTemplateNoList = (list) => {
    return `No data found`;
}

todos.getNewIdTodo = () => {
    if (todos.list.length == 0) {
        return 1;
    } else {
        let max = 0;
        for (let i = 0; i < todos.list.length; i++) {
            if (todos.list[i].id > max) {
                max = todos.list[i].id;
            }
        }
        return max + 1;
    }
}

todos.showFilterSideBar = () => {
    document.getElementById('filterSideBar').style.display = 'block';
}
todos.hideFilterSideBar = () => {
    document.getElementById('filterSideBar').style.display = 'none';
}

todos.openModal = (modal, method) => {
    todos.modalTodo = document.getElementById(modal);
    todos.modalTodo.classList.add('w3-show');
    document.getElementById('modalTitle').innerHTML = method + ' Todo';
    todos.btnSubmit = document.getElementById('modalSubmit')
    todos.btnSubmit.innerHTML = method;
    todos.btnSubmit.value = method;
    if (todos.btnSubmit.value == 'Add') {
        todos.btnSubmit.form.reset();
        todos.formAddTodo(todos.btnSubmit.form);
    }
}
todos.closeModal = () => {
    todos.modalTodo.classList.remove('w3-show');
}

todos.actionDeleteList = (elem, id) => {
    let cf = confirm('Sure to deleting?');
    if (cf) {
        elem.parentNode.parentNode.parentNode.parentNode.removeChild(elem.parentNode.parentNode.parentNode)
        todos.deleteList(id);
    }
}
todos.showAction = (elem) => {
    elem.style.width = '100%';
    elem.children[1].style.display = 'block';
    elem.children[0].style.display = 'none';
    elem.onmouseleave = function(e) {
        elem.style.width = '';
        elem.children[1].style.display = 'none';
        elem.children[0].style.display = 'block';
    }
}

todos.formAddTodo = (form) => {
    for (const f of form) {
        if (f.name == 'deadline1') f.value = todos.dateLocal()
        if (f.name == 'deadline2') f.value = todos.timeLocal()
    }
    form.onsubmit = todos.submitFormAddTodo;
}

todos.submitFormAddTodo = (e) => {
    e.preventDefault();
    let data = {}
    data.id = todos.getNewIdTodo();
    for (const i of e.target) {
        if (i.type == 'text' || i.type == 'select-one' || i.type == 'date' || i.type == 'time') data[i.name] = i.value;
        if (i.type == 'checkbox' || i.type == 'radio') data[i.name] = i.checked;
    }
    data.timeAdd = new Date();
    todos.addList(data);
    todos.closeModal();
}

todos.oneDigitToTwo = (n) => {
    return (n < 10) ? '0' + n : n;
}

todos.dateLocal = () => {
    let d = new Date();
    return d.getFullYear() + '-' + todos.oneDigitToTwo((d.getMonth() + 1)) + '-' + todos.oneDigitToTwo(d.getDate());
}
todos.timeLocal = () => {
    let d = new Date();
    return todos.oneDigitToTwo(d.getHours()) + ':' + todos.oneDigitToTwo(d.getMinutes());
}

////////////////////
todos.showTodos();
console.warn(todos);