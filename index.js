const { log } = require("console");
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

async function start() {
  const welcomeMessage = `The rumbling of the truck engine rattles the contents of each cardboard box.
  It's filled with memories of a faraway place.\nAt least, it feels far.\nThe door of the truck is locked, but there
  is a combination lock.\nIs there anything to LOOK for?`;
  console.log(welcomeMessage);
  let keepRunning = true;

  while (keepRunning) {
    try {
      let answer = await ask(">_ ");
      if (answer.toLowerCase() === "quit" || answer.toLowerCase() === "exit") {
        keepRunning = false;
      } else {
        const room = locations[gameState.currentLocation];
        if (!room) {
          console.log(
            `Error: Current location ${gameState.currentLocation} not found.`
          );
        } else {
          handleCommand(answer);
        }
      }
    } catch (error) {
      console.log(`An error occurred: ${error.message}`);
    }
  }
  readlineInterface.close();
}

// object for locations

const locations = {
  movingTruck: {
    description:
      "A big door is blocking your exit into Pallet Town.\nMaybe there's some way to unlock it...",
    items: {
      paper: {
        description:
          "This is a piece of crumpled paper you found in your pocket.\nIt has a the words 'SILPH' written on it.",
        takeable: true,
      },
      stuffedCharizard: {
        description:
          "Your stuffed Charizard is looking at you;\nthe burn mark is still there.",
        takeable: false,
      },
    },
    characters: {},
    passCode: "silph",
    requiredItems: [],
    paths: {
      east: "palletTown",
    },
    lockedPaths: {
      east: {
        locked: true,
        passCode: "silph",
        requiredItems
      },
    },
  },
  palletTown: {
    description:
      "Pallet Town.\nThe fresh air in the new town still washed a familiar air over you.\nYou are right outside your new house.\nThere is a neighboring house and what looks like a lab in your line of sight.\nA placid lake to the south and some tall grass to the north.\nYou stand upright to face your mother.",
    items: null,
    characters: {
      mom: {
        name: "mom",
        dialogue:
          "We should probably head inside the house to start unpacking;\nbefore it gets dark.",
        talk: () =>
          console.log(
            "It's so nice here isn't it? Even that tall grass looks peaceful. *sighs*"
          ),
      },
    },
    locked: false,
    requiredItems: [],
    paths: {
      north: "newHouse",
    },
  },
  newHouse: {
    description:
      "The house looks empty so far, but the moving men are hauling furniture around.\nIt might take a while for this to feel like home.",
    items: {
      shoes: {
        description:
          "These are your running shoes. They are so cool.\nButI will need them to explore the new town",
        takeable: true,
      },
      backpack: {
        description:
          "This is your backpack. You can put stuff in it.\nThere are leftover snacks from the trip, but you will probably need it.",
        takeable: true,
      },
    },
    characters: {
      mom: {
        name: "Mom",
        dialogue:
          "If you going exploring, make sure you bring your backpack! And get these shoes off the floor!",
        talk: () =>
          console.log(
            "Your mother grumbles a few words incisively that you've never heard before...\nMaybe you should pick up your shoes..."
          ),
      },
      movingMan: {
        name: "Moving Man",
        dialogue: "How many pieces of furniture are left in the truck??",
        talk: () =>
          console.log(
            "One of the movers says to himself that we should have Pokemon to perform this task."
          ),
      },
    },
    locked: true,
    requiredItems: ["shoes", "backpack"],
    paths: { south: "professorLab" },
    lockedPaths: {
      south: {
        locked: true,
        requiredItems: ["shoes", "backpack"],
      },
    },
  },
  professorLab: {
    description:
      "A vacuous, if noisy room with loads of machines that I don't understand.",
    items: {
      bulbasaur: {
        name: "Bulbasaur",
        description:
          "A Pokemon that carries a seed on its back that it uses for nutrients to grow.",
        takeable: true,
        limitedGroup: "group1",
      },
      charmander: {
        name: "Charmander",
        description:
          "A fire is on lit on the end of this Pokemon's tail. It's burning extremely brightly.",
        takeable: true,
        limitedGroup: "group1",
      },
      squirtle: {
        name: "Squirtle",
        description: "A blue turtle Pokemon with an extremely resilient shell.",
        takeable: true,
        limitedGroup: "group1",
      },
    },
    characters: {
      professor: {
        name: "Professor",
        dialogue:
          "I'm so happy to to be sharing my Pokemon with you!\nHowever, I do have a favor to ask of you...\nI want to enlist the help of you (along with my grandson) to help me complete my research.\nPlease, take a look at these three Pokemon.\nI want you to choose one to accompany you on your journey.\nPokemon bonds last for life. Take good care of whichever you choose.",
        talk: () =>
          console.log(
            "The professor splutters something through tears that you can't quite make out..."
          ),
      },
      blue: {
        name: "Blue",
        dialogue:
          "I might help Gramps with his research, but I'm going to be the strongest trainer that ever lived.\nI would pit ours against one another, but that would be an insult to my Pokemon!",
        talk: () => console.log("Smell ya later!!"),
      },
    },
    locked: true,
    requiredItems: [["bulbasaur", "charmander", "squirtle"]],
    paths: { north: "tall grass" },
    lockedPaths: {
      north: {
        locked: true,
        requiredItems: [["bulbasaur", "charmander", "squirtle"]],
      },
    },
  },
  tallGrass: {
    description:
      "This is the tall grass to the North of Pallet Town.\nYou recognize this is where you new adventure begins.\nYou can't wait to see all of the Pokemon that Kanto has to offer.\nMaybe I should start by filling my backpack with Poke Balls...",
    items: null,
    characters: null,
    locked: false,
    requiredItems: [],
    nextLocation: null,
  },
};

// initialize/update game state
let gameState = {
  currentLocation: "movingTruck",
  inventory: [],
};

// function to display location info

function displayRoomDescription() {
  const room = locations[gameState.currentLocation];
  if (!room) {
    console.log(
      `Error: Current location ${gameState.currentLocation} not found.`
    );
    return;
  }

  console.log(room.description);

  // list of items in the room
  if (room.items && Object.keys(room.items).length > 0) {
    console.log("Items in the room:");
    for (let item in room.items) {
      console.log(`${item}: ${room.items[item].description}`);
    }
  }

  // empty line of text for spacing
  console.log(" ");

  //list of characters in the room
  if (room.characters && Object.keys(room.characters).length > 0) {
    console.log("Characters in the room:");
    for (let character in room.characters) {
      console.log(`${character}: "${room.characters[character].dialogue}"`);
    }
  } else {
    console.log("You are alone in this room.");

    // empty line of text for spacing
    console.log(" ");
    showPaths();
  }
}

// function to display inventory
function displayInventory() {
  if (Object.keys(gameState.inventory).length > 0) {
    console.log("Inventory:");
    for (let item in gameState.inventory) {
      console.log(`${item}: ${gameState.inventory[item].description}`);
    }
  } else {
    console.log("You have nothing in your inventory.");
  }
}

// function to check to see if player has required items
function hasRequiredItems(location) {
  return location.requiredItems.every((item) =>
    gameState.inventory.includes(item)
  );
}

// function to ask for the passcode
async function askForPasscode() {
  const passcode = await ask("Enter the passcode: ");
  return passcode.trim().toLowerCase();
}

async function handleCommand(input) {
  const [command, ...rest] = input.trim().toLowerCase().split(" ");
  const target = rest.join(" ");
  const room = locations[gameState.currentLocation];

  const actions = {
    help: displayHelp,
    look: displayRoomDescription,
    read: handleRead,
    talk: handleTalk,
    take: handleTake,
    drop: handleDrop,
    unlock: handleUnlock,
    go: handleGo,
    inventory: handleInventory,
    paths: showPaths,
    quit: handleQuit,
  };

  if (actions[command]) {
    if (command === "unlock") {
      await actions[command](target, room);
    } else {
      actions[command](target, room);
    }
  } else {
    console.log("Invalid command. Type 'help' for a list of commands.");
  }
}

function displayHelp() {
  console.log(
    "Commands:\n" +
      "  look\n" +
      "  read <item>\n" +
      "  talk to <character>\n" +
      "  take <item>\n" +
      "  drop <item>\n" +
      "  unlock\n" +
      "  inventory\n" +
      "  quit"
  );
}

function handleRead(target, room) {
  if (room.items[target]?.description) {
    console.log(room.items[target].description);
  } else {
    console.log(`You can't read ${target}.`);
  }
}

function handleTalk(target, room) {
  const characterName = target
    .replace(/^to\s+/, "")
    .trim()
    .toLowerCase();

  if (room.characters?.[characterName]) {
    room.characters[characterName].talk();
  } else {
    console.log(`You can't talk to ${characterName}.`);
  }
}

function handleTake(target, room) {
  if (room.items[target]?.takeable) {
    gameState.inventory.push(target);
    console.log(" ");
    console.log(room.items[target].description);
    delete room.items[target];
    console.log(`You took ${target}.`);
    console.log("Inventory: ", gameState.inventory);
  } else {
    console.log(`You can't take ${target}.`);
  }

  // add item to inventory
  gameState.inventory.push(target);

  // check if the item is in a limited group and disable the takeable property
  if (room.items[target]?.limitedGroup) {
    let group = room.items[target].limitedGroup;
    for (let item in room.items) {
      if (room.items[item].limitedGroup === group && item !== target) {
        room.items[item].takeable = false;
        console.log(`The ${item} can no longer be taken.`);
      }
    }
  }
}

function handleDrop(target, room) {
  if (!Array.isArray(gameState.inventory)) {
    if (gameState.inventory.includes(target)) {
      room.items[target] = gameState.inventory.find(
        (item) => item.name === target
      );
      gameState.inventory = gameState.inventory.filter(
        (item) => item !== target
      );
      console.log(`You dropped ${target}.`);
    } else {
      console.log(`You don't have ${target} in your inventory.`);
    }
  }
}

async function handleUnlock(target, room) {
  if (!room.locked) {
    console.log(`The door is already unlocked.`);
    return;
  }

  if (room.passCode) {
    // checking to see if the room has a passcode
    const passcode = await askForPasscode();
    if (passcode === room.passCode) {
      room.locked = false;
      console.log(`You've unlocked the door!`);
    } else {
      console.log(`You didn't enter the combination correctly. Try again.`);
    }
  } else if (room.requiredItems) {
    // checking to see if the room has required items
    if (hasRequiredItems(room)) {
      room.locked = false;
      console.log(`You've unlocked the door!`);
    } else {
      console.log(`You don't have the required items to unlock this door.`);
    }
  }
  // continue the game loop
  displayRoomDescription();
}

function handleGo(target, room) {
  console.log(`Attempting to go ${target}.`);
  if (!room || !room.paths) {
    console.log("You can't go that way.");
    return;
  }

  // Check if the path exists
  const nextLocationName = room.paths[target];

  if (!nextLocationName) {
    console.log("You can't go that way.");
    return;
  }

  const nextLocation = locations[nextLocationName];
  if (!nextLocation) {
    console.log(
      `Error: You can't go to ${nextLocationName}, as it does not exist.`
    );
    return;
  }

  // Check if the path is locked
  const pathLock = room.lockedPaths?.[target];

  // Handle locked paths
  if (pathLock?.locked) {
    console.log(`The path to ${target} is locked.`);
    if (pathLock.requiredItems) {
      const hasItems = pathLock.requiredItems.every((item) =>
        gameState.inventory.includes(item)
      );
      if (hasItems) {
        console.log("You used the required items to unlock the path!");
        pathLock.locked = false;
      } else {
        console.log("You don't have the required items to unlock this path.");
        return;
      }
    } else {
      console.log("The path is locked and cannot be opened yet.");
      return;
    }
  }

  // Move to the next location
  gameState.currentLocation = nextLocationName;
  displayRoomDescription();
}

function handleInventory(target, room) {
  displayInventory();
}

function showPaths() {
  const room = locations[gameState.currentLocation];
  if (room.paths && Object.keys(room.paths).length > 0) {
    console.log("Paths:");
    for (let direction in room.paths) {
      console.log(`- ${direction} leads to ${room.paths[direction]}`);
    }
  } else {
    console.log("You are stuck!");
  }
}

function handleQuit() {
  console.log("Thanks for playing. Good riddance!");
  readlineInterface.close();
}

start();

// switch case expression for every possibility
//
// drop (including being added to the room's inventory)
// unlocked doors need to stay unlocked
