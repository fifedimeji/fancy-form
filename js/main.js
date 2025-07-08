// FORM PROMPT ARRAY
const prompts = [
    {prompt: 'Enter first name...'},
    {prompt: 'Enter last name...'},
    {prompt: 'Enter email...', pattern: /\S+@\S+\.\S+/},
    {prompt: 'Create password...', type: 'password'}
];

// TRANSITION TIMES
const shakeTime = 100 // SHAKE TRANSITION TIME
const switchTime = 200 // TRANSITION BETWEEN PROMPTS

// INITIALISE POSITION AT FIRST QUESTION
let position = 0

// INITIALISE DOM ELEMENTS
const formBox = document.querySelector('#form-box')
const nextBtn = document.querySelector('#next-btn')
const prevBtn = document.querySelector('#prev-btn')
const inputGroup = document.querySelector('#input-group')
const inputField = document.querySelector('#input-field')
const inputLabel = document.querySelector('#input-label')
const inputProgress = document.querySelector('#input-progress')
const progress = document.querySelector('#progress-bar')

// EVENTS
// GET PROMPT ON DOM LOAD
document.addEventListener('DOMContentLoaded', getPrompt)
// NEXT BUTTON CLICK
nextBtn.addEventListener('click', validate)
// INPUT FIELD ENTER CLICK
inputField.addEventListener('keyup', e => {
    if(e.keyCode === 13){
        validate()
    }
})

// FUNCTIONS
// GET PROMPT FROM ARRAY
function getPrompt(){
    // GET CURRENT PROMPT
    inputLabel.innerHTML = prompts[position].prompt
    // GET CURRENT TYPE
    inputField.type = prompts[position].type || 'text'
    // GET CURRENT ANSWER
    inputField.value = prompts[position].answer || ''
    // FOCUS ON ELEMENT
    inputField.focus()

    // SET PROGRESS BAR WIDTH
    progress.style.width = (position * 100) / prompts.length + '%'

    // ADD USER ICON OR BACKARROW DEPENDING ON PROMPT
    prevBtn.className = position ? 'fas fa-arrow-circle-left' : 'fas fa-user'

    showPrompt()
}

// DISPLAY PROMPT TO USER
function showPrompt(){
    inputGroup.style.opacity = 1
    inputProgress.style.transition = ''
    inputProgress.style.width = '100%'
}

// HIDE PROMPT FROM USER
function hidePrompt(){
    inputGroup.style.opacity = 0
    inputLabel.style.marginLeft = 0
    inputProgress.style.width = 0
    inputProgress.style.transition = 'none'
    inputGroup.style.border = null
}

// TRANSFORM TO CREATE SHAKE MOTION
function transform(x, y){
    formBox.style.transform = `translate(${x}px, ${y}px)`
}

// VALIDATE
// MAKE SURE PATTERN MATCHES
function validate(){
    if(!inputField.value.match(prompts[position].pattern || /.+/)){
        inputFail()
    } else{
        inputPass()
    }
}

// FIELD INPUT FAIL
function inputFail(){
    formBox.className = 'error'
    // REPEAT SHAKE MOTION
    for(let i = 0; i < 4; i++){
        setTimeout(transform, shakeTime * i, ((i % 2) * 2 - 1) * 20, 0)
        setTimeout(transform, shakeTime * 4, 0, 0)
        inputField.focus()
    }
}

// FIELD INPUT PASS
function inputPass(){
    formBox.className = ''
    setTimeout(transform, shakeTime * 0, 0, 10)
    setTimeout(transform, shakeTime * 1, 0, 0)

    // STORE ANSWER IN ARRAY
    prompts[position].answer = inputField.value

    // INCREMENT POSITION
    position++

    // IF NEW QUESTION HIDE CURRENT AND GET NEXT
    if(prompts[position]){
        hidePrompt()
        getPrompt()
    } else{
        // REMOVE IF NO MORE QUESTIONS
        hidePrompt()
        formBox.className = 'close'
        progress.style.width = '100%'
        progress.style.borderBottomRightRadius = '15px'

        // FORM COMPLETE
        formComplete()
    }
}

// ALL FIELDS COMPLETED
function formComplete(){
    const h1 = document.createElement('h1')
    h1.classList.add('end')
    h1.appendChild(document.createTextNode(`Thanks ${prompts[0].answer} you will get a verification email shortly.`))
    setTimeout(() => {
        formBox.parentElement.appendChild(h1)
        setTimeout(() => (h1.style.opacity = 1), 50)
    }, 1000)
}