// Clientside

const deleteBtn = document.querySelectorAll('.fa-trash')

// we have selected all trashcans using that font awesome for the trash cans
    // that's the class that came with the trashcans, 

const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
// When we click on items that are strikedthrough, that what we listen for. Opposite of clicking on items to place a strikethrough on them
// When this request makes it to the server, it marks 'complete: false' on server.js
// we have two different puts. One to handle the completing, and the other to handle the uncompleting (which is this one)


// when we click 'Get Pizza', two big things happen
    // one step was updating the database and the other step was getting those changes so we can see what happened the dom
// first step, the updating
    // it heard the click on the pizza
    // what's the only thing that could hear that click on our client side
        // our smurf (event listner) in our client side JavaScript
            // 'const item = document.querySelectorAll('.item span')' we set up the click event, we grabbed all the spans that were inside those <li>s wtih the class of item 
// when we clicked on 'Get Pizza', that marked complete function ran:
    // Array.from(item).forEach((element)=>{
    //     element.addEventListener('click', markComplete)
    // })
        //we gave every span the ability to run the mark complete function

// Here we have our client side JavaScript listening to those clicks
// So we actually have three smurfs, three event listners listening to those clicks
// We are looking for what we clicked on
    // we're saying find all the spans inside something that has the class of item


Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// we went along here and added a delete eventlistner
    // which runs the deleteItem function

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// when we clicked on 'Get Pizza' on the client side, the markComplete function ran
// in the index.ejs, the li has the class of "item" <li class="item">
// we are actually able to listen for the clicks on the span that are inside of <li> that had the class of item
// and so here we grabbed all the spans inside of the <li>'s because there are at least three <li>s that are on our page right now
// We grab all those spans and we acutally loop through them adding a smurf 
    // smurf meaning: adding an event listener to each one of our spans that we can click on
// Clicks don't come for free
    // there has to be something listening to that click
    // we set up our client side JS to listen to those clicks
// All three of them wind up an event listner that runs a fucntion called aht?
    // every single one of our smurfs is going to follow a specific set of instructions when they hear the click. What set of instructions is going to run?
        // The event listener is going to call the "markComplete" function
// Scroll down to find this function


Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
// 'this': we clicked on the trashcan. 'this' is the trashcan we clicked on
// 'parentNode': we went from the <span> to the <li>
// 'childNodes[1]' we selected the first child node which had the <span> that had text ('innerText')inside of it
// 'innerText': grab that text which was e.g. 'Get Pizza'
// All this is as if we have 'const itemText = Get Pizza'

// Then, once again we're going to make a fetch to our server down below here
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    // ^ that fetch is goign to have the route of 'deleteItem' and it's going to send along that request body that has the item text of 'Get Pizza'
        // as if ''itemFromJS': itemText' is actually ''itemFromJS': Get Pizza'
// So this request leaves our client side, goes to the server where the gremlin is ready to hear that request

    }catch(err){
        console.log(err)
    }
}


// The 'markComplete' function is really doing one important thing, it's grabbing the thing we just clicked on: 'this.parentNode.childNodes[1].innerText'
    // The thing we clicked on is the span

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    // hate using child nodes parent node stuff, but good to see it to get exposed to it before we move on from it
    // 'const itemText = this.parentNode.childNodes[1].innerText' what's this doing?
        // we were able to go ahead and grab that text of 'Get Pizza' out of the dom
            // so item text is going to hold 'Get Pizza'
        // What are we going to do with that 'Get Pizza' text?
            // ''itemFromJS': itemText' we're going to send it with the request
                // we can see that down below
// First thing we are going to do is grab the text 'const itemText = this.parentNode.childNodes[1].innerText', because we are going to update something in our database, we need to know what we're going to update
    // if we don't have 'Get Pizza' there's nothing we can do on the server side 
        // We won't know what to update
    // 'const itemText = this.parentNode.childNodes[1].innerText' this grabbed 'Get Pizza'
    // Now wherever we see 'itemText', it's get pizza

// What's the name I have to use if I want the text 'Get Pizza' on my server side? 
    // 'itemFromJS', that is what going to be holding 'Get Pizza'
    // this request

    try{
        const response = await fetch('markComplete', {
// 'markComplete' is our route
    // check 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
// This is activated by our 'server.js,' file with 'response.json('Marked Complete')'
// 'const data = await response.json()' this is going to grab response as data
        console.log(data)
// we can console log to the client side that it was marked complete
        location.reload()
// then the client side will do all the heavy lifting for us 'location.reload()' and do what? REFRESH
// when it refreshes, we're going to make what kind of request? A get request
// The get request will trigger the Gremlin that will go to our 'todos' in server.js, and find all the documents using 'db.collection('todos').find().toArray()' 
    // and we pass the documents into our EJS to be rendered using '.render('index.ejs', { items: data, left: itemsLeft })'
    // it will render out one of two spans:
        // '<span class='completed'><%= items[i].thing %></span>' 
        // <% }else{ %>
        //'<span><%= items[i].thing %></span>
// all this will respond with the updated html


    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}