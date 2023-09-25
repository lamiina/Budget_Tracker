/*
        http://localhost:8080/transactions - get all, post, put, delete transactions
        http://localhost:8080/transactions/paged?page={number} - paged get transactions

        http://localhost:8080/categories - get all, post, put, delete categories
*/


//FILTERING FOR CATEGORIES
// http://localhost:8080/categories/filter?description=food


// query for filtering and pagination FOR TRANSACTIONS
// http://localhost:8080/transactions/filter?categoryType=EXPENSE&page=0&size=10

// full query containing all filters
//http://localhost:8080/transactions/filter?startDate=2023-08-01&endDate=2023-08-31&category=Food&categoryType=EXPENSE&page=0&size=10


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
        console.log(error)
    }

}

const getCategory = async (description, type) => {

     try {
        const response = await fetch(`http://localhost:8080/categories/filter?description=${description}&type=${type}`)
        const data = await response.json()

        return data

    } catch (error) {
        
    }

}


const deleteFromDataBase = (url, itemIdToDelete, load) => {
     
    fetch(`${url}/${itemIdToDelete}`, {
       method: "DELETE",
       headers: {
         "Content-Type": "application/json"
       },
     })
    .then((response) => {
        if (!response.ok) {
        throw new Error(`Failed to delete item (status ${response.status})`)
        }

        if(response.status === 204){
            load()
        }
    })
    .then((data) => {
        console.log("Item deleted successfully", data)
    })
    .catch((error) => {
        console.error("Error:", error)
    })
} 


const sendToDataBase = (url, object, load) => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: object,
  })
    .then((response) => {
      console.log("Server response:", response)

      if (response.status === 500) {
        successMessage("Category already exists!", "red")
      }

      if (response.status === 201) {
        load()
      }

      if(response.ok === "false"){
        successMessage("Something went wrong!", "red")
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error)
    })
}



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
    const {description, id} = args

    const option = document.createElement("option")
    option.value = description
    option.innerText = description

   return option
}

const filterOptionTransaction = (args) => {
  const { description, type, id } = args

  const option = document.createElement("option")
  option.value = `${description}-${type.toLowerCase()}`
  option.innerText = `${description}-${type.toLowerCase()}`
  option.setAttribute("id", id)

  return option
}

const transaction = (args) => {
    const {date, details, amount, category, id} = args

    const element = listElement(
      `
    <span>${date}</span>
    <span>${details}</span>
    <span>${category.description}</span>
    <span>$ ${amount}</span>
    `
    )

    element.setAttribute("id", id)

    return element
}


const categoryElement = (args) => {
    const {description, type, id} = args
    
    const element = listElement( 
    `
    <span>${description}</span>
    <span>${type.toLowerCase()}</span>
    `
    )

    element.setAttribute("id", id)
  
    return element
}


const addDeleteFunctionality = (element, url) => {
    const deleteIcon = document.createElement("span")
    deleteIcon.classList.add("delete_element")
    deleteIcon.classList.add("hide")


    deleteIcon.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"></path></svg>` 

    element.appendChild(deleteIcon)

    element.addEventListener("mouseover", (e) => {
        deleteIcon.classList.remove("hide") 

    })

    element.addEventListener("mouseout", (e) => {
        deleteIcon.classList.add("hide")
        
    })

    deleteIcon.addEventListener("click", () => {
        const id = element.id
    
        deleteFromDataBase(url ,id, () => { 
            loadElements(simpleBarContainer, categoriesURL, categoryElement, addDeleteFunctionality)
            loadTransactions(transactions, paginationURL, transaction, true)
            successMessage("Item has been deleted!", "yellow")
        })
    })
}

const deleteEvents = (children) => {
  for (const child of children) {
    const clone = child.cloneNode(true)
    child.parentNode.replaceChild(clone, child)
  }
}


// Load functions

const load = (parent,items, childTemplate, deleteFunc, url) => {
    
    items.map((element, index) => {
        const { ...args } = element
        const child = childTemplate(args)

        if (index === 0 && child.tagName === "OPTION") {
          const stockOption = document.createElement("option")
          stockOption.innerText = "All"
          stockOption.value = ""
          parent.appendChild(stockOption)
        }

        if(deleteFunc){
            deleteFunc(child, url)
        }

        parent.appendChild(child)
    })
}

// load transactions takes as last parameter a boolean to signify if the pagination should be updated or not

const loadTransactions = (parent, url, childTemplate, ifPagination) => {

  getData(url).then((data) => {

    const elementsWithEventListeners = parent.children

    deleteEvents(elementsWithEventListeners)

    parent.innerHTML = ""

    const paginatedItems = data.content
    const pages = data.totalPages

    load(parent, paginatedItems, childTemplate, addDeleteFunctionality, transactionsURL)

    if (ifPagination) {
      loadPagination(pages)
    }
  })
}
 

const loadElements = (parent, url, childTemplate, func) => {

    if(func){
        const elementsWithEventListeners = parent.children
        deleteEvents(elementsWithEventListeners)
    }
    
    parent.innerHTML = ""
    getData(url).then(data => {

        if(Array.isArray(data)){
            load(parent, data, childTemplate, func, url)

        } else {
            loadTransactions(parent, url, childTemplate, true)  
        }
    })

}


                    // PAGINATION FUNCTIONALITY

const paginationContainer = document.getElementById("pagination_container")
const pagination = document.getElementById("pagination")


