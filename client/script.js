import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chat_container = document.querySelector('#chat_container');
let loadInterval;
//robot loading the 3 dots and soon as the 3 dots are reached
//it is reset to empty string and goes on

function loader(element) {
    element.textContent = "";
    loadInterval = setInterval(() => {
        element.textContent += ".";


        if (element.textContent === "...") {
            element.textContent = "";
            console.log(element);
        }
    }, 300);
}

//typing each word letter by letter using charAt(index) and 
//increasing the index by 1 
function typeText(element, text) {
    let i = 0;
    //setInterval is the built-in function 
    //clearInterval is used to stop the interval
    let interval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;

        } else {
            clearInterval(interval);
        }
        console.log(element.innerHTML);
    }, 1000);
}

function generateUniqueID() {
    // const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexa = randomNumber.toString(16);

    return `id-${hexa}`;
}


//function for diffrent color and to see if the user is user or bot
function chatStripe(isAi, value, uniqueID) {
    return (
        `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src = ${isAi ? bot : user}
            alt = "${isAi? 'bot':'user'}"
          />
        </div>
          <div class="message" id = ${uniqueID}>${value}</div>
        
      </div>
    </div>
    `
    )
}


const handleSubmit = async(e) => {
        //prevent the default loading of the browser
        e.preventDefault();
        //getting data from the data inside the variable
        const data = new FormData(form);


        //user message
        chat_container.innerHTML += chatStripe(false, data.get('prompt'))
        form.reset();

        //ai message
        //uniqueID stored inside a variable and later passed into the function
        const uniqueID = generateUniqueID();
        chat_container.innerHTML += chatStripe(true, ' ', uniqueID);
        chat_container.scrollTop = chat_container.scrollHeight;
        const messageDiv = document.getElementById(uniqueID);
        if (messageDiv) {
            loader(messageDiv);
            // rest of the Promise code...
        } else {
            console.error(`Element with ID ${uniqueID} not found in DOM`);
        }




        //FETCHING DATA FROM SERVER AS A BOT'S RESPONSE 
        const response = await fetch('https://abot.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: data.get('prompt')
            })
        })
        clearInterval(loadInterval);
        messageDiv.innerHTML = "";

        if (response.ok) {
            const data = await response.json();
            const parseddata = data.bot.trim();
            console.log({ parseddata });
            typeText(messageDiv, parseddata);

        } else {
            const err = await response.text();
            messageDiv.innerHTML = "Something went wrong";
            alert(err);
        }


    }
    //calling the handlesubmit function
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    //enter keyboard key on which the handlesubmit button wuill be called
    //and the message will be sent
    if (e.keycode === 'Enter') {
        handleSubmit(e)
    }
})