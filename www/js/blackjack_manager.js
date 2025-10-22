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
  clearPage(); //limpa o resto anterior

  game = new Blackjack(); // Creates a new instance of the Blackjack game

  //duas cartas a cada um | dealer- a 2ª virada pa baixo
  game.dealerMove(); //1a card Dealer
  game.playerMove(); //1a card Player

  game.dealerMove(); //2a card Dealer
  let state = game.playerMove(); // 2a card Player : verifica se player fez 25 ou rebentou

  updateDealer(state); //display com 2ª carta do dealer oculta
  updatePlayer(state);

  buttonsInitialization();
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
  if (state.playerBusted) {
    msg = "Player Busted (> 25)!";
  } else if (state.dealerBusted) {
    msg = "Dealer Busted (> 25)!";
  } else if (state.isDraw) {
    msg = "Tie!";
  } else if (state.playerWon) {
    msg = `Player Wins! ${game.getCardsValue(game.getPlayerCards())} points!`;
    if (game.getCardsValue(game.playerCards) === Blackjack.MAX_POINTS) {
      msg = "BLACKJACK 25!";
    }
  } else if (state.dealerWon) {
    msg = `Dealer Wins! ${game.getCardsValue(game.getDealerCards())} pontos!`;
  }

  document.getElementById("game_status").innerText = msg;
}

//TODO: Implement this method.
/**
 * Updates the dealer's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updateDealer(state) {
  const dealerELT = document.getElementById("dealer");
  dealerELT.innerHTML = "";
  const dealerCards = game.getDealerCards();
  //for (let c of dealerCards) printCard(dealerELT, c);

  // percorre as cartas do dealer
  for (let i = 0; i < dealerCards.length; i++) {
    const isHiddenCard = i === 1 && !state.gameEnded; //é a 2a carta (oculta) e o jogo ainda não terminou

    // se oculta: passa a string back para o ficheiro das costas da carta
    //caso contrario: passa a carta para revelar
    const cardToPrint = isHiddenCard ? "back" : dealerCards[i];

    printCard(dealerELT, cardToPrint);
  }

  const val = game.getCardsValue(dealerCards);
  let msg = ` Score [${state.gameEnded ? val : "??"}]`; //mostra a pontuação apenas quando o jogo termina: dps de ir buscar ate pelo menos 21, revela o resultado final
  if (state.gameEnded) {
    if (state.dealerWon) msg += "Dealer Wins!";
    else if (state.playerWon) msg += "Dealer Loses!";
    else msg += "Tie!";
  }

  dealerELT.insertAdjacentHTML(
    "beforeend",
    `<div><strong>${msg}</strong></div>`
  );
  if (state.gameEnded) {
    finalScore(state); //msg final jogo
    finalizeButtons();
  }
}

//TODO: Implement this method.
/**
 * Updates the player's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updatePlayer(state) {
  const playerELT = document.getElementById("player");
  playerELT.innerHTML = "";
  for (let c of game.playerCards) printCard(playerELT, c); //mostra as cartas do player

  const val = game.getCardsValue(game.playerCards);
  let msg = ` Score [${val}]`;
  if (state.gameEnded) {
    if (state.playerWon) msg += "You Win!";
    else if (state.dealerWon) msg += "You Lose!";
    else msg += "Tie!";
  }

  playerELT.insertAdjacentHTML(
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
  updatePlayer(state); //?
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
  updateDealer(state); // atualiza o dealer caso o player rebente
  debug(game);

  if (state.gameEnded) {
    finalizeButtons();
  }

  return state;
}

//TODO: Implement this method.
/**
 * Finishes the dealer's turn.
 */
function dealerFinish() {
  game.setDealerTurn(true); //vez do dealer

  let state = game.getGameState(); //estado atual
  // "Caso o jogador passe o jogo para o dealer, este joga automaticamente até ter pelo menos 21 pontos."
  while (
    !state.gameEnded &&
    game.getCardsValue(game.getDealerCards()) < Blackjack.DEALER_MAX_TURN_POINTS
  ) {
    state = dealerNewCard(); // dealerNewCard() chama game.dealerMove() e updateDealer()
  }
  state = game.getGameState();

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
  if (card === "back") {
    img.src = "img/png/card_back.png";
    img.alt = "Card Back";
  } else {
    const fileName = card.getFileNameStem();
    img.src = `img/png/${fileName}.png`;
    img.alt = fileName;
  }
  img.className = "m-1 card-img";
  element.appendChild(img);
}
/**
 * Exibe o pop up de vitória/derrota com a mensagem final
 * @param {string} winnerMessage - A mensagem de resultado do jogo ("Player Wins!")
 * @param {number} PlayerScore - A pontuação final do Player.
 * @param {number} DealerScore - A pontuação final do Dealer.
 */
function showWinnerPopup(winnerMessage, PlayerScore, DealerScore) {
  // Atualiza o conteúdo do Pop Up
  const popupMessageEl = document.getElementById("Pop_Up-message");
  if (popupMessageEl) {
    // Define a mensagem do vencedor no elemento do Pop Up
    popupMessageEl.textContent = winnerMessage;
  }

  // Encontra o elemento DOM do Pop Up
  const playerPopupElement = document.getElementById("Pop_Up-player-score");
  const dealerPopupElement = document.getElementById("Pop_Up-dealer-score");
  if (playerPopupElement) {
    playerPopupElement.textContent = PlayerScore;
  }

  if (dealerPopupElement) {
    dealerPopupElement.textContent = DealerScore;
  }
  const winPopupElement = document.getElementById("winPop_up");
  if (winPopupElement) {
    const popupInstance = bootstrap.Modal.getOrCreateInstance(winPopupElement);
    // Abre o Pop Up!
    popupInstance.show();
  }
}
/**
 * Calcula e exibe o score final do jogo, chamando o Pop Up de vitória/derrota
 * @param {Object} state  O estado atual do jogo
 *
 */
function finalScore(state) {
  let msg = "";
  const playerValue = game.getCardsValue(game.getPlayerCards());
  const dealerValue = game.getCardsValue(game.getDealerCards());

  if (state.playerBusted) {
    msg = "Player Busted (> 25)! Dealer Wins.";
  } else if (state.dealerBusted) {
    msg = "Dealer Busted (> 25)! Player Wins.";
  } else if (state.isDraw) {
    msg = `Tie! Both with ${playerValue} points.`;
  } else if (state.playerWon) {
    if (playerValue === Blackjack.MAX_POINTS) {
      msg = "BLACKJACK 25! Player Wins!";
    } else {
      msg = `Player Wins with ${playerValue} points!`;
    }
  } else if (state.dealerWon) {
    msg = `Dealer Wins with ${dealerValue} points!`;
  }

  // Em vez de escrever na página principal, chama o pop up (modal)
  showWinnerPopup(msg, playerValue, dealerValue);

  // O status na página principal
  document.getElementById("game_status").innerText = msg;
}
