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


const userContextMenu = ()=> html`
      <div class="context hidden">
          <h2>To be added: everything</h2>
      </div>
`;


function listguilds(guilds, focussedguild){
    if(!guilds) return;
    return guilds.array().map(guild => serverelement(guild, focussedguild));
}




document.querySelector('img').addEventListener('contextmenu', function(e) {
		// Alternative
	    e.preventDefault();
	}, false);


const userelement = (member)=>html`
    <div class="user" @click=${e=>interaction.showUserInfo(member.id||member.user.id)}>
        <img src="${member.avatarURL || member.user.avatarURL || defaultAvatar}" alt="${defaultAvatar}">
        ${member.displayName || member.nickname || member.name || member.user.name || "something went wrong"}
    </div>
`;

const userlist = (client, focussed)=>{
    if (focussed.channel) {
        if (focussed.channel.type != "text") {
            return focussed.guild.members.array().map(member => userelement(member));
        }
        return focussed.channel.members.array().map(member => userelement(member));
    } else {
        return html`
            <h2>Nothing to show here right now</h2>
        `;
    }
}



// RegEx for a user reference:
// /<@([0-9]{18})>/gm

const inlineUser = (member)=>html`
    <div class="user info inline" @click=${e=>interaction.test(e)}>
        <img src="${member.displayAvatarURL||member.user.displayAvatarURL}" alt="${defaultAvatar}">
        ${member.displayName || member.nickname || member.name || "something went wrong"}
    </div>
`;


let chatelement = (client, msg)=>html`
    <div class="chat message">
        ${new Date(msg.createdTimestamp)+" "}
        ${inlineUser(msg.member || msg.author)}:
        ${msg.content || "NO CONTENT TO SHOW"}
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
          console.warn("ERROR with channel type: " + focussedchannel.type);
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
let textsymb = html`
        <svg width="24" height="24" viewBox="0 0 24 24" class="icon-1_QxNX"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>
`;



const channelelement = (channel, focussedchannel)=>{
    switch (channel.type) {
      case "voice":
        // return html`
        //   <div id="${channel.id}" class="channel ${channel.type}${channel.id==focussedchannel.id?" focussed":""}">
        //
        //   </div>
        // `;
        // break;
      case "category":
      case "text":
      default:
        return html`
            <div id="${channel.id}"  class="channel ${channel.type} ${channel.id==focussedchannel.id?" focussed":""} ${channel.notify?"alert":""}" @click=${e =>interaction.focusElement("channel", channel)}>
                ${channel.type+": "}${channel.name}
            </div>
        `;
    }
}


// sub channels have the property .parentID with which they should be mapped

function sortChannels(one, two){
    if (one.type == two.type) {
        return one.position-two.position;
    } else {
        if (one.type) {

        }
    }
}

const listchannels = (channels, focussedchannel)=>{ //need to consider category channels
      if(!channels) return;
      return channels.array().sort(sortChannels).map(channel => channelelement(channel, focussedchannel));
}



const chat = (client, focussed)=>html`
    <div class="chat">
        <div class="history" wrap="soft">
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
            <button class="login submit key" id="login">login</button>
        </div>
    </div>
`;

const main = (client, focussed)=>html`
    ${userContextMenu()}
    <div class="main">
        <nav>
            <div class="top">
                text, this is the nav bar
                <button type="button" class="key" name="button">test button</button>
                <button type="button" class="key" id="logout" name="logout">Logout</button>
            </div>
        </nav>

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
