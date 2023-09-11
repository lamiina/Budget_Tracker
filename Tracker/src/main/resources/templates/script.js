console.log("partar")

//ceva

const url = "http://localhost:8080/categories"

const getData = async (url) => {

    try {
        const response = await fetch(url)
        const data = await response.json()

        console.log(data)

    } catch (error) {
        
    }

}

getData(url)