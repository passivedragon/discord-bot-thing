
export function test(event){
    console.log(event);
}



//  default drag and drop stuff
export function allowDrop(event) {
    // event.prevententDefault();
}

export function drag(event) {
    event.dataTransfer.setData("id", event.target.id);
    console.log(event.target);
}

export function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("id");
    console.log(event.dataTransfer);
    event.target.appendChild(document.getElementById(data));
}



import {renderAll} from "./templates.js";
export function focusElement(type, element){
    if (element.type && element.type=="text" && element.messages.size < 10) {
        console.log("not enough messages stored, fetching more!");
        element.fetchMessages(20)
          .then(()=>renderAll(client, focussed))
          .then(e=>{
            console.log("fetched 20 more messages");

            let historyElement = document.querySelector(".history");
            historyElement.scrollTop = historyElement.scrollHeight;
          })
          .catch(console.error);
        // return;
    }

    if (type=="guild" && focussed.guild.id != element.id) {//autoselect system channel if selected guild is switched
        focusElement("channel", element.systemChannel)
        // focussed["channel"] = element.systemChannel;
    }

    if (element.notify) {
        element.notify = false;
    }

    // console.log(type, element);
    focussed[type] = element;
    renderAll(client, focussed);

}


export function showUserInfo(userid){
    // console.log("looking up user with id: "+userid);
    client.fetchUser(userid).then(user => {
        console.log(user);
        alert(JSON.stringify(user));
    });
    document.querySelector(".context").hidden = false;
}
