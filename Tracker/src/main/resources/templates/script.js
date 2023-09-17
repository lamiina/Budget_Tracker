/*
        http://localhost:8080/transactions - get all, post, put, delete transactions
        http://localhost:8080/transactions/paged?page={number} - paged get transactions

        http://localhost:8080/categories - get all, post, put, delete categories
*/


                    //Accessing DB function

const url = "http://localhost:8080/categories"
const url2 = "http://localhost:8080/transactions"

const getData = async (url) => {

    try {
        const response = await fetch(url)
        const data = await response.json()

        console.log(data)

        return data

    } catch (error) {
        
    }

}

// getData(url)
getData(url2)


                    // Loading application functionality

const categoryFilters = document.getElementById("category_filter")
const transactions = document.body.querySelector(".transactions_container")
const categoriesList = document.getElementById("categories_list")


// Scroll functionality for categories - IMPORTANT!!! 

// SIMPLEBAR CONTAINER LOADS BEFORE I GET TO FETCH THE CATEGORIES SO THAT IS WHY I AM ABLE TO JUST APPEND THEM
const scrollbar = new SimpleBar(document.getElementById("categories_list"))
const simpleBarContainer = document.body.querySelector(".simplebar-content")



// Template functions for loading certain elements

const filterOption = (args) => {
    const {description} = args

    const option = document.createElement("option")
    option.value = description
    option.innerText = description

   return option
}

const transaction = (args) => {

    const {date, details, amount, category} = args

    const listElement = document.createElement("li")
    listElement.innerHTML = 
    `
    <span>${date}</span>
    <span>${details}</span>
    <span>${category.description}</span>
    <span>$ ${amount}</span>
    `

    return listElement
}

const categoryElement = (args) => {
    const {description, type} = args
    
    const listElement = document.createElement("li")
    listElement.innerHTML = 
    `
    <span>${description}</span>
    <span>${type.toLowerCase()}</span>
    `
  
    return listElement
}



// Load function

const loadElements = (parent, url, childTemplate,) => {
    
    getData(url).then(data => {
        data.map(element => {
            const { ...args } = element
            const child = childTemplate(args)
            parent.appendChild(child)
        })
    })
    
    
}





loadElements(categoryFilters, url, filterOption)
loadElements(transactions,url2, transaction)
loadElements(simpleBarContainer, url, categoryElement)







// here I will need to make a function that loops through the transactions that need to be displayed and append them - if you need reference you have it is some old folders 

// Function for adding/removing popups

const handlePopup = () => {

}


// Add transaction functionality

const addTransactionTrigger = document.body.querySelector(".container button")
const addTransactionPopup = document.body.querySelector(
  ".add_transactions_popup"
)

const addTransactionBtn = document.getElementById("add_transaction_btn")
console.log(addTransactionTrigger)


// events for add transaction
addTransactionTrigger.addEventListener("click", () => {
   addTransactionPopup.classList.remove("hide")
})

addTransactionBtn.addEventListener("click", () => {
    addTransactionPopup.classList.add("hide")
})




//  Categories functionality 

const categoriesTrigger = document.body.querySelector(
  ".container button:last-of-type"
)
const categoriesPopup = document.body.querySelector(
  ".categories_popup"
)

// events for categories

categoriesTrigger.addEventListener("click", () => {
    categoriesPopup.classList.remove("hide")
})


