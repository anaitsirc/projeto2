// Blackjack OOP

let game = null; // Stores the current instance of the game

/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
  document.getElementById("debug").innerHTML = JSON.stringify(obj); // Displays the state of the object as JSON
}

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
  document.getElementById("card").disabled = false; // Enables the button to draw a card
  document.getElementById("stand").disabled = false; // Enables the button to stand
  document.getElementById("new_game").disabled = true; // Disables the button for a new game
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
  //TODO: Reveal the dealer's hidden card if you hid it like you were supposed to.

  document.getElementById("card").disabled = true; // Disables the button to draw a card
  document.getElementById("stand").disabled = true; // Disables the button to stand
  document.getElementById("new_game").disabled = false; // Enables the button for a new game
}

//TODO: Implement this method.
/**
 * Clears the page to start a new game.
 */
function clearPage() {
  document.getElementById("dealer").innerHTML = "";
  document.getElementById("player").innerHTML = "";
  document.getElementById("game_status").innerHTML = "";
  document.getElementById("debug").innerHTML = "";
}

//TODO: Complete this method.
/**
 * Starts a new game of Blackjack.
 */
function newGame() {
  clearPage();

  game = new Blackjack(); // Creates a new instance of the Blackjack game

  buttonsInitialization();

  // Dealer: 2 cartas (esconde 2ª)
  game.dealerCards.push(game.deck.pop());
  hiddenDealerCard = game.deck.pop();
  game.dealerCards.push(hiddenDealerCard);

  const dealerEl = document.getElementById("dealer");
  printCard(dealerEl, game.dealerCards[0]);
  printCard(dealerEl, "back"); // carta virada para baixo

  // Player: 2 cartas
  const playerEl = document.getElementById("player");
  game.playerCards.push(game.deck.pop());
  game.playerCards.push(game.deck.pop());
  for (let c of game.playerCards) printCard(playerEl, c);

  debug(game); // Displays the current state of the game for debugging

  //TODO: Add missing code.
}

//TODO: Implement this method.
/**
 * Calculates and displays the final score of the game.
 * @param {Object} state - The current state of the game.
 */
function finalScore(state) {
  let msg = "";
  if (state.playerWon) msg = "You Win!";
  else if (state.dealerWon) msg = "Dealer Wins";
  else msg = "Tied!";

  document.getElementById("game_status").innerText = msg;
}

//TODO: Implement this method.
/**
 * Updates the dealer's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updateDealer(state) {
  const dealerEl = document.getElementById("dealer");
  dealerEl.innerHTML = "";
  const dealerCards = game.getDealerCards();
  for (let c of dealerCards) printCard(dealerEl, c);

  const val = game.getCardsValue(dealerCards);
  let msg = ` (${val})`;
  if (state.gameEnded) {
    if (state.dealerWon) msg += "Dealer Wins!";
    else if (state.playerWon) msg += "Dealer Loses!";
    else msg += "Tied!";
  }

  dealerEl.insertAdjacentHTML(
    "beforeend",
    `<div><strong>${msg}</strong></div>`
  );
  if (state.gameEnded) finalizeButtons();
}

//TODO: Implement this method.
/**
 * Updates the player's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updatePlayer(state) {
  const playerEl = document.getElementById("player");
  playerEl.innerHTML = "";
  for (let c of game.playerCards) printCard(playerEl, c);

  const val = game.getCardsValue(game.playerCards);
  let msg = ` (${val})`;
  if (state.gameEnded) {
    if (state.playerWon) msg += "You Win!";
    else if (state.dealerWon) msg += "You Lose!";
    else msg += "Tied!";
  }

  playerEl.insertAdjacentHTML(
    "beforeend",
    `<div><strong>${msg}</strong></div>`
  );
  if (state.gameEnded) finalizeButtons();
}

//TODO: Implement this method.
/**
 * Causes the dealer to draw a new card.
 * @returns {Object} - The game state after the dealer's move.
 */
function dealerNewCard() {
  const state = game.dealerMove();
  updateDealer(state);
  debug(game);
  return state;
}

//TODO: Implement this method.
/**
 * Causes the player to draw a new card.
 * @returns {Object} - The game state after the player's move.
 */
function playerNewCard() {
  const state = game.playerMove();
  updatePlayer(state);
  debug(game);
  return state;
}

//TODO: Implement this method.
/**
 * Finishes the dealer's turn.
 */
function dealerFinish() {
  game.setDealerTurn(true);
  // Revela carta escondida
  const dealerEl = document.getElementById("dealer");
  dealerEl.innerHTML = "";
  for (let c of game.dealerCards) printCard(dealerEl, c);

  let state = game.getGameState();
  while (!state.gameEnded) {
    const dealerVal = game.getCardsValue(game.getDealerCards());
    if (dealerVal < Blackjack.DEALER_MAX_TURN_POINTS) {
      state = dealerNewCard();
    } else {
      state = game.getGameState();
      state.gameEnded = true;
    }
  }

  updateDealer(state);
  updatePlayer(state);
  debug(game);
}

//TODO: Implement this method.
/**
 * Prints the card in the graphical interface.
 * @param {HTMLElement} element - The element where the card will be displayed.
 * @param {Card} card - The card to be displayed.
 * @param {boolean} [replace=false] - Indicates whether to replace the existing image.
 */
function printCard(element, card, replace = false) {
  const img = document.createElement("img");
  if (card === "back") img.src = "img/png/card_back.png";
  else img.src = `img/png/${card}.png`;
  img.alt = card;
  img.className = "m-1 card-img";
  element.appendChild(img);
}
