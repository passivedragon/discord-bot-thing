import {renderAll} from "discord-bot-thing/templates.js";
renderAll(client, {});
let loginButton = document.querySelector("#login");
let tokenfield = document.querySelector("#token");

let token = localStorage.getItem("token"); //load in old token, in case one is stored
tokenfield.value = token;





// login stuff

loginButton.addEventListener("click", login);

function login(){
    if (client.status < 3) {
        console.log("Already logged in, not trying again!");
        return onLogin();
    }
    token = tokenfield.value;
    if(!token || token.length < 10) {
        console.log("invalid token!");
        alert("invalid token!");
        return;
    }
    console.log("trying to log in");
    console.log("Entered token was: " + token);
    client.login(token);

    // onLogin(); //now handled by the client ready event
}

if (token) {
    login(); //try to log in automatically if there's a token saved
}

function logout(){
    client.destroy();
    onLogout();
}

function onLogin(){
    document.querySelector(".login").hidden = true;
    localStorage.setItem("token", token || client.token);
    console.log("tried to save token", token, client.token);
}

function onLogout(){
    document.querySelector(".login").hidden = false;
}

client.on("reconnect", onLogin);

client.on("disconnect", onLogout);




function submitMessage(event){
    let message = chatinput.value;
    if (message.length == 0) {return;} // don't do something if there's nothing to do

    // DEBUG: Only setting this for now, to be changed! // TODO: implement
    // activetab = client.guild.get("388765646554398734");

    let activetab = client.users.get("274303955314409472");
    if (focussed.channel.type == "text") {
        activetab = focussed.channel;
    }

    if (activetab.sendMessage == undefined) {
        alert("error, working on it!");
        console.warn("no focussed channel defined to send to!");
        return;
    }

    console.log("tried to send message:");
    //This is where the actual code will be later
    console.log(message);
    console.log(activetab["send"](message));

    chatinput.value = "";//empty the field
}


// UI elements
let sendButton = document.querySelector("#send");
let logoutButton = document.querySelector("#logout");
let chatinput = document.querySelector("#chatinput");

logoutButton.addEventListener("click", logout);


document.querySelector(".input").addEventListener("keyup", (event)=>{
    if (event.keyCode == 13) {
        submitMessage(event);
    }
});
sendButton.addEventListener("click", submitMessage);

// import { html, render } from "https://unpkg.com/lit-html?module";
let servernum = 0;
function updateInterface(obj){
    renderAll(client, focussed);


    //handle notifications for incoming messages

    //maybe with a notify class? Already working on it!
}

let historyElement = document.querySelector(".history");
client.on("ready", ()=>{
    onLogin();
    console.log("Login successful, preparing stuff");

    focussed.guild = client.guilds.first();
    focussed.channel = focussed.guild.systemChannel;

    if (focussed.channel.messages.size < 10) {
        focussed.channel.fetchMessages(20).then(() => {
          updateInterface();
          //start scrolled to bottom
          console.warn(historyElement.scrollTop, historyElement.scrollHeight)
          historyElement.scrollTop = historyElement.scrollHeight;
        });
    }

    //getting stuff ready
    console.warn(client)
    updateInterface();
    console.log("Client is ready!");
    document.querySelector(".login").hidden = true;


});

client.on("message", (msg)=>{
    if (msg.channel != focussed.channel) {
        msg.channel.notify = true;
        if (msg.guild != focussed.guild) {
            msg.guild.notify = true;
        }
    }
    console.log(msg);
    updateInterface();
});

client.on("messageUpdate", updateInterface);
client.on("presenceUpdate", updateInterface)
client.on("userUpdate", updateInterface)
client.on("voiceStateUpdate", updateInterface)
client.on("guildUpdate", updateInterface);
client.on("guildMemberUpdate", updateInterface);

client.on("warn", console.warn);
client.on("error", console.warn);
// client.on("debug", (msg)=>{
//     console.log(msg);
// });
















//auto fetch new messages if scrolled to top

// TODO: Force it to hibernate for a set amount of time before allowing reuse
historyElement.onscroll = function(event){
    if (historyElement.scrollTop < 50) {
        if (focussed.channel && focussed.channel.type == "text") {
            console.warn("fetching messages after scrolling");
            focussed.channel.fetchMessages(20).then(updateInterface);
        }
    }
    // console.log(historyElement.scrollTop);
}
