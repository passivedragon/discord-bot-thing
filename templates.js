'use strict';
import {html, render} from "https://unpkg.com/lit-html?module";

import * as interaction from "./interaction.js";

let defaultAvatar = "https://cdn.discordapp.com/embed/avatars/0.png";




// import default as Discord from Discord.js;

// NjE5NzczODEzNDYyMjY5OTUz.XXNHsA.HeOdGt9gCU6PPKx9s1bsSiyLMbw

// import { html, render } from "https://unpkg.com/lit-html?module";

// import Discord from "discord.master.min.js";


let serverelement = (guild, focussedguild)=>html`
    <div id="${guild.id}" class="server ${guild.id==focussedguild.id?" focussed":""} ${guild.notify?"alert":""}" @click=${e =>interaction.focusElement("guild", guild)} title="test" draggable="true" @dragstart=${()=>interaction.test(event)}>
        <img src="${guild.iconURL || defaultAvatar}" alt="${defaultAvatar}">
        ${guild.name}
    </div>
`;
//
// @click=handler.dragstart.bind(guild)
//
// (event) =>  {
//
// }

let contextActions = [
  {
    "id": "",
    "name": "",
    "hover": function(){

    },
    "click": function(){

    }
  },
  {
    "id": "test",
    "name": "click me to test!",
    "hover": function(){
        alert("hover works!");
    },
    "click": function(){
       alert("click as well!");
    }
  },
  {
    "id": "another",
    "name": "more testing",
    "hover": function(){
        alert("hover works!");
    },
    "click": function(){
       alert("click as well!");
       console.warn("test");
    }
  }
];

let allActions = () => {
    return contextActions.map(button => {
        if(!button.name) return;
        return html`
            <button id="${button.id}" class="key context" @click=${e=>button.click()} @hover=${e=>button.hover()}>
                ${button.name}
            </button>
        `;
    });
};

const userContextMenu = ()=>html`
    <div class="context hidden">
        <!-- <h2>To be added: everything</h2>
        <button>a button</button>
        <button>another button</button> -->
        ${allActions()}
    </div>
`;


function listguilds(guilds, focussedguild){
    if(!guilds) return;
    return guilds.array().map(guild => serverelement(guild, focussedguild));
}




document.querySelector('img').addEventListener('contextmenu', function(e) {
		  // do nothing at all for now, to allow the context menu behind the images to be accessed
	    e.preventDefault();
	}, false);


const userelement = (member)=>html`
    <div class="user hascontext ${member.presence.status}" @click=${e=>interaction.showUserInfo(e, member.id||member.user.id)}>
        <img src="${member.avatarURL || member.user.avatarURL || defaultAvatar}" alt="${defaultAvatar}">
        ${member.displayName || member.nickname || member.name || member.user.name || "something went wrong"}
    </div>
`;

let presenceEnum = ["online", "idle", "dnd", "offline"];
function sortUsers(one, two){
    return presenceEnum.indexOf(one.presence.status) - presenceEnum.indexOf(two.presence.status);
}

const userlist = (client, focussed)=>{
    if (focussed.channel) {
        if (focussed.channel.type != "text") {
            return focussed.guild.members.array().sort(sortUsers).map(member => userelement(member));
        }
        return focussed.channel.members.array().sort(sortUsers).map(member => userelement(member));
    } else {
        return html`
            <h2>Nothing to show here right now</h2>
        `;
    }
}







// let embed = (embed)=> {
//     return html`
//         <iframe src="https://leovoel.github.io/embed-visualizer/"> </iframe>
//     `;
// }



// RegEx for a user reference:
// /<@([0-9]{18})>/gm

const inlineUser = (member)=>html`
    <div class="user info inline ${member.presence.status}" @click=${e=>interaction.test(e)}>
        <img src="${member.displayAvatarURL||member.user.displayAvatarURL}" alt="${defaultAvatar}">
        ${member.displayName || member.nickname || member.name || member.username || "something went wrong"}
        ${member.bot?"bot":""}
    </div>
`;


let chatelement = (client, msg)=>html`
    <div class="chat message">
        ${new Date(msg.createdTimestamp)+" "}
        ${inlineUser(msg.member || msg.author)}
        ${msg.content || ""}
        ${msg.embed?"embed here":""}
        ${msg.file?"file here":""}
        ${msg.type=="GUILD_MEMBER_JOIN"?"joined the server!":""}
    </div>
`;


function returnMessages(client, focussedchannel){
    let messages = focussedchannel.messages;
    if (!messages || messages.length < 5) {
        return focussedchannel.fetchMessages(10).then(
          messages.array().sort(e=>e.createdTimestamp).map(message => chatelement(client, message))
        );
    }
    return messages.array().sort((one, two)=>one.createdTimestamp-two.createdTimestamp).map(message => chatelement(client, message))
}

let chatContent = (client, focussedchannel)=>{
    if(!focussedchannel) return;

    // console.log("selected channel of type "+focussedchannel.type);
    switch (focussedchannel.type) {
      case "text":
        let messages = focussedchannel.messages;
        if (!messages || messages.length < 5) {
            return focussedchannel.fetchMessages(10).then(
              ()=>returnMessages(client, focussedchannel)
            );
        }
        return returnMessages(client, focussedchannel);
        break;
      case "category":
      case "voice":
      default:
          // console.warn("ERROR with channel type: " + focussedchannel.type);
          return html`
              <h1>Currently selected ${focussedchannel.type} channel is not of type TEXT</h1>
          `;
          //nothing for now
          break;
    }
    return html`
        <h1>Currently selected channel is not of type TEXT</h1>
    `;
}






//I stole this from discord, sue me... actually, please don't!
let textsymbol = html`
    <svg width="24" height="24" viewBox="0 0 24 24" class="icon-1_QxNX"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>
`;

let speakersymbol = html`
    <svg name="Speaker" class="icon-1_QxNX" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z"></path></svg>
`;

let lockedspeakersymbol = html`
    <svg width="24" height="24" viewBox="0 0 24 24" class="icon-1_QxNX"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15 12C15 12.0007 15 12.0013 15 12.002C15 12.553 14.551 13.002 14 13.002V15.002C15.654 15.002 17 13.657 17 12.002C17 12.0013 17 12.0007 17 12H15ZM19 12C19 12.0007 19 12.0013 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 12.0013 21 12.0007 21 12H19ZM10.293 3.29604C10.579 3.01004 11.009 2.92504 11.383 3.07904C11.757 3.23204 12 3.59904 12 4.00204V20.002C12 20.407 11.757 20.772 11.383 20.927C11.009 21.082 10.579 20.996 10.293 20.71L6 16.002H3C2.45 16.002 2 15.552 2 15.002V9.00204C2 8.45304 2.45 8.00204 3 8.00204H6L10.293 3.29604Z"></path><path fill="currentColor" d="M21.025 5V4C21.025 2.88 20.05 2 19 2C17.95 2 17 2.88 17 4V5C16.4477 5 16 5.44772 16 6V9C16 9.55228 16.4477 10 17 10H19H21C21.5523 10 22 9.55228 22 9V5.975C22 5.43652 21.5635 5 21.025 5ZM20 5H18V4C18 3.42857 18.4667 3 19 3C19.5333 3 20 3.42857 20 4V5Z"></path></svg>
`;

let categorysymbol = html`
    <svg class="icon-WnO6o2" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path></svg>
`;


let channelTreeObject = {};

const categoryElement = (channel, focussedchannel)=>html`
    <div id="${channel.id}"  class="channel category collapsed" @click=${e => {
      if(e.path[0].classList.contains("category")) {
        e.srcElement.classList.toggle("collapsed")
      }
      }}>
      ${categorysymbol}
      ${channel.type+": "}${channel.name}
      ${channel.children.array().sort(sortChannels).map(child => channelElement(child, focussedchannel))}
    </div>
`;

const channelElement = (channel, focussedchannel) => html`
    <div id="${channel.id}"  class="channel hascontext ${channel.type} ${channel.id==focussedchannel.id?" focussed":""} ${channel.notify?"alert":""}" @click=${e => interaction.focusElement("channel", channel)}>
      ${channel.type=="text"?textsymbol:(channel.joinable?speakersymbol:lockedspeakersymbol)}
        ${channel.type+": "}${channel.name}
    </div>
`;


// to sort the channels how they should be sorted
let channelEnum = ["category", "text", "voice"];
function sortChannels(one, two){
    if (one.type == two.type) {
        return one.position-two.position;
    } else {
        return channelEnum.indexOf(one.type)-channelEnum.indexOf(two.type);
    }
}

function filterChannels(channel) {
    return channel.type == "category";
}

const filterIfWithoutCategory = e => e.type != "category" && !e.parentID;

const listchannels = (channels, focussedchannel)=>{ //need to consider category channels
      if(!channels) return;
      let channelsWithoutCategory = channels.array().filter(filterIfWithoutCategory),
        categoryChannels = channels.array().filter(filterChannels).sort(sortChannels),
        categoriesHTML = categoryChannels.sort(sortChannels).filter(filterChannels).map(channel => categoryElement(channel, focussedchannel)),
        noCategoriesHTML = channelsWithoutCategory.map(channel => channelElement(channel, focussedchannel));

      return noCategoriesHTML.concat(categoriesHTML);
}



const chat = (client, focussed)=>html`
    <div class="chat">
        <div class="history" wrap="soft" @scroll=${e=>interaction.fetchMessages(e)}>
            <!-- this is the chat history -->
            ${chatContent(client, focussed.channel)}
        </div>
        <div class="input grid-container">
            <textarea id="chatinput" name="chatinput" wrap="soft" placeholder="Start typing!"></textarea>
            <button type="button" class="key" id="send" name="send">SEND</button>
        </div>
    </div>
`;




const login = ()=>html`
    <div class="loading">
        <img src="/crashcord.gif" alt="https://media1.tenor.com/images/83cdd1dd40cdb87020949e0f075b9648/tenor.gif">
    </div>

    <div class="login">
        <br><label>Please enter your credentials below:</label><br><br>
        <div class="grid-container">
            Enter Bot Token:<input type="text" id="token"></input>
            <button class="submit key" id="login">login</button>
        </div>
    </div>
`;




function changeStatus(client, status){
    if(["online", "idle", "dnd", "invisible"].includes(status)){
        let description = document.querySelector("#StatusText").value;
        client.user.setStatus(status, description);
    } else alert("something went wrong with changeStatus()");
}




let dropdownObject = (name, content)=>html`
    <div class="dropdown">
        <button class="key">${name}</button>
        <div class="menu">
            ${content}
        </div>
    </div>
`;

let buttonObject = (name, buttonFunction)=>html`
    <button type="button" class="key" name="${name}" @click=${(event)=>buttonFunction(client, event)}>
        ${name}
    </button>
`;

let navObject = {
    "menu":{
      "set Status":{
        "online": (client)=>changeStatus(client, "online"),
        "idle": (client)=>changeStatus(client, "idle"),
        "dnd": (client)=>changeStatus(client, "dnd"),
        "invisible": (client)=>changeStatus(client, "invisible")
      },
      "logout": (client)=>client.disconnect()
    }
};


const navbar = (client)=>html`
    <nav>
        <!-- <div class="top">
            text, this is the nav bar -->
            <!-- <button type="button" class="key" name="button">test button</button> -->

            <div class="dropdown">
                <button class="key">main menu</button>
                <div class="menu">
                    <button type="button" class="key" id="logout" name="logout">Logout</button>
                </div>
            </div>
            <div class="dropdown">
                <button class="key">self actions</button>
                <div class="menu">
                  <button type="button" class="key" id="logout" name="logout">Logout</button>
                  <div class="dropdown">
                      <button class="key">change Status</button>
                      <div class="menu">
                          <button type="button" class="key" @click=${()=>changeStatus(client, "online")}>online</button>
                          <button type="button" class="key" @click=${()=>changeStatus(client, "idle")}>idle</button>
                          <button type="button" class="key" @click=${()=>changeStatus(client, "dnd")}>dnd</button>
                          <button type="button" class="key" @click=${()=>changeStatus(client, "invisible")}>invisible</button>
                      </div>
                  </div>
                  <div class="dropdown">
                      <button class="key">Status text</button>
                      <div class="menu">
                          <select>
                              <option value="WATCHING" selected>WATCHING</option>
                              <option value="LISTENING TO">LISTENING TO</option>
                              <option value="PLAYING">PLAYING</option>
                              <!-- <option value="audi">Audi</option> -->
                          </select>
                          <input id="StatusText" placeholder="my Status"></input>
                          <button type="button" class="key" @click=${()=>changeStatus(client, "offline")}>offline</button>
                      </div>
                  </div>
                </div>
            </div>
        <!-- </div> -->
    </nav>
`;

const main = (client, focussed)=>html`
    ${userContextMenu()}
    <div class="main">
        ${navbar(client)}

        <div class="grid-container">
            <div class="guilds" dropzone="move" ondrop="drop(event)" @dragover=${()=>interaction.allowDrop(event)}>
                ${listguilds(client.guilds ? client.guilds : undefined, focussed.guild)}
            </div>

            <div class="channels">
                ${listchannels(focussed.guild?client.guilds.get(focussed.guild.id).channels:undefined, focussed.channel||{})}
            </div>

            ${chat(client, focussed)}

            <div class="users">
                ${userlist(client, focussed)}
            </div>
        </div>
    </div>
`;

const entirepage = (client, focussed)=>html`
    ${login()}
    ${main(client, focussed)}
`;


const renderAll = (client, focussed)=>{
    render(entirepage(client, focussed), document.body);
};


export {renderAll};
