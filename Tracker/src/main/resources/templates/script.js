/*
        http://localhost:8080/transactions - get all, post, put, delete transactions
        http://localhost:8080/transactions/paged?page={number} - paged get transactions

        http://localhost:8080/categories - get all, post, put, delete categories
*/


                    //Accessing DB function

const categoriesURL = "http://localhost:8080/categories"
const transactionsURL = "http://localhost:8080/transactions"

const paginationURL = "http://localhost:8080/transactions/paged?page=0"

const getData = async (url) => {

    try {
        const response = await fetch(url)
        const data = await response.json()

        // console.log(data)

        return data

    } catch (error) {
        
    }

}

// getData(url)
getData(transactionsURL)


                    // Loading application functionality

const categoryFilters = document.getElementById("category_filter")
const transactions = document.body.querySelector(".transactions_container")
const categoriesList = document.getElementById("categories_list")


// Scroll functionality for categories - IMPORTANT!!! 

// SIMPLEBAR CONTAINER LOADS BEFORE I GET TO FETCH THE CATEGORIES SO THAT IS WHY I AM ABLE TO JUST APPEND THEM
const scrollbar = new SimpleBar(document.getElementById("categories_list"))
const simpleBarContainer = document.body.querySelector(".simplebar-content")



// Template functions for loading certain elements

const listElement = (content) => {

    const listElement = document.createElement("li")
    listElement.innerHTML = content

    return listElement
}

const filterOption = (args) => {
    const {description} = args

    const option = document.createElement("option")
    option.value = description
    option.innerText = description

   return option
}

const transaction = (args) => {

    // console.log(args)
    const {date, details, amount, category} = args

    const element = listElement(
      `
    <span>${date}</span>
    <span>${details}</span>
    <span>${category.description}</span>
    <span>$ ${amount}</span>
    `
    )

    return element
}

const categoryElement = (args) => {
    const {description, type} = args
    
    const element = listElement( 
    `
    <span>${description}</span>
    <span>${type.toLowerCase()}</span>
    `
    )
  
    return element
}



// Load functions


const load = (parent,items, childTemplate) => {
  items.map((element) => {
    const { ...args } = element
    const child = childTemplate(args)
    parent.appendChild(child)
  })
}

// load transactions takes as last parameter a boolean to signify if the pagination should be updated or not

const loadTransactions = (parent, url, childTemplate, ifPagination) => {

  getData(url).then((data) => {
    parent.innerHTML = ""

    const paginatedItems = data.content
    const pages = data.totalPages

    load(parent, paginatedItems, childTemplate)

    if (ifPagination) {
      loadPagination(pages)
    }
  })
}
 

const loadElements = (parent, url, childTemplate) => {
    
    getData(url).then(data => {

        if(Array.isArray(data)){
            load(parent, data, childTemplate)

        } else {
            loadTransactions(parent, url, childTemplate, true)  

        }
    })

}


const paginationContainer = document.getElementById("pagination_container")
const pagination = document.getElementById("pagination")


const loadPagination = (pages) => {

    // you need to delete all the vent listeners from the buttons before this is deleted

    pagination.innerHTML = ""

    for(let i  = 0; i < pages; i++){
        const paginationElement = listElement(i + 1)

        if(i === 0){
            paginationElement.classList.add("current_page")
        }


        paginationElement.addEventListener("click", (e) => {
            const paginationURL = `http://localhost:8080/transactions/paged?page=${i}`
            loadTransactions(transactions, paginationURL, transaction)

            const currentSelectedPage = pagination.querySelector(".current_page")
            currentSelectedPage.classList.remove("current_page")

            e.target.classList.add("current_page")

            // const childArray = Array.from(pagination.children)

            // childArray.map(element => {
            //     if(element.classList.contains("current_page")){
            //         console.log(element)
            //     }
            // }
        })

        pagination.appendChild(paginationElement)
    }

}


// pagination buttons functionality 

const paginationButtons = paginationContainer.querySelectorAll("button")

const addFunctionalityToPaginationButtons = () => {
    for(const button of paginationButtons){
        button.addEventListener("click", (e) => {
            const pages = pagination.children
            const currentPage = pagination.querySelector(".current_page")

           const nextClick =
             e.target.id === "left"
               ? Array.prototype.indexOf.call(pages, currentPage) - 1
               : Array.prototype.indexOf.call(pages, currentPage) + 1

            
            if(pages[nextClick]){
                pages[nextClick].click()
            }

        })
    }
}

addFunctionalityToPaginationButtons()


// Loading the app for the first time

loadElements(categoryFilters, categoriesURL, filterOption)
loadElements(transactions, paginationURL, transaction)
loadElements(simpleBarContainer, categoriesURL, categoryElement)







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


