class Contact{
    constructor (Name, Number){
        this.Name = Name;
        this.Number = Number;
    }
}

class UI {
    static displayToContacts(){
        const contacts = Storage.getContact();
        
        contacts.forEach((contact) => UI.addToContacts(contact));
    }

    static addToContacts(contact){
        const tbody = document.querySelector('#contact-list');
        const li = document.createElement('tr');

        li.innerHTML = `
        <td>${contact.Name}</td>
        <td>${contact.Number}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a</td>
        `;

        tbody.appendChild(li);
    }

    static deleteContact(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, alert){
        const div = document.createElement('div');
        div.className = `alert alert-${alert} mt-5`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#contact-form');
        container.insertBefore(div, form);

        setTimeout(()=> {document.querySelector('.alert').remove()}, 1500)
    }

    static clearFields(){
        const name = document.querySelector('#contactName').value = '';
        const number = document.querySelector('#contactNumber').value = '';
    }
}

class Storage {
    static getContact(){
        let contact;
        if(localStorage.getItem('contact') === null){
            contact = [];
        }else{
            contact = JSON.parse(localStorage.getItem('contact'));
        }

        return contact;
    }

    static addContact(contact){
        let contacts = Storage.getContact();
        contacts.push(contact);
        localStorage.setItem('contact', JSON.stringify(contacts));
    }

    static removeContact(number){
        let contacts = Storage.getContact();
        
        contacts.forEach((contact, index) => {
            if(contact.Number === number){
                contacts.splice(index, 1);
            }
        });

        localStorage.setItem('contact', JSON.stringify(contacts));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayToContacts);

document.querySelector('#contact-form').addEventListener('submit', (e) =>{
    e.preventDefault();

    const name = document.querySelector('#contactName').value;
    const number = document.querySelector('#contactNumber').value;
    const expression = /[0-9]/;
    const validation = new RegExp(expression);
    if(name === '' || number === ''){
        UI.showAlert('Fill The Fields Completely', 'danger');
    }else if (!number.match(validation)){
        UI.showAlert('Fill Valid Contact Number', 'danger')
        UI.clearFields();
    }else{
        const contact = new Contact(name, number);

        UI.addToContacts(contact);
        UI.clearFields();
        Storage.addContact(contact);
        UI.showAlert('Successfully Added', 'success');
    }
    
    
});


document.querySelector('#contact-list').addEventListener('click', (e) =>{
    UI.deleteContact(e.target);
 
    Storage.removeContact(e.target.parentElement.previousElementSibling.textContent)

    UI.showAlert('Successfully Removed', 'success');
})
