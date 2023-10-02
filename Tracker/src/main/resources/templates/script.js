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
const paginationURL = "http://localhost:8080/transactions/paged?"

const getData = async (url) => {

    try {
        const response = await fetch(url)

           if (!response.ok) {
                if (response.status === 404) {
                    console.log("Resource not found (404)")
                
                } else {
                    console.error(`Server returned status: ${response.status}`)
                
                }
                
                return null 
            }
            
        const data = await response.json()
       
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

        if(response.status === 204 && load){
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

      if (response.status === 201 || response.status === 200) {
        load()
      }

      if(response.ok === "false"){
        successMessage("Something went wrong!", "red")
      }

      return response
    })
    .catch((error) => {
      console.error("Fetch error:", error)
    })
}



                    // Loading application functionality

const categoryFilters = document.getElementById("category")
const transactions = document.body.querySelector(".transactions_container")
const categoriesList = document.getElementById("categories_list")
const transactionsMainContainer = document.body.querySelector(".transactions")


// Scroll functionality for categories - IMPORTANT!!! 

// SIMPLEBAR CONTAINER LOADS BEFORE I GET TO FETCH THE CATEGORIES SO THAT IS WHY I AM ABLE TO JUST APPEND THEM
const scrollbar = new SimpleBar(document.getElementById("categories_list"))
const simpleBarContainer = document.body.querySelector(".simplebar-content")

// Checkbox functionality

// you will have to select the checkbox and delete button from the top of transactions

// you have to position the bar from top of the transactions when it s on small viewport

const selectionForDeletionContainer = document.body.querySelector(".selection_for_deletion")
const countForDeletion = document.getElementById("count_for_deletion")

const highlightSelectedTransactions = () => {
    const transactionElements = Array.from(transactions.children)

    
    const checkedItems = transactionElements.filter((node) => {
        if (node.querySelector("input").checked) {
            node.classList.add("selected")
            
            return node
        } else {
            node.classList.remove("selected")
        }
    })

    countForDeletion.innerText = checkedItems.length

    return checkedItems
}

const addCheckboxFunctionality = (element) => {
    
    element.addEventListener("click", (e) => {
        e.stopPropagation()


        const checkedItems = highlightSelectedTransactions()
       

        console.log(checkedItems)


        if(checkedItems.length > 0){
            selectionForDeletionContainer.classList.add("flex")
        } else {
            selectionForDeletionContainer.classList.remove("flex")
        }
    
  })
}

const closeSelectionForDeletion = document.querySelector(".close_selection_for_deletion")

closeSelectionForDeletion.addEventListener("click", () => {
    selectionForDeletionContainer.classList.remove("flex")

    highlightSelectedTransactions().map(node =>{
        node.querySelector("input").checked = false
        node.classList.remove("selected")
    })
})

const selectAllCurrentTransactions = document.querySelector("[name=select_all_transactions]")

selectAllCurrentTransactions.addEventListener("click", e => {
    const transactionElements = Array.from(transactions.children)

    if(e.target.checked){
        countForDeletion.innerText = transactionElements.length
        selectionForDeletionContainer.classList.add("flex")

        transactionElements.map(node => {
            node.querySelector("input").checked = true
            node.classList.add("selected")
        }) 
    } else {
        countForDeletion.innerText = 0
        selectionForDeletionContainer.classList.remove("flex")

        transactionElements.map((node) => {
            node.querySelector("input").checked = false
            node.classList.remove("selected")
        }) 
    }
})

const deleteSelectedItemsButton = document.body.querySelector(".delete_element")


// here the backend has to implement multiple id deletion
const deleteSelectedItems = async () => {
  const checkedItems = highlightSelectedTransactions()

  const deleteItems = checkedItems.map((node) => {
    const { id } = node

    deleteFromDataBase(transactionsURL, id)
  })

  const deletion = Promise.all(deleteItems)

  deletion.then(notUsed => {

      loadTransactions(transactions, paginationURL, transaction, true)
      successMessage("Items have been deleted!", "yellow")
      selectionForDeletionContainer.classList.remove("flex")
  })


}


deleteSelectedItemsButton.addEventListener("click", e => {
    deleteSelectedItems()
})


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
    <label class="checkbox_container"><input type="checkbox" name="check_for_deletion"></label>
    `
    )

    const checkbox = element.querySelector("input")


    addCheckboxFunctionality(checkbox)

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
    const deleteIcon = document.createElement("div")
    deleteIcon.classList.add("delete_element")
    deleteIcon.classList.add("hide")


    deleteIcon.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"></path></svg>` 

    element.appendChild(deleteIcon)

    element.addEventListener("mouseover", (e) => {
        deleteIcon.classList.remove("hide") 
        deleteIcon.classList.add("flex")

    })

    element.addEventListener("mouseout", (e) => {
        deleteIcon.classList.add("hide")
        deleteIcon.classList.remove("flex")
        
    })

    deleteIcon.addEventListener("click", () => {
        const id = element.id
    
        deleteFromDataBase(url ,id, () => { 
            loadElements(simpleBarContainer, categoriesURL, categoryElement, addDeleteFunctionality)
            loadTransactions(transactions, paginationURL, transaction, true)
            loadElements(categoryFilters, categoriesURL, filterOption)
            loadElements(selectCategoryContainer, categoriesURL, filterOptionTransaction)

            successMessage("Item has been deleted!", "yellow")

            selectionForDeletionContainer.classList.remove("flex")

            toggleEmptyCategoryMessage()
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

const toggleEmptyCategoryMessage = () => {
  const categoryContainer = document.body.querySelector(
    ".categories_list_container"
  )
  const h2 = categoryContainer.parentNode.querySelector(".length_alert")

  console.log(simpleBarContainer.children)

  if (simpleBarContainer.children.length <= 0) {
    categoryContainer.classList.add("hide")
    h2.classList.remove("hide")
  } else {
    categoryContainer.classList.remove("hide")
    h2.classList.add("hide")
    
  }
}

const loadTransactionMessage = (state) => {
  if (state) {
    selectionForDeletionContainer.classList.add("hide_2")
    transactionsMainContainer.classList.add("hide")
    paginationContainer.classList.add("hide_2")
    emptyFilterSearch.classList.remove("hide")

  } else {
    selectionForDeletionContainer.classList.remove("hide_2")
    transactionsMainContainer.classList.remove("hide")
    paginationContainer.classList.remove("hide_2")
    emptyFilterSearch.classList.add("hide")

  }
}

const load = (parent,items, childTemplate, deleteFunc, url) => {
    console.log(parent)
    console.log(items)

    if(items.length === 0 && parent.tagName === "SELECT"){
        const stockOption = document.createElement("option")
        stockOption.innerText = "Please add categories!"
        stockOption.value = ""
        parent.appendChild(stockOption)
    }


    items.map((element, index) => {
    const { ...args } = element
    const child = childTemplate(args)

    if (index === 0 && child.tagName === "OPTION") {
        const stockOption = document.createElement("option")
        stockOption.innerText = "All"
        stockOption.value = ""
        parent.appendChild(stockOption)
    }

    // console.log(items)

    if (items.length === 0) {
        console.log("da", items)
    }

    if (deleteFunc) {
        deleteFunc(child, url)
    }

    parent.appendChild(child)
    })

    
    if(parent.classList.contains("simplebar-content")){
        toggleEmptyCategoryMessage()
    }
    
    
}

// load transactions takes as last parameter a boolean to signify if the pagination should be updated or not

const emptyFilterSearch = document.querySelector(".filter_message")


const loadTransactions = (parent, url, childTemplate, ifPagination) => {

    const elementsWithEventListeners = parent.children

    deleteEvents(elementsWithEventListeners)

    parent.innerHTML = ""

  getData(url).then((data) => {

    
    if(data.content.length === 0){
  
        // if transactions don t exist show no transactions found 
        loadTransactionMessage(true) 
    
    } else {
      // if transactions exist hide the message
      loadTransactionMessage(false) 

      const paginatedItems = data.content
      const pages = data.totalPages

      load(
        parent,
        paginatedItems,
        childTemplate,
        addDeleteFunctionality,
        transactionsURL
      )

      if (ifPagination) {
        loadPagination(pages, url)
      }
    }

  }).catch(error => console.log(error))
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
            // console.log(data)

            return true
        } else {
            loadTransactions(parent, url, childTemplate, true)  
            // console.log(data.content.length)
           
        }
    }).catch(error => console.log(error))

}


                    // PAGINATION FUNCTIONALITY

const paginationContainer = document.getElementById("pagination_container")
const pagination = document.getElementById("pagination")


const loadPagination = (pages, url = "http://localhost:8080/transactions/paged?") => {
    
    const paginationButtonElements = pagination.children
   
    deleteEvents(paginationButtonElements)

    pagination.innerHTML = ""

    for(let i  = 0; i < pages; i++){
        const paginationElement = listElement(i + 1)

        if(i === 0){
            paginationElement.classList.add("current_page")
        }


        paginationElement.addEventListener("click", (e) => {
            const paginationURL = `${url}page=${i}`
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

                                    // filter functionality

const filterContainer = document.body.querySelector(".filters")
const allInputsAndSelects = filterContainer.querySelectorAll("input, select")
const filters = Array.from(allInputsAndSelects)

const generateFilterQuery = (query, inputValues) => {
    const finalQuery = Object.entries(inputValues).reduce(
      (accumulator, [key, value]) => {
      
        return accumulator + `${key}=${value}&`
    },query)

    return finalQuery
}

const handleFilters = async () => {
  const inputValues = filters.reduce((accumulator, currentItem) => {
    const { value, id } = currentItem

    if (value.length > 0) {
      if (id === "categoryType") {
        accumulator[id] = value.toUpperCase()
      } else {
        accumulator[id] = value
      }
    }

    return accumulator
  }, {})

  const query = `http://localhost:8080/transactions/filter?`

  const finalQuery = generateFilterQuery(query, inputValues)

  const lengthOfQuery = Object.entries(inputValues).length


  if(lengthOfQuery > 0){
      loadTransactions(transactions, finalQuery, transaction, true)

  } else {
    loadElements(
      transactions,
      paginationURL,
      transaction,
      addDeleteFunctionality
    )
  }

}



filters.map(input => {
    input.addEventListener("change", (e) => {
        const {id, value} = e.target
        handleFilters()
        
        if (id === "categoryType" && value.length > 0) {
            const url = `${categoriesURL}/filter?type=${value.toUpperCase()}` 
            
            loadElements(categoryFilters, url, filterOption)
        }
    
    })
})



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

    pop.addEventListener("click", (e) => {
      parent.classList.remove("hide")
      document.body.classList.add("stop_scroll")
      console.log(parent)
      toggleEmptyCategoryMessage()

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

    sendToDataBase(transactionsURL, jsonObject, () => {
        loadTransactions(transactions, paginationURL, transaction, true)
        successMessage("Transaction has been added!", "green")
    })
}

const processValidation = (object, e, successFunc) => {

  const errorTextContainer = e.target.parentNode.querySelector(".error_text")  

  validation(object, e, errorTextContainer)

  
  if (!checkIfContainsError(e)) {
    successFunc(object, e)

    errorTextContainer.innerText = ""
    e.target.reset()

    filters.map(input => {
        input.value = ''
    })

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

    const result = sendToDataBase(categoriesURL, jsonObject, () => {
        console.log(loadElements(simpleBarContainer, categoriesURL, categoryElement, addDeleteFunctionality))
        loadElements(selectCategoryContainer, categoriesURL, filterOptionTransaction)
        loadElements(categoryFilters, categoriesURL, filterOption)

       
    })
  
    console.log(result)
    
    successMessage("Category has been added!", "green")
}


categoriesForm.addEventListener("submit", (e) => {
    e.preventDefault()


    const formData = new FormData(e.currentTarget)
    const formObject = Object.fromEntries(formData)

    processValidation(formObject, e, postCategory)
    toggleEmptyCategoryMessage()
})



// 2


//224 has problems with displaying no results after deletion but it has to be fixed by the backend

// categories needs to notify user when there are no categories




// 3

// Find out how to show loading bar while loading transactions 

// could be based on the promise that is returned

// you could make a function that takes the parent as a argument and apply on the parent a blur effect and a loading animation that disappears when the promise has been resolved


// 4 

// you need to make a functionality that allows you to edit categories


// 5 

// when item is deleted pagination should load the page you are in
// you can make it in such a way that only at aa certain viewport you can actually hover
// if you add things to fast you can break the message animation