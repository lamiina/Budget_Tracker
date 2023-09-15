// Accessible items

const addTransaction = document.body.querySelector(".container button")

console.log(addTransaction)


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


// Add transaction functionality

addTransaction.addEventListener("click", () => {
    console.log("da")
})