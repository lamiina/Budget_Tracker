//Accessing DB function

const url = "http://localhost:8080/categories"

const getData = async (url) => {

    try {
        const response = await fetch(url)
        const data = await response.json()

        console.log(data)

    } catch (error) {
        
    }

}

// getData(url)

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



// Scroll functionality for categories list 
const container = document.querySelector("[data-simplebar]")
const scrollbar = new SimpleBar(container)