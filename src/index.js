console.log("working")

document.addEventListener('DOMContentLoaded', () => {

    dropDownDiv = document.getElementById("drop-down-div")

    hideNewForm()

    showFormBTN = document.getElementById("show-form-btn")

    showFormBTN.addEventListener("click", showForm)

    
    fetch('http://localhost:3000/budgets')
    .then((response) => {
        return response.json();
        })
        .then((data) => {
            renderDropDown(data);
        });
        
        addButtonListeners(document.getElementById("body"))
        addFormSubmissionListeners()
    })

const showForm = () => {
        newForm.style.display = "block"
    }

const hideNewForm = () => {
    newForm = document.getElementById("new-project-form")
    newForm.style.display = "none"
}

const renderDropDown = (budgetsObj) => {
    const dropDown = document.createElement('select')
    budgetsObj.forEach(budget => {
        const option = document.createElement('option')
        option.value = budget.id
        option.innerText = budget.name
        dropDown.append(option)
    })
    addDropDownEventListener(dropDown)
    dropDownDiv.append(dropDown)
}

const addDropDownEventListener = (dropDown) => {
    dropDown.addEventListener("change", event => {
        fetchBudget(event.target.value)
    })
}

const fetchBudget = budgetId => {
    fetch(`http://localhost:3000/budgets/${budgetId}`)
    .then(response => response.json())
    .then(budgetObj => {
        renderBudget(budgetObj)
    })
}

const renderBudget = budgetObject => {
    const div = document.getElementById('body')
    div.dataset.id = budgetObject.id
    div.innerHTML = `
    <h1>${budgetObject.name}</h1>
    <form id="new-line-item-form">
        <label for="name">Line Item Name:</label><br>
        <input type="text" id="name" name="name"><br>
        <label for="amount">Line Item Amount:</label><br>
        <input type="number" id="amount" name="amount">
        <input type="submit" id="new-line-item-submit">
    </form>
    <button class="add-line-item">Add Line Item</button>
    `
    newLineItemForm = document.getElementById("new-line-item-form")
    newLineItemForm.style.display = "none"
    budgetObject.line_items.forEach(item => appendCards(item, div))
    
}

const appendCards = (lineItem, divElement) => {
    const card = document.createElement('div')
    card.className = 'card'
    card.dataset.id = lineItem.id
    card.innerHTML = `
        <p>${lineItem.name}</p>
        <p>${lineItem.amount}</p>
        <p>${lineItem.status}</p>
        <button class="edit-button" >Edit</button>
        <button class="delete-button" >Delete</button>
    `
    divElement.append(card)
}

const addButtonListeners = divElement => {
    divElement.addEventListener("click", event => {
        lineItem = event.target.parentNode
        switch (event.target.className) {
            case "add-line-item":
                newLineItemForm.style.display = "block"
                break;
            case "edit-button":
                
                break;
            case "delete-button":
                removeLineItem(lineItem)
                break;
        }
    })
}

const removeLineItem = (lineItem) => {
    fetch(`http://localhost:3000/line_items/${lineItem.dataset.id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(lineItem.remove())
}

const addFormSubmissionListeners = () => {
    document.addEventListener("submit", event => {
        event.preventDefault()
        console.dir(event.target)
        switch (event.target.id) {
            case "new-project-form":
                let budgetName = event.target.elements[0].value
                let budgetAmount = event.target.elements[1].value
                postNewBudget(budgetName, budgetAmount)
                break;
            case "new-line-item-form":
                let lineItemName = event.target.elements[0].value
                let lineItemamount = event.target.elements[1].value
                let budgetId = event.target.parentNode.dataset.id
                let lineItemstatus = 'Tentative'
                postNewLineItem(lineItemName, lineItemamount, budgetId, lineItemstatus)
                break;
        
        }
    })
}

const postNewBudget = (budgetName, budgetAmount) => {
    fetch(`http://localhost:3000/budgets`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({name: budgetName, total_amount: budgetAmount})
    })
    .then(response => response.json())
    .then(budgetObj => {
        fetchBudget(budgetObj.id)
        newForm.style.display = "none"
    })
}

const postNewLineItem = (lineItemName, lineItemamount, budgetId, lineItemstatus) => {
    console.log(lineItemName)
    fetch(`http://localhost:3000/line_items`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({budget_id: budgetId, amount: lineItemamount, status: lineItemstatus, name: lineItemName})
    })
    .then(response => response.json())
    .then(LineItem => {
        console.dir(LineItem)
        fetchBudget(budgetId)
        newLineItemForm.style.display = "none"
    })
}