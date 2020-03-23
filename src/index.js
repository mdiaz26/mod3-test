console.log("working")

document.addEventListener('DOMContentLoaded', () => {

    dropDownDiv = document.getElementById("drop-down-div")

    newForm = document.getElementById("new-project-form")
    newForm.style.display = "none"

    showFormBTN = document.getElementById("show-form-btn")

    showFormBTN.addEventListener("click", showForm)

    function showForm() {
        newForm.style.display = "block"
    }
    
    fetch('http://localhost:3000/budgets')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            renderDropDown(data);
        });


})

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
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
    <p>${budgetObject.amount}</p>
    <p>${budgetObject.status}</p>
    `

}