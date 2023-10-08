localStorage.setItem("current_page", "")
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
const multiDeleteUrl = "http://localhost:8080/transactions/multiDelete"


const createTag = (tag, content) => {
  const createTag = document.createElement(tag)

  if(content){
      createTag.innerHTML = content
  }

  return createTag
}

const addTransactionsLoadingAnimation = () => {
    const loadingElement = createTag("div", `<span class="loader"></span>`)
    loadingElement.classList.add("loading_element")
    
    transactionsMainContainer.appendChild(loadingElement)
  
}

const removeTransactionsLoadingAnimation = () => {
    const loading = transactionsMainContainer.querySelector(".loading_element")
    transactionsMainContainer.removeChild(loading)
} 


const getData = async (url, loading) => {

    try {

        // load the animation for loading inside the parent component
        if(loading){
            addTransactionsLoadingAnimation()
        }

        const response = await fetch(url)

           if (!response.ok) {
                if (response.status === 404) {
                    console.log("Resource not found (404)")
                    loadTransactionMessage()

                    if (loading) {
                      removeTransactionsLoadingAnimation()
                    }
                
                } else {
                    console.error(`Server returned status: ${response.status}`)
                
                }
                
                return null 
            }
            
        const data = await response.json()



        // here you hide the loading
        if(loading){
            removeTransactionsLoadingAnimation()
        }
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

// 

const multipleDeletionFromDataBase = (url, array, load) => {
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: array,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to delete item (status ${response.status})`)
        }

        if (response.status === 204 && load) {
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

const editFromDatabase = (url, object, load) => {
     fetch(url, {
       method: "PUT",
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
            if(load){
                load()
            }
         }

         if (response.ok === "false") {
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


const deleteSelectedItems = async () => {
  const checkedItems = highlightSelectedTransactions()

  const itemsToDelete = checkedItems.map((node) => {
    const { id } = node
    return parseInt(id)
  })

  const jsonItemsToDelete = JSON.stringify(itemsToDelete)

 

  multipleDeletionFromDataBase(multiDeleteUrl, jsonItemsToDelete, () => {
    loadTransactions(transactions, getCurrentPageQuery(), transaction, true)
    successMessage("Items have been deleted!", "yellow")
    selectionForDeletionContainer.classList.remove("flex")
    selectAllCurrentTransactions.checked = false
  })
}


deleteSelectedItemsButton.addEventListener("click", e => {
    deleteSelectedItems()
})



// Template functions for loading certain elements

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

    const element = createTag("li",
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

    const lowerCaseType = type.toLowerCase()
    
    const element = createTag(
      "li",
    `
    <p class="flex">
        <span>${description}</span>
        <span>${lowerCaseType}</span>
    </p>

    <div class="edit_element hide">
        <input type="text" value=${description} name="edit">
        <div class="select">
            <select name="edit_type">
            
            <option value="${lowerCaseType}">${lowerCaseType}</option>

            ${
              lowerCaseType === "income"
                ? `<option value="expense">Expense</option>
                   <option value="investment">Investment</option>`
                : ""
            }

            ${
              lowerCaseType === "expense"
                ? `<option value="income">Income</option>
                   <option value="investment">Investment</option>`
                : ""
            }

            ${
              lowerCaseType === "investment"
                ? `<option value="income">Income</option>
                   <option value="expense">Expense</option>`
                : ""
            }
            </select>
            
        </div>
    </div>
    `
    )

    element.setAttribute("id", id)
  
    return element
}


const addHoverFunctionality = (element, icon) => {
   
    icon.classList.add("delete_element")
    

    element.appendChild(icon)

    element.addEventListener("mouseover", (e) => {
         const viewportWidth = window.innerWidth
        
         console.log(viewportWidth)

        if (viewportWidth >= 900) {
          icon.classList.remove("hide")
          icon.classList.add("flex")
        }
    })

    element.addEventListener("mouseout", (e) => {
        const viewportWidth = window.innerWidth
       

         if (viewportWidth >= 900) {
           icon.classList.add("hide")
           icon.classList.remove("flex")
         }
    })

}

const getAllDeleteButtons = () => {
    const deleteButtons = document.body.querySelectorAll(".transactions .delete_element")

    console.log(deleteButtons)
    return deleteButtons
}


let once = false

window.addEventListener('resize', function() {
  const viewportWidth = window.innerWidth;


  if (viewportWidth <= 900) {
    if(!once){
        getAllDeleteButtons().forEach(element => {
            element.classList.remove("hide")
        })
        once = true
    }

  } else {
    getAllDeleteButtons().forEach(element => {
        element.classList.add("hide")
    })
    once = false
 
  }

})



const editFunctionality = (element, icon) => {
    const id = element.id
    const url = `${categoriesURL}/${id}`

    let isToggled = false

    const currentTypeAndName = element.querySelector('p')
    const editContainer = element.querySelector(".edit_element")
    
    const spans = currentTypeAndName.children
    const editInputs = editContainer.children

    icon.addEventListener("click", (e) => {
    
        if(!isToggled){
            element.classList.add("edit_mode_active")
            currentTypeAndName.classList.replace("flex", "hide")
            editContainer.classList.replace("hide", "flex")

            editInputs[0].value = spans[0].innerText
            editInputs[0].setSelectionRange(editInputs[0].value.length,editInputs[0].value.length)
            editInputs[0].focus()

            console.log(spans[0], spans[1])
            console.log(editInputs[0], editInputs[1])
        } else {

            element.classList.remove("edit_mode_active")
            currentTypeAndName.classList.replace("hide", "flex")
            editContainer.classList.replace("flex", "hide")

            spans[0].innerHTML = editInputs[0].value
            spans[1].innerHTML = editInputs[1].querySelector("select").value

            const objForApi = {
                description: spans[0].innerHTML,
                type: spans[1].innerHTML.toUpperCase()
            }

            console.log(objForApi)
            const jsonObj = JSON.stringify(objForApi)
            editFromDatabase(url, jsonObj, ()=> {loadTransactions(transactions, paginationURL, transaction, true)} )
        }


        console.log(element)
        isToggled = !isToggled


    })

   const parentContainer = document.body.querySelector(".categories_popup")

   parentContainer.addEventListener("click", e => {
    if(!element.contains(e.target)){
            if(element.classList.contains("edit_mode_active")){

                currentTypeAndName.classList.replace("hide", "flex")
                editContainer.classList.replace("flex", "hide")
    
                spans[0].innerHTML = editInputs[0].value
                spans[1].innerHTML = editInputs[1].querySelector("select").value
                const objForApi = {
                  name: spans[0].innerHTML,
                  type: spans[1].innerHTML.toUpperCase(),
                }
    
                const jsonObj = JSON.stringify(objForApi)
                editFromDatabase(url, jsonObj, () => {
                  loadTransactions(
                    transactions,
                    paginationURL,
                    transaction,
                    true
                  )
                })

            }
    } 
   })
}

const getCurrentPageQuery = () => {
     const transactionElements = Array.from(transactions.children)
     const checkedItems = highlightSelectedTransactions()

     const currentPage = parseInt(localStorage.getItem("current_page"))

     console.log(transactionElements.length , checkedItems)

     if (transactionElements.length === checkedItems.length
        || transactionElements.length === 1) {
            console.log(`${paginationURL}${currentPage ? `page=${currentPage - 1}` : ""}`)

            localStorage.setItem("current_page", currentPage - 1)
        return `${paginationURL}${currentPage ? `page=${currentPage - 1}` : ""}`
     }



     return `${paginationURL}${currentPage ? `page=${currentPage}` : ""}`
}

const addDeleteAndEditFunctionality = (element, url, edit) => {


    const deleteIcon = createTag(
      "div",
      `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"></path></svg>`
    )

    addHoverFunctionality(element, deleteIcon)
    
    
    deleteIcon.addEventListener("click", () => {
        const id = element.id
    
        deleteFromDataBase(url ,id, () => { 
            loadElements(simpleBarContainer, categoriesURL, categoryElement, addDeleteAndEditFunctionality)
            loadTransactions(
              transactions,
              getCurrentPageQuery(),
              transaction,
              true
            )

            loadElements(categoryFilters, categoriesURL, filterOption)
            loadElements(selectCategoryContainer, categoriesURL, filterOptionTransaction)
            

            successMessage("Item has been deleted!", "yellow")

            selectionForDeletionContainer.classList.remove("flex")

            toggleEmptyCategoryMessage()
        })
    })

    if(edit){
         const editIcon = createTag(
           "div",
           `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2rem" width="1.2rem" xmlns="http://www.w3.org/2000/svg"><path d="M7,17.013l4.413-0.015l9.632-9.54c0.378-0.378,0.586-0.88,0.586-1.414s-0.208-1.036-0.586-1.414l-1.586-1.586	c-0.756-0.756-2.075-0.752-2.825-0.003L7,12.583V17.013z M18.045,4.458l1.589,1.583l-1.597,1.582l-1.586-1.585L18.045,4.458z M9,13.417l6.03-5.973l1.586,1.586l-6.029,5.971L9,15.006V13.417z"></path><path d="M5,21h14c1.103,0,2-0.897,2-2v-8.668l-2,2V19H8.158c-0.026,0-0.053,0.01-0.079,0.01c-0.033,0-0.066-0.009-0.1-0.01H5V5	h6.847l2-2H5C3.897,3,3,3.897,3,5v14C3,20.103,3.897,21,5,21z"></path></svg>`
         )

        addHoverFunctionality(element, editIcon)
        editFunctionality(element, editIcon)
        // add edit functionality
    }
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
    parent.innerHTML = ""

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


    if (deleteFunc) {
        console.log(parent.classList)
        if(parent.classList.contains("simplebar-content")){
            deleteFunc(child, url, true)
        } else {
            deleteFunc(child, url)

        }
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

    // parent.innerHTML = ""
    console.log(url, parent)

  getData(url, true).then((data) => {

    if(data === null){
        loadTransactionMessage(true) 
    }
      
    if(data.content.length === 0 || data === null){
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
        addDeleteAndEditFunctionality,
        transactionsURL
      )

      if (ifPagination) {
        loadPagination(pages)
        loadCurrentPage()

        
      }
    }

    return true
  }).catch(error => console.log(error))
}
 

const loadElements = (parent, url, childTemplate, func) => {

    if(func){
        const elementsWithEventListeners = parent.children
        deleteEvents(elementsWithEventListeners)
    }
    
    // parent.innerHTML = ""
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
        const paginationElement = createTag("li", i + 1)

        if(i === 0){
            paginationElement.classList.add("current_page")
        }


        paginationElement.addEventListener("click", (e) => {
            const paginationURL = `${url}page=${i}`
            loadTransactions(transactions, paginationURL, transaction)

            const currentSelectedPage = pagination.querySelector(".current_page")
            currentSelectedPage.classList.remove("current_page")

            e.target.classList.add("current_page")
            localStorage.setItem("current_page", i )
        })

        pagination.appendChild(paginationElement)
    }

}


// ARROW pagination buttons functionality 

const paginationButtons = paginationContainer.querySelectorAll("button")

const addFunctionalityToArrowPaginationButtons = () => {
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
                console.log(nextClick)
            }

        })
    }
}

addFunctionalityToArrowPaginationButtons()

const loadCurrentPage = () => {
    
    const page = localStorage.getItem("current_page")

    if(page !== ""){
        const currentPage = JSON.parse(page)
        const pages = Array.from(pagination.children)

      

        const currentSelectedPage = pagination.querySelector(".current_page")
        currentSelectedPage.classList.remove("current_page")

        pages.filter((element) => {
        const pageNum = parseInt(element.innerText)

        
            if (pageNum === currentPage + 1) {
                element.classList.add("current_page")
            }
        })

    }
  

//     console.log(pages)
    // return `${paginationURL}page=${currentPage}`
}


// The first load of the application



loadElements(categoryFilters, categoriesURL, filterOption)
loadElements(
  transactions,
  paginationURL,
  transaction,
  addDeleteAndEditFunctionality
)
loadElements(simpleBarContainer, categoriesURL, categoryElement, addDeleteAndEditFunctionality)








// Function for displaying submission success for category or transaction
 const successMessageContainer = document.getElementById("success_message")
 let messageTimeout

const successMessage = (message, color) => {
    clearTimeout(messageTimeout)

    successMessageContainer.innerHTML = `<p>${message}</p>`
    successMessageContainer.classList.remove("hide")

    const colors = {
      green: "3px solid rgb(6, 191, 6)",
      yellow: "3px solid #edbf6b",
      red: "3px solid rgb(233, 78, 78)",
    }

    successMessageContainer.style.animationName = "popIN"
    successMessageContainer.style.border = colors[color]

    messageTimeout = setTimeout(() => {
      successMessageContainer.style.animationName = "popOUT"

      successMessageContainer.addEventListener(
        "animationend",
        () => {
          successMessageContainer.classList.add("hide")
          successMessageContainer.style.animationName = ""
        },
        { once: true }
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

const handleFilters = (onlyType) => {
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

  console.log(inputValues)

  if(onlyType){
    delete inputValues?.category
  }



  const query = `http://localhost:8080/transactions/filter?`

  const finalQuery = generateFilterQuery(query, inputValues)

  const lengthOfQuery = Object.entries(inputValues).length




  if(lengthOfQuery > 0){
      loadTransactions(transactions, finalQuery, transaction, true)
      localStorage.setItem("current_page", 0)

  } else {
    loadElements(
      transactions,
      paginationURL,
      transaction,
      addDeleteAndEditFunctionality
    )

    loadElements(categoryFilters, categoriesURL, filterOption)
  }

}



filters.map(input => {
    input.addEventListener("change", (e) => {
        const {id, value} = e.target
        
        
        
        if (id === "categoryType" && value.length > 0) {
            const url = `${categoriesURL}/filter?type=${value.toUpperCase()}` 
            
            loadElements(categoryFilters, url, filterOption)
        }

        if(id === "categoryType"){
            handleFilters(true)
        } else {
            handleFilters()
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

    // return falsepaginationURL
}

const postTransaction = (object, e) => {
    const currentPage = localStorage.getItem("current_page")
    const select = e.currentTarget.querySelector("select")
    const idFromHtml = select.options[select.selectedIndex].id

    const newObj = { ...object }

    newObj.category = {
    id: idFromHtml,
    }

    const jsonObject = JSON.stringify(newObj)

    sendToDataBase(transactionsURL, jsonObject, () => {
        loadTransactions(
          transactions,
          getCurrentPageQuery(),
          transaction,
          true
        )
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
        console.log(loadElements(simpleBarContainer, categoriesURL, categoryElement, addDeleteAndEditFunctionality))
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




