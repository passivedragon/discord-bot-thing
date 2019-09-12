
export function test(event){
    console.log(event);
    console.log(event.srcElement);
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



import {renderAll} from "/templates.js";
export function focusElement(type, element){
    // console.log(type, element);
    focussed[type] = element;

    if (element) {

    }
    if (element.type && element.type=="text") {
        if (element.messages.size < 10) {
            console.log("not enough messages stored, fetching more!");
            element.fetchMessages(20)
              .then(()=>renderAll(client, focussed))
              .then(e=>{
                console.log("fetched 20 more messages");

                let historyElement = document.querySelector(".history");//scroll after loading messages
                historyElement.scrollTop = historyElement.scrollHeight;
              })
              .catch(console.error);
        } else {
            let historyElement = document.querySelector(".history");
            historyElement.scrollTop = historyElement.scrollHeight;
        }
    }

    if (type=="guild" && focussed.guild.id != element.id) {//autoselect system channel if selected guild is switched
        focusElement("channel", element.systemChannel)
        // focussed["channel"] = element.systemChannel;
    }

    if (element.notify) {
        element.notify = false;
    }

    renderAll(client, focussed);
}


export function showUserInfo(event, userid){
    // console.log("looking up user with id: "+userid);
    if (client.user.id == userid) {
        alert("You should know who you are!");
        return;
    }

    let contextMenu = document.querySelector(".context");

    contextMenu.style.top = event.pageY+"px";
    contextMenu.style.left = event.pageX+"px";
    if (contextMenu) {

    }
    console.log(event.clientY);

    focussed.object = {id:userid};//probably not necessary, but just in case the fetch doesn't work perfectly
    client.fetchUser(userid).then(user => {
        // console.log(user);


        focussed.object = user;

        // alert(JSON.stringify(user));

        if (!contextMenu.classList.contains("hidden")) {
            //do stuff to make it close if clicked somewhere else or something
            //is handled in uistuff.js, as a window.onclick
        } else {
            contextMenu.classList.toggle("hidden");//shows it
            // focussed.object = false;
        }
    });

}


export function fetchMessages(event){
    // let historyElement = event.srcElement;
    // console.log(event);
    if (event.srcElement.scrollTop < 50) {
        if (focussed.channel && focussed.channel.type == "text") {
            console.warn("fetching messages after scrolling");
            focussed.channel.fetchMessages(20).then(()=>{
              renderAll(client, focussed);
            });
        }
    }
    // console.log(historyElement.scrollTop);
}
