//jsFrame
const jsFrame = new JSFrame();

//Create window
const frameLogin = jsFrame.create({
    name: `frameLogin`,
    title: `Login`,
    left: 360, top: 40, width: 320, height: 220, minWidth: 200, minHeight: 110,
    appearanceName: 'material',
    appearanceParam: {
        border: {
            width: 0,
            radius: 2,
        },
        titleBar: {
            color: 'white',
            background: '#33333399',
            leftMargin: 8,
            height: 16,
            fontSize: 14,
            buttonWidth: 36,
            buttonHeight: 16,
            buttonColor: 'white',
            buttons: [ // buttons on the right
            ],
            buttonsOnLeft: [ //buttons on the left
            ],
        },
    },
    style: {
        backgroundColor: '#22222255',
        overflow: 'hidden',
        width: '100%',
        fontSize: 18
    },
    
    html: `<div style="padding:4px;font-family:'Roboto Slab';font-size:18px;">Username: <input id="signDiv-username" type="text"></input><br>
	Password: <input id="signDiv-password" type="password"></input>
	<button id="signDiv-signIn">Sign In</button>
	<button id="signDiv-signUp">Sign Up</button></div>`
});

document.addEventListener("DOMContentLoaded", (event) => {
    Split(["#chat", "#building-info", "#building-list"],{
        minSize: 250,
    });
});

console.log("*frameJs loaded.");