// async function to handle user input
// async function handleCommand(input) {
//   let [command, ...rest] = input.trim().toLowerCase().split(" ");
//   let target = rest.join(" ");
//   let room = locations[gameState.currentLocation];

//   switch (command) {
//     case "help":
//       console.log(
//         "Commands:\n" +
//           "  look\n" +
//           "  read <item>\n" +
//           "  talk to <character>\n" +
//           "  take <item>\n" +
//           "  drop <item>\n" +
//           "  unlock\n" +
//           "  inventory\n" +
//           "  quit"
//       );
//       break;

//     case "look":
//       console.log("");
//       displayRoomDescription();
//       break;

//     case "read":
//       if (room.items[target]?.description) {
//         console.log(room.items[target].description);
//       } else {
//         console.log(`You can't read ${target}.`);
//       }
//       break;

//     case "talk":
//       if (room.characters[target]) {
//         room.characters[target].talk();
//       } else {
//         console.log(`You can't talk to ${target}.`);
//       }
//       break;

//     case "take":
//       if (room.items[target]?.takeable) {
//         gameState.inventory.push(target);
//         delete room.items[target];
//         console.log(`You took ${target}.`);
//         console.log(room.items[target].description);
//       } else {
//         console.log(`You can't take ${target}.`);
//       }

//       // add item to inventory
//       gameState.inventory.push(target);

//       // check if the item is in a limited group and disable the takeable property
//       if (room.items[target]?.limitedGroup) {
//         let group = room.items[target].limitedGroup;
//         for (let item in room.items) {
//           if (room.items[item].limitedGroup === group && item !== target) {
//             room.items[item].takeable = false;
//             console.log(`The ${item} can no longer be taken.`);
//           }
//         }
//       }

//       break;

//     case "drop":
//       if (gameState.inventory.includes(target)) {
//         room.items[target] = gameState.inventory.find(
//           (item) => item.name === target
//         );
//         gameState.inventory = gameState.inventory.filter(
//           (item) => item.name !== target
//         );
//         console.log(`You dropped ${target}.`);
//       } else {
//         console.log(`You don't have ${target} in your inventory.`);
//       }
//       break;

//     case "unlock":
//       if (!room.locked) {
//         console.log(`The door is already unlocked.`);
//       } else if (room.passCode) {
//         // checking to see if the room has a passcode
//         const passcode = await askForPasscode();
//         if (passcode === room.passCode) {
//           room.locked = false;
//           console.log(`You've unlocked the door!`);
//         } else {
//           console.log(`You didn't enter the combination correctly. Try again.`);
//         }
//       } else if (room.requiredItems) {
//         // checking to see if the room has required items
//         if (hasRequiredItems(room)) {
//           room.locked = false;
//           console.log(`You've unlocked the door!`);
//         } else {
//           console.log(`You don't have the required items to unlock this door.`);
//         }
//       }
//       break;

//     case "go":
//       if (!room.locked && room.nextLocation) {
//         displayRoomDescription();
//         gameState.currentLocation = room.nextLocation;
//       } else if (room.locked) {
//         console.log(
//           `The door is locked. Maybe there's a way to open it? Do you have what you need?.`
//         );
//       } else {
//         console.log(`You can't go to ${target}.`);
//       }
//       break;

//     case "inventory":
//       displayInventory();
//       break;

//     case "quit":
//       console.log("Thanks for playing. Good riddance!");
//       process.exit();

//     default:
//       console.log("Invalid command. Type 'help' for a list of commands.");
//   }
// }
