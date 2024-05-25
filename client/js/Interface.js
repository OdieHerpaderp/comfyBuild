interface={};
interface.generateBuildingsHTML = function() {
    let html = `
      <table>
        <thead>
          <tr>
            <th>Building</th>
            <th>Material Info</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    for (const buildingName in buildings) {
      const building = buildings[buildingName];
  
      html += `
        <tr>
          <td>${buildingName} <font style="font-size:15px">Tier:${building.tier}<br>
          <font style="font-size:14px">${building.info}</font></td>
          <td style="font-size:15px;line-height: 0.9;"><b>Build:</b>
      `;
  
      for (const resource in building.build) {
        html += ` ${resource}: ${building.build[resource]}. `;
      }
  
      html += `<br /><b>Consume:</b> `;
  
      for (const resource in building.consume) {
        html += `${resource}: ${building.consume[resource]}. `;
      }
  
      html += `<br /><b>Produce:</b> `;
  
      for (const resource in building.produce) {
        html += `${resource}: ${building.produce[resource]}. `;
      }
  
      html += `
          </td>
          <td><a href="javascript:buildTower('${buildingName}');">Build</a></td>
        </tr>
      `;
    }
  
    html += `
        </tbody>
      </table>
    `;
  
    return html;
  }

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
    
    html: `<div style="padding:4px;font-family: 'Roboto Slab'">Username: <input id="signDiv-username" type="text"></input><br>
	Password: <input id="signDiv-password" type="password"></input>
	<button id="signDiv-signIn">Sign In</button>
	<button id="signDiv-signUp">Sign Up</button></div>`
});

const frameStockpile = jsFrame.create({
    name: `frameStockpile`,
    title: `Stockpile`,
    left: 80, top: 360, width: 320, height: 420, minWidth: 200, minHeight: 110,
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
        overflow: 'auto',
        width: '100%',
        fontSize: 18
    },
    
    html: `<div id="stockpileDiv" style="padding:4px;">stockpile text goes here</div>`
});

const frameBuildings = jsFrame.create({
    name: `frameBuildings`,
    title: `Buildings`,
    left: 380, top: 360, width: 820, height: 420, minWidth: 200, minHeight: 110,
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
        overflow: 'auto',
        width: '100%',
        fontSize: 18
    },
    
    html: `<div id="buildingsDiv" style="padding:4px;font-family: 'Roboto Slab'">mooi text goes here</div>`
});

console.log("*frameJs loaded.");