const loadPagination = (pages) => {
    
    const paginationButtonElements = pagination.children
   
    deleteEvents(paginationButtonElements)

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


// Loading when app starts

loadElements(categoryFilters, categoriesURL, filterOption)
loadElements(transactions, paginationURL, transaction, addDeleteFunctionality)
loadElements(simpleBarContainer, categoriesURL, categoryElement, addDeleteFunctionality)







// Function for displaying submission success for category or transaction
 const successMessageContainer = document.getElementById("success_message")

const successMessage = (message, color) => {
    successMessageContainer.innerHTML = `<p>${message}</p>`
    successMessageContainer.classList.remove("hide")

    const colors = {
      green: "3px solid rgb(6, 191, 6)",
      yellow: "3px solid #edbf6b",
      red: "3px solid rgb(233, 78, 78)",
    }

    successMessageContainer.style.animationName = "popIN"
    successMessageContainer.style.border = colors[color]

    setTimeout(() => {
       
        successMessageContainer.style.animationName = "popOUT"

        successMessageContainer.addEventListener("animationend", () => {
        successMessageContainer.classList.add("hide")
        successMessageContainer.style.animationName = "" 

       },{ once: true }
     )
    }, 3000)

}


                                        // Add transaction functionality

const addTransactionTrigger = document.body.querySelector(".container button")
const addTransactionPopup = document.body.querySelector(".add_transactions_popup")
const addTransactionForm = document.getElementById("add_transaction_form")
const closeAddTransaction = document.body.querySelector(".add_transactions_popup .top button")


// function for removing the errors of the popups when closed

const undoErrors = (parent) => {
    const elements = parent.querySelectorAll(`[name]`)
    const textError = parent.querySelector(`.error_text`)

    console.log(elements)

    textError.innerText = ""

    for (const el of elements) {
        el.value = ""
        if (el.classList.contains("error")) {
        el.classList.remove("error")
        }
    }
}

const popupFunctionality = (pop, close, parent) => {

    pop.addEventListener("click", () => {
      parent.classList.remove("hide")
      document.body.classList.add("stop_scroll")
    })

    close.addEventListener("click", (e) => {
      undoErrors(parent)
      document.body.classList.remove("stop_scroll")
      parent.classList.add("hide")
    })

}





// events for add transaction

popupFunctionality(addTransactionTrigger, closeAddTransaction, addTransactionPopup)


// load categories inside add transaction | loading when app starts

const selectCategoryContainer = document.getElementById("select_category")
loadElements(selectCategoryContainer, categoriesURL, filterOptionTransaction)



// ADD TRANSACTION FORM

// const errorContainerTransactions = document.getElementById("error_text_transactions")


const checkIfDescriptionAndTypeMatch = (description, type, category) => {
    const findHalf = category.indexOf("-")

    const categoryName = category.slice(0, findHalf).toLowerCase()
    const categoryType = category.slice(findHalf + 1, category.length).toLowerCase()

    const nameFromOutside = description.toLowerCase()
    const typeFromOutside = type.toLowerCase()

    return categoryName === nameFromOutside && categoryType === typeFromOutside
  
}

const validation = (object, e, errorTextContainer) => {

  for (const key in object) {
    if (object[key].length <= 0) {
      errorTextContainer.innerText = "Please fill all inputs"
      e.target.querySelector(`[name = ${key}]`).classList.add("error")
    } else {
      e.target.querySelector(`[name = ${key}]`).classList.remove("error")
    }
  }
}

const checkIfContainsError = (e) => {
    const errorContainers = e.target.querySelectorAll(".error")

    for (const element of errorContainers) {
        if (element.classList.contains("error")) {
        return true
        }
    }

    return false
}

const postTransaction = (object, e) => {
    const select = e.currentTarget.querySelector("select")
    const idFromHtml = select.options[select.selectedIndex].id

    const newObj = { ...object }

    newObj.category = {
    id: idFromHtml,
    }

    const jsonObject = JSON.stringify(newObj)

    sendToDataBase(transactionsURL, jsonObject)
    loadTransactions(transactions, paginationURL, transaction, true)
    successMessage("Transaction has been added!", "green")
}

const processValidation = (object, e, successFunc) => {

  const errorTextContainer = e.target.parentNode.querySelector(".error_text")  

  validation(object, e, errorTextContainer)

  
  if (!checkIfContainsError(e)) {
    successFunc(object, e)

    errorTextContainer.innerText = ""
    e.target.reset()

  }
}

addTransactionForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const formObject = Object.fromEntries(formData)

    processValidation(formObject, e, postTransaction)


})


                                    //  Categories functionality 

const categoriesTrigger = document.body.querySelector(".container button:last-of-type")
const categoriesPopup = document.body.querySelector(".categories_popup")
const closeCategories = document.body.querySelector(".categories_popup .top button")
const categoriesForm = document.body.querySelector(".categories_popup form")


// events for categories

popupFunctionality(categoriesTrigger, closeCategories, categoriesPopup)


const postCategory = (object) => {

  const formObject = {...object}
  formObject.type = object.type.toUpperCase()

  const jsonObject = JSON.stringify(formObject)

  sendToDataBase(categoriesURL, jsonObject, () => {loadElements(simpleBarContainer, categoriesURL, categoryElement, addDeleteFunctionality)})
 
  successMessage("Category has been added!", "green")
}


categoriesForm.addEventListener("submit", (e) => {
    e.preventDefault()


    const formData = new FormData(e.currentTarget)
    const formObject = Object.fromEntries(formData)

    processValidation(formObject, e, postCategory)
})


// 1

// make a checkbox select functionality so you can delete multiple transactions at once
// remember gmail example


//2 

// filter functionality

// YOU SHOULD FIRST TEST OUT HOW THE QUERY WORKS FIRST


// when I click on a type or a category the select must have an event listener (on each select of on the options)
// the event must call the api and filter either type or category or date and range


// structure of the filter function

// it should store or take teh current query and add or take out certain queries 



// 3

// Find out how to show loading bar while loading transactions 


// 4 

// you need to make a functionality that allows you to edit categories


