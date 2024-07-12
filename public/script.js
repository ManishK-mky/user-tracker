const socket = io(); //just after reading this line a ---connection request--- send to the backend {which is handled by using   [io.on("connection" , function())] }:

console.log("hello");

// checking the browser supports geolocation or not ---> geolocation is the feature in navigator which is present the window objed by default
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => { //Whenver any one moves , watch Position is used to see it .
        const {latitude , longitude} = position.coords; //destructuring the position.coords and storing longitude and latitude 
        console.log(latitude , longitude);
        socket.emit("send-location" , {latitude , longitude}) //whenever the latitiude and longitude changes "the socket emits an event named send-location to the backnend with latitude and longitude and on the backend side we have recieve the event to use the lat. and long"
    },
    (error) => {
        console.log(error);
    },
    {
        enableHighAccuracy : true,
        timeout : 5000,  //it is used to tell that after every 5 secind chekc the position of the user
        maximumAge : 0 // for no caching
    } 
    )
}



const map = L.map("map").setView([0,0] , 10) //asking for location and setting a deafult lat. and long. of 23 and 72
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Manish</a> contributors'}).addTo(map); //add this style to the map

// creating a marker object
const markers = {}

// for receiveing the data from the backend part
socket.on("receive-location" , (data)=>{
    const {id , latitude , longitude} = data; //backend se recieve ho gya

    // now setting the coordinates on the map
    map.setView([latitude , longitude] , 16)


    if(markers[id]){
        markers[id].setLatLng([latitude , longitude]) //if the marker is already present then set the new value la. and long.
    }else{
        markers[id] = L.marker([latitude , longitude]).addTo(map)
    }
});

socket.on("user-disconnected" , (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})