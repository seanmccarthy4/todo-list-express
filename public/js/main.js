const deleteBtn = document.querySelectorAll('.fa-trash') // variable for the trash cans
const item = document.querySelectorAll('.item span') // variable for the items/ tasks
const itemCompleted = document.querySelectorAll('.item span.completed') // variable for the completed items

Array.from(deleteBtn).forEach((element)=>{ // loops through the delete buttons and adds a click event listener
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // loops through the items and adds a click event listener
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ // loops through the items and adds a click event listener
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text from the item
    try{
        const response = await fetch('deleteItem', { // sends a fetch request to the server
            method: 'delete', // sends a delete request
            headers: {'Content-Type': 'application/json'}, // sets the headers to be used
            body: JSON.stringify({ // sends the body of the request
              'itemFromJS': itemText // sends the item text
            }) 
          }) 
        const data = await response.json() 
        console.log(data) // return the data
        location.reload() // refresh the page

    }catch(err){ // catches any errors that may occur
        console.log(err) // console logs any errors that may occur
    }
}

async function markComplete(){ // this function is going up to the parent, finding the item and then updating it
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text from the item
    try{ // try/catch is used to catch any errors that may occur
        const response = await fetch('markComplete', { // sends a fetch request to the server
            method: 'put', // sends a put request
            headers: {'Content-Type': 'application/json'}, // sets the headers to be used
            body: JSON.stringify({ // sends the body of the request
                'itemFromJS': itemText // sends the item text
            })
          })
        const data = await response.json()
        console.log(data) // return the data
        location.reload() // refresh the page

    }catch(err){ // catches any errors that may occur
        console.log(err) // console logs any errors that may occur
    }
}

async function markUnComplete(){ // this function is going up to the parent, finding the item and then updating it
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text from the item
    try{ // try/catch is used to catch any errors that may occur
        const response = await fetch('markUnComplete', { // sends a fetch request to the server
            method: 'put', // sends a put request
            headers: {'Content-Type': 'application/json'}, // sets the headers to be used
            body: JSON.stringify({ // sends the body of the request
                'itemFromJS': itemText // sends the item text
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}