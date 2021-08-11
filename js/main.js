console.log("Welcome to notes app!")

// if user adds a note, add it to localStorage
let addBtn = document.getElementById('addBtn');
let notesObj;
let notesDiv = document.getElementById('notes');

let deleteBtns = document.getElementsByClassName('deleteBtn');

//id of all delete buttons of all the note cards
let deleteBtn = [];

let addNoteTitle = document.getElementById('addNoteTitle');

let noteTitles;
let notesTitleObj;

let isMarkedImp = document.getElementById('isMarkedImp');
let impNotesObj;

let greetUsers = document.querySelector('#greetUsers');

let activeUser = localStorage.getItem('userActive');

let logingBtn = document.querySelector('#logingInBtn');
let loginBtn = document.querySelector('#loginBtn');

let warningAlert = `    <div class="alert alert-warning alert-dismissible fade show" role="alert" id='warning'
        >
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        <strong>*please sign up or your data might not get saved* <br>
            click on users
            and New user to sign up</strong>
    </div>`

let successAlert = `    <div class="alert alert-success alert-dismissible fade show" role="alert" id="success"
       >
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        <strong>User created and Logged in!!</strong>
    </div>`

let dangerAlert = `<div class="alert alert-danger alert-dismissible fade show" role="alert" id="wrongPswd"
                   >
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>wrong password, Please try again!!</strong>
                </div>`



addBtn.addEventListener('click', function () {
    let addTxt = document.getElementById('addTxt');
    // when user preses addBtn the text in addTxt i.e addTxt.value gets added in notes of activeUser in localStorage

    // lets get our activeUserData
    let activeUserData = localStorage.getItem(activeUser);

    //BUT activeUserData can also be null if the user has visited the website for the first time and if it is null it can give error when we try to append notes. so lets all of activeUser's Data an array so that we can edit it easily and then again store it in form of an array
    if (activeUserData == null) {
        notesObj = [];
        notesTitleObj = [];
        impNotesObj = [];
    }
    else {
        // if its not null it will have all our notes in an array which was stringified while adding data
        //therefore we will need to JSON.parse it to make it what it really is i.e an object and then extract required data

        notesObj = JSON.parse(activeUserData)['notes'];
        notesTitleObj = JSON.parse(activeUserData)['noteTitles'];
        impNotesObj = JSON.parse(activeUserData)['isImp'];
    }

    //now since addBtn is pressed we need to add text provided in addText to notesObj and so on...
    notesObj.push(addTxt.value);
    notesTitleObj.push(addNoteTitle.value);
    impNotesObj.push(isMarkedImp.checked);

    //and now update localStorage by updating activeUserData
    activeUserData = {
        notes: notesObj,
        noteTitles: notesTitleObj,
        isImp: impNotesObj
    }

    localStorage.setItem(activeUser, JSON.stringify(activeUserData));

    //since notes is added, clear addTxt
    addTxt.value = "";
    addNoteTitle.value = "";
    isMarkedImp.checked = false;

    //now since data is uploaded its time to display our notes in html
    //lets show all notes
    showNotes();

})


function showNotes() {
    //everyTime addBtn is pressed notesDiv should get cleaned and thenshowNotes so that cards dont repeat
    notesDiv.innerHTML = ""

    // lets get our data first
    let activeUserData = localStorage.getItem(activeUser);

    if (activeUserData == null) {
        notesDiv.innerHTML = `Nothing to show! Use "Add a Note" section above to add notes`
        notesObj = [];
        notesTitleObj = [];
        impNotesObj = [];
    }
    else {
        notesObj = JSON.parse(activeUserData)['notes'];
        notesTitleObj = JSON.parse(activeUserData)['noteTitles'];
        impNotesObj = JSON.parse(activeUserData)['isImp'];

    }

    //now since we have all our notes in form of an array in notesObj, lets use forEach to show them all
    notesObj.forEach(function (element, index) {
        notesDiv.innerHTML += `
                <div class="m-2 card noteCard" style="width: 20rem;background-color:${impNotesObj[index] ? 'red' : ""};
                color:${impNotesObj[index] ? 'white' : ""};">
                    <div class="card-body">
                        <h5 class="card-title">${notesTitleObj[index]}</h5>
                        <p class="card-text">${element}</p>
                        <button onclick = 'deleteNote(this.id)' class="btn btn-primary deleteBtn" id="${index}">Delete Note</button>
                    </div>
                </div>
        `
        //now since a new card is added, its delete button id should also be added to deleteBtn array so that when delete button of that particular note is pressed it would trigger that note and delete only the required one and not all of them
        deleteBtn.push(document.getElementById(index));

    });



}

