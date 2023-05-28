const arbody = document.querySelector(".ar-body");
const userinput = document.querySelector("#user-input");
const arsend = document.querySelector(".send");

const decodeusermessage = () => {
    const text_input = userinput.value;

    if( text_input == "" ) {
        return;
    }

    rendermessage(text_input);
    userinput.value = "";
    // clearing the message after one is sent
    setTimeout(() => {
        decodebotsmessage(text_input);
    }, 600);
    if(arbody.scrollHeight > 0){
        arbody.scrollTop = arbody.scrollHeight;
    }
};

// Here users message is rendered (converted from text to text-node then text-node is appended to div element then div element is appeded to ar-body)
const rendermessage = (txt) => {
    let message_arrived = document.createElement("div");
    let text_node = document.createTextNode(txt);
    
    message_arrived.classList.add("message-by-user");
    message_arrived.append(text_node);
    arbody.append(message_arrived);
};

const decodebotsmessage = async (txt) => {
    const res = await getbotresponse(txt);
    let bots_message = document.createElement("div");
    let text_node = document.createTextNode(res);
    bots_message.classList.add("message-by-bot");
    bots_message.append(text_node);
    arbody.append(bots_message);
}

const getbotresponse = async (txt) =>  {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // if normal_process = false then sending the process index in request body 
    request_body = {
        "input_text": txt
    }

    if( is_normal_behviour == false ) {
        process_index = process_index + 1;
        request_body['index'] = process_index;
    }

    var request_body_json = JSON.stringify(request_body);
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: request_body_json,
    };

    response = await fetch("http://127.0.0.1:8080/curechat/", requestOptions)
    result = ""

    if (response.ok) {
        await response.json().then( json => {
            if( json['index'] != null ) {
                // setting a global flag true to swtich from normal behaviour to perform email send operation
                is_normal_behviour = false;

                // assigning the current index to process index 
                process_index = json['index'];
            }

            if ( process_index != null && process_index > 4 ) {
                // means this was the last step, the mail is either sent or has some issues sending, returning back to default work mode
                is_normal_behviour = true;
                process_index = 0;
            }

            result = json['ans'];
      });
    }

    return result;
};


// toggle to switch between normal question-answer chatbot behaviour and customized behaviour 
// ( for example, is_nromal_behaviour will remain false while the process of sending a mail 
// is going on )
var is_normal_behviour = true;

// process_index indicates the step number on which a customized process is currently on 
var process_index = 0;

arsend.addEventListener("click", () => decodeusermessage());

// when press enter then message should sent
userinput.addEventListener("keyup", (event) => {
    // checking the keycode = 13 because this is the code for enter key
    if(event.keyCode === 13){
        decodeusermessage();
    }
});