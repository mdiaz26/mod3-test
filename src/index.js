console.log("working")

budgetContainer = document.getElementById('body')
dropDownDiv = document.getElementById("drop-down-div")
var showFormBTN = document.getElementById("show-form-btn")
var displayBody = document.getElementById('budget-display-area')


document.addEventListener('DOMContentLoaded', () => {
    clearAll()
    homepageRender()
    addButtonListeners(budgetContainer)
    addFormSubmissionListeners()

    const sortable = new Sortable.default(document.getElementById("adit-test-cards"), {
        draggable: '.list-group-item'
      });
      sortable.on('sortable:start', () => console.log('sortable:start'));
      sortable.on('sortable:sort', () => console.log('sortable:sort'));
      sortable.on('sortable:sorted', () => console.log('sortable:sorted'));
      sortable.on('sortable:stop', () => console.log('sortable:stop'));

    })

const homepageRender = () => {    
    clearBody()
    hideNewForm()
    addListenerToNewBudgetButton()
    fetchBudgets()
}

const fetchBudgets = () => {
    fetch('http://localhost:3000/budgets')
    .then(response => response.json())
    .then(renderDropDown)
}

const clearBody = () => {
    budgetContainer.style.display = "none"
    
}

const clearAll = () => {
    displayBody.style.display = "none"
}

const addListenerToNewBudgetButton = () => {
    showFormBTN.addEventListener("click", showForm)
}

document.getElementById("new-project-form").addEventListener("click", event => {
    if (event.target.id === "cancel-btn") {
        showForm()
    }
})


const showForm = () => {
    if (newForm.style.display === "none"){
        newForm.style.display = "block"
        newForm.reset()
        document.getElementById("show-form-btn").style.display = 'none'
    } else if (newForm.style.display === "block") {
        newForm.style.display = "none"
        document.getElementById("show-form-btn").style.display = 'block'
    }
    }

const hideNewForm = () => {
    newForm = document.getElementById("new-project-form")
    newForm.style.display = "none"
    document.getElementById("show-form-btn").style.display = 'block'
}

const renderDropDown = (budgetsObj) => {
    const dropDown = document.createElement('select')
    addDefaultToDropDown(dropDown)
    budgetsObj.forEach(budget => {
        let option = document.createElement('option')
        option.value = budget.id
        option.innerText = budget.name
        dropDown.append(option)
    })
    addDropDownEventListener(dropDown)
    dropDownDiv.innerHTML = ""
    dropDownDiv.append(dropDown)
}

const addDefaultToDropDown = dropDown => {
    let option = document.createElement('option')
    option.innerText = "--"
    dropDown.append(option)
}

const addDropDownEventListener = (dropDown) => {
    dropDown.addEventListener("change", event => {
        if (event.target.value === "--") {
            budgetContainer.innerHTML = ""
        } else {
        fetchBudget(event.target.value)
    }
    })
}

const fetchBudget = budgetId => {
    fetch(`http://localhost:3000/budgets/${budgetId}`)
    .then(response => response.json())
    .then(budgetObj => {
        renderBudget(budgetObj)
        document.getElementById("url-display").style.display = "none"
    })
}

const renderBudget = budgetObject => {
    budgetContainer.dataset.id = budgetObject.id
    budgetContainer.innerHTML = `
    <h1 id= "budget-title">${budgetObject.name}</h1>
    <h3 id= "budget-amount">Total Budget:
        <span>${budgetObject.total_amount}</span>
    </h3>
    <p id="amount-spent">Amount Spent: 
        <span>${calculateAmountSpent(budgetObject)}</span>
        <div class="progress">
            <div class="progress-bar" role="progressbar" aria-valuenow=${calculatePercentageSpent(budgetObject)}
            aria-valuemin="0" aria-valuemax="100" style="width:${calculatePercentageSpent(budgetObject)}%">
                <span>${calculatePercentageSpent(budgetObject)}% Complete</span>
            </div>
        </div>
    </p>
    <p id="amount-remaining">Amount Remaining: 
        <span>${calculateAmountRemaining(budgetObject)}</span>
    </p>
    <button class="delete-budget">Delete</button>
    <button class="add-line-item">Add Line Item</button>
    <form id="new-line-item-form">
        <label for="name">Line Item Name:</label><br>
        <input type="text" id="name" name="name"><br>
        <label for="amount">Line Item Amount:</label><br>
        <input type="number" id="amount" name="amount">
        <input type="submit" id="new-line-item-submit">
    </form>
    <div id="card-div" class="card-group"></div>
    `
    formatAmountsInDiv(budgetContainer)
    newLineItemForm = document.getElementById("new-line-item-form")
    newLineItemForm.style.display = "none"
    let cardDiv = document.getElementById("card-div")
    budgetObject.line_items.forEach(item => appendCards(item, cardDiv))
}

const appendCards = (lineItem, divElement) => {
    const card = document.createElement('div')
    if (lineItem.status === "Tentative") {
        card.style.backgroundColor = "yellow"
    }else {
        card.style.backgroundColor = "lightslategrey"
    }
    card.className = `card text-white mb-3}`
    card.dataset.id = lineItem.id
    card.innerHTML = `
        <p class="card-header">${lineItem.name.toUpperCase()}</p>
        <div class="card-body">
            <p data-amount=${lineItem.amount}>$${Number(lineItem.amount).toLocaleString('en')}</p>
            <p class="card-status">${lineItem.status}</p>
        </div>
        <div class="btn-group">
            <button class="edit-button btn btn-primary" >Edit</button>
            <button class="delete-button btn btn-primary" >Delete</button>
        </div>
        <button class="approve-button btn btn-primary" >Approve</button>
    `
    addApproveButton(card)
    divElement.append(card)
}

const addButtonListeners = budgetContainer => {
    budgetContainer.addEventListener("click", event => {
        const lineItem = event.target.parentNode.parentNode
        switch (event.target.className) {
            case "add-line-item":
                if (newLineItemForm.style.display === "none"){
                    newLineItemForm.style.display = "block"
                    event.target.innerText = "Cancel"
                } else if (newLineItemForm.style.display === "block") {
                    newLineItemForm.style.display = "none"
                    newLineItemForm.reset()
                    event.target.innerText = "Add Line Item"
                }
                break;
            case "edit-button btn btn-primary":
                editLineItem(lineItem)
                break;
            case "delete-button btn btn-primary":
                removeLineItem(lineItem)
                break;
            case "approve-button btn btn-primary":
                console.log(event.target.parentNode)
                approveLineItem(event.target.parentNode)
                break;
            case "delete-budget":
                const budgetElement = event.target.parentNode
                deleteBudget(budgetElement)
                break;
        }
    })
}

const editLineItem = lineItem => {
    renderEditItemForm(lineItem)
}

const renderEditItemForm = lineItem => {
    const modal = document.getElementById("myModal")
    modal.style.display = "block"
    const form = modal.getElementsByTagName("form")[0]
    form.dataset.id = lineItem.dataset.id
    const currentName = lineItem.getElementsByClassName("card-header")[0].innerText
    const currentAmount = lineItem.getElementsByClassName("card-body")[0].children[0].dataset.amount
    form.name.value = currentName
    form.amount.value = currentAmount
    addListenersToModal(modal)
}

const addListenersToModal = modalElement => {
    modalElement.addEventListener("click", event => {
        event.preventDefault()
        switch (event.target.className) {
            case "close":
                event.target.parentNode.parentNode.style.display = "none"
                break;
            case "submit-form":
                let formData = event.target.parentNode.parentNode
                console.log(formData)
                lineItemPostRequest(formData)
                event.target.parentNode.parentNode.parentNode.parentNode.style.display = "none"
                break;
        }
    })
}

const lineItemPostRequest = formData => {
    fetch(`http://localhost:3000/line_items/${formData.dataset.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name.value,
            amount: formData.amount.value
        })
    })
    .then(response => response.json())
    .then(newLineItem => fetchBudget(newLineItem.budget_id))
}

const removeLineItem = (lineItem) => {
    fetch(`http://localhost:3000/line_items/${lineItem.dataset.id}`, {
        method: "DELETE"
    })
    .then(response => fetchBudget(parseInt(lineItem.parentNode.parentNode.dataset.id)))
}

const addFormSubmissionListeners = () => {
    document.addEventListener("submit", event => {
        event.preventDefault()
        console.dir(event)
        switch (event.target.id) {
            case "new-project-form":
                let budgetName = event.target.elements[0].value
                let budgetAmount = event.target.elements[1].value
                if ((budgetName === "") || (budgetAmount === "")){
                    window.alert("Please remember to fill in both Name and Amount")
                } else {
                    postNewBudget(budgetName, budgetAmount)
                }
                break;
            case "new-line-item-form":
                let lineItemName = event.target.elements[0].value
                let lineItemAmount = event.target.elements[1].value
                let budgetId = event.target.parentNode.dataset.id
                let lineItemstatus = 'Tentative'
                if ((lineItemName === "") || (lineItemAmount === "")){
                    window.alert("Please remember to fill in both Name and Amount")
                } else {
                    postNewLineItem(lineItemName, lineItemAmount, budgetId, lineItemstatus)
                }
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
        hideNewForm()
        fetchBudgets()
    })
}

const postNewLineItem = (lineItemName, lineItemAmount, budgetId, lineItemstatus) => {
    console.log(lineItemName)
    fetch(`http://localhost:3000/line_items`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({budget_id: budgetId, amount: lineItemAmount, status: lineItemstatus, name: lineItemName})
    })
    .then(response => response.json())
    .then(LineItem => {
        console.dir(LineItem)
        fetchBudget(budgetId)
        newLineItemForm.style.display = "none"
    })
}

const deleteBudget = (budjetObj) => {
    console.dir(budjetObj)
    fetch(`http://localhost:3000/budgets/${budjetObj.dataset.id}`, {
        method: "DELETE"
    })
    .then(data => {
        console.log("deleting")
        homepageRender()
    })
}

const approveLineItem = lineItemElement => {
    fetch(`http://localhost:3000/line_items/${lineItemElement.dataset.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            status: "Accepted"
        })
    })
    .then(response => response.json())
    .then(newLineItem => fetchBudget(newLineItem.budget_id))
}

const addApproveButton = appendingElement => {
    let approveButton = appendingElement.getElementsByClassName("approve-button btn btn-primary")[0]
    if (appendingElement.getElementsByClassName("card-status")[0].innerText === "Accepted"){
        approveButton.style.display = "none"
    }
}

document.getElementById('export-google').addEventListener("click", event =>{
    console.log("listenerworking")
    fetch(`http://localhost:3000/budgets/${dropDownDiv.children[0].value}`)
    .then(response => response.json())
    .then(budgetObj => {
            let input = parseInputForSheets(budgetObj)
            gapi.client.sheets.spreadsheets.create({
                properties: {
                title: budgetObj.name + " " + budgetObj.total_amount
                }
            }).then((response) => {
                let ssId= response.result.spreadsheetId
                let spreadsheetURL = response.result.spreadsheetUrl
                console.log(spreadsheetURL)
                let exportLink = document.getElementById("export-link")
                exportLink.href = spreadsheetURL
                document.getElementById("url-display").style.display = "block"
                var body = {
                    majorDimension: "COLUMNS",
                    values: input
                };
                gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: ssId,
                    range: "A1:Z1000",
                    valueInputOption: "USER_ENTERED",
                    resource: body
                }).then((response) => {
                    var result = response.result;
                    console.log(`${result.updatedCells} cells updated.`);
                });
            });
    })
})

function parseInputForSheets(budgetObj){
    let lineItemName = ["Name"]
    let lineItemAmount = ["Amount"]
    let lineItemStatus = ["Status"]
    budgetObj.line_items.forEach(lineItem => {
        lineItemName.push(lineItem.name)
        lineItemAmount.push(lineItem.amount)
        lineItemStatus.push(lineItem.status)
    })
    let result = [lineItemName, lineItemAmount, lineItemStatus]
    return result
}

const calculateAmountSpent = budgetObject => {
    let totalSpent = budgetObject.line_items.reduce(lineItemReducer, 0)
    return totalSpent
}

const lineItemReducer = (total, num) => {
    return total + num.amount
}

const calculateAmountRemaining = budgetObject => {
    let totalAmount = budgetObject.total_amount
    return (totalAmount - calculateAmountSpent(budgetObject))
}

const calculatePercentageSpent = budgetObject => {
    let totalAmount = budgetObject.total_amount
    let amountSpent = calculateAmountSpent(budgetObject)
    return Math.ceil(amountSpent * 100/totalAmount)
}

const convertToDollars = number => {
    let numberWithCommas =  Number(Math.abs(number)).toLocaleString('en')
    if (number < 0){
        return ("-$" + numberWithCommas)
    } else {
        return ("$" + numberWithCommas)
    }
}

const formatAmountsInDiv = budgetElement => {
    console.log("formatting")

    let threeElements = [document.getElementById("budget-amount"), document.getElementById("amount-spent"), document.getElementById("amount-remaining")]
    threeElements.forEach(element => {
        let span = element.children[0]
        if (parseInt(span.innerText) < 0) {
            span.style.color = "red"
        }
        span.innerText = convertToDollars(span.innerText)
    })
}