//function to delete note
function deleteNote(index) {
    //firstly lets update all over data in here so that everything in the DOM would act accordingly and as needed, and also it will be required to update activeUserData
    notesObj.splice(index, 1);
    notesTitleObj.splice(index, 1);
    impNotesObj.splice(index, 1);

    //now lets update localStorage
    activeUserData = {
        notes: notesObj,
        noteTitles: notesTitleObj,
        isImp: impNotesObj
    }
    localStorage.setItem(activeUser, JSON.stringify(activeUserData));

    //all done, now lets show new notes card
    showNotes();
}

//this search variable is that input inside the navbar with placeholder as search this will help us in searching the required notes
let search = document.getElementById('searchTxt')

//this inputVal variable is just search.value, and it updates automatically when you enter any data in search
let inputVal = "";

search.addEventListener('input', function (event) {

    //here's how it updates automatically, whenever this eventlistener detects any input in searchbar it changes the value of inputVal
    inputVal = search.value

    //this variable is an array of html of all note cards
    let noteCards = document.getElementsByClassName('noteCard');

    //here we are trying to search the notecard which contains the data in inputVal (in other words, it just shows you the specific notecards containing the data you put in searchbar, it will show all the notecards containing that data and hide the rest)
    Array.from(noteCards).forEach(function (element, index) {

        //first of all lets hide all cards
        element.style.display = 'none';

        //now lets check for text given by user from the search bar in all the noteCards
        if (notesObj[index].includes(inputVal.toLowerCase()) || notesObj[index].includes(inputVal) || notesTitleObj[index].includes(inputVal.toLowerCase()) || notesTitleObj[index].includes(inputVal)) {

            //show this card (card with matching text)
            element.style.display = 'unset';
        }
    })
})

// this dropDownMenu is that dropdown menu you see when you click Users (in navbar)
let dropDownMenu = document.querySelector('.dropdown-menu')

// currently nothing is inside it and we gonna put userName of all our users here, lets go...
dropDownMenu.innerHTML = '';

// this is how we will put userName of all our users in dropDownMenu we will get userName of all our users (from this device) and show it over there
function showAllUsers() {

    //as i said lets extract userName of all our users (as an array)
    let users = JSON.parse(localStorage.getItem('users'));

    //now if an user has just opened this website for the first time users variable should be null and if it is, it would show guest as user in dropdownMenu and as soon as user registers (or signs up) it will disappear
    if (users != null) {

        //now since users is an array we can use forEach to add userName(s) inside dropdownMenu
        users.forEach(function (element) {
            dropDownMenu.innerHTML += `<a class="dropdown-item" id = "${element}" onclick = 'setActiveUser(this.id)' href = "#" > ${element}</a >`;

        })
    }

    //this is for that "+ New Users" button you see inside Users which is used for signing up
    dropDownMenu.innerHTML += `    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary btn-sm m-4" data-toggle="modal"  data-target="#modelId">
        +New User
    </button>`;


}

function setActiveUser(user) {
    checkLoggedin(user);

}

//now this section is all about user login authentication and stuff
//so value of isAuth should be false as default because when user has accessed the website for first time user would not be logged in and hence not authenticated
let isAuth = false;

//this function check if the user is logged in when he clicks on any of the users in the dropdownMenu and if he isn't, helps him to login
function checkLoggedin(user) {

    //if he is already logged in
    if (user == activeUser) {
        //do nothing
    }
    //if not
    else {
        //open login modal
        logingBtn.click();

        //remove the warning alert
        document.querySelector('.alertDiv').innerHTML = "";

        //it autofills the userName input with userName of user you clicked on
        document.querySelector('#loginUserName').value = user;

        //makes it look good and readable and yes the value inside the input is editable
        document.querySelector('#loginUserName').style.color = 'gray';
        document.querySelector('#loginUserName').style.fontWeight = 'bold';
        document.querySelector('#loginUserName').style.backgroundColor = 'rgb(228, 227, 227)';

        //if you want to change the color of userName input when user edits it just use .focus() method and change its however you want but i would not do that, because its very rare that someone would change that

        //now if someone clicks on login button inside the login modal it should check for password and authenticate if its correct and if not show that password is wrong
        loginBtn.addEventListener('click', function () {

            //for checking is password is correct or not and changing the value of isAuth
            authenticate(user);

            //if the password entered is same as that of password set, isAuth should be true now
            if (isAuth) {

                //close the login modal
                document.querySelector('#loginCloseBtn').click();

                //since it is authenticated, greet the user
                localStorage.setItem('userActive', user)
                activeUser = localStorage.getItem('userActive')
                greetUsers.innerText = 'Welcome ' + activeUser;

                //hide the alert which might have been here due to wrong password entered previously
                if (document.querySelector('.alertDiv').innerHTML != "") {
                    document.querySelector('.alertDiv').innerHTML = "";
                }

                //clear value inside input in login modal so that if login to another account it wo'nt show the password of previous one
                document.querySelector('#loginUserName').value = '';
                document.querySelector('#loginPswd').value = '';

                //lets show notes of this user
                showNotes();
            }
            else {

                //show the alert when password is wrong
                document.querySelector('.alertDiv').innerHTML = dangerAlert;

                //autofocus on password
                document.querySelector('#loginPswd').focus();
            }

            //it autofills the userName input with userName of user you clicked on
            document.querySelector('#loginUserName').value = user;
        })
    }
};

//for checking is password is correct or not and changing the value of isAuth
function authenticate(user) {

    //array consisting userName of all users
    let userObj = JSON.parse(localStorage.getItem('users'))

    //array of password
    let userPwd = JSON.parse(localStorage.getItem('pswd'))[userObj.indexOf(user)]

    //password entered
    let pwdEntered = document.querySelector('#loginPswd').value;

    //if correctPassword
    if (userPwd == pwdEntered) {
        //authenticate
        isAuth = true;
    }
    else {
        //else
        isAuth = false;
    }
}

//entered userName and password and confirm password
let userName = document.querySelector('#userName');
let userPswd = document.querySelector('#pswd');
let userConfirmPswd = document.querySelector('#confirmPswd');

//signUp button
let createUserBtn = document.querySelector('#createUserBtn');

//button for closing the signUp modal
let closeBtn = document.querySelector('#closeBtn');

//when +New User pressed
createUserBtn.addEventListener('click', function () {

    //remove the warning alert
    document.querySelector('.alertDiv2').innerHTML = "";

    //get users and password stored in localStorage
    let users = localStorage.getItem('users');
    let pswd = localStorage.getItem('pswd');

    //if no existing users make then an empty array to avoid error
    if (users == null || users == '[]') {
        users = [];
        pswd = [];
    }
    //else store data in variables
    else {
        users = JSON.parse(localStorage.getItem('users'))
        pswd = JSON.parse(localStorage.getItem('pswd'))

    }
    //check if password == confirm password
    if (userConfirmPswd.style.border != 'solid 1px red') {

        //if it is create user by adding it in user array and then storing it in localStorage
        users.push(userName.value);
        pswd.push(userPswd.value);

        //store the data in localStorage
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('pswd', JSON.stringify(pswd))

        //close modal
        closeBtn.click();

        //since user created show success div
        document.querySelector('.alertDiv2').innerHTML += successAlert;

        //clear dropdownMenu so that when we use showAllUsers, userNames are not repeated
        dropDownMenu.innerHTML = ''

        //add userName in dropDownMenu
        showAllUsers();

        //check if login and if not help them login
        checkLoggedin(userName.value);
    }

    //clear inputs
    userName.value = "";
    userPswd.value = "";
    userConfirmPswd.value = "";
})

//for checking if password == confirmpassword of not, without clicking the button (i.e live)
userConfirmPswd.addEventListener('input', function () {

    //change confirm password input border colour to red if password is not equals to confirm password
    if (userPswd.value != userConfirmPswd.value) {
        userConfirmPswd.style.border = 'solid 1px red'
    }

    //else set default
    else {
        userConfirmPswd.style.border = ''
    }
})

//DRIVER FUNCTION

//set active user
//check for last activeUser
if (activeUser != null) {
    greetUsers.innerText = 'Welcome ' + activeUser;
}

//user might me here for first time so activeUser(or you can say last activeUser) may be null so set it temporarily as guest
else {
    dropDownMenu.innerHTML += `<a class="dropdown-item" id = "guest"  href = "#" > Guest</a >`;

    document.querySelector('.alertDiv2').innerHTML = warningAlert;
}

//show users in dropDownMenu
showAllUsers();

//also call it at window.onload so that when user opens website he can see his notes
showNotes();
