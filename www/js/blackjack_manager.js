// Blackjack OOP

let game = null; // Stores the current instance of the game

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
  $("#card").disabled = false; // Enables the button to draw a card
  $("#stand").disabled = false; // Enables the button to stand
  //$("#new_game").disabled= true; // Disables the button for a new game
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
  //TODO: Reveal the dealer's hidden card if you hid it like you were supposed to.

  $("#card").disabled = true; // Disables the button to draw a card
  $("#stand").disabled = true; // Disables the button to stand
  //$("#new_game").disabled = false; // Enables the button for a new game
}

//TODO: Implement this method.
/**
 * Clears the page to start a new game.
 */
function clearPage() {
  $("#dealer").text("");
  $("#player").text("");
  $("#game_status").text("");
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
  //debug(game); // Displays the current state of the game for debugging

  //TODO: Add missing code.
}

//TODO: Implement this method.
/**
 * Calculates and displays the final score of the game.
 * @param {Object} state - The current state of the game.
 */
function finalScore(state) {
  let winner = "";
  if (state.gameEnded) {
    if (state.dealerWon) winner += "Dealer Wins!";
    else if (state.playerWon) winner += "Player Wins!";
    else winner += "Tie!";
  }

  let msg = "";
  if (state.playerBusted) {
    msg = "Player Busted (> 25)!";
  } else if (state.dealerBusted) {
    msg = "Dealer Busted (> 25)!";
  } else if (state.isDraw) {
    msg = "";
  } else if (state.playerWon) {
    if (game.getCardsValue(game.playerCards) === Blackjack.MAX_POINTS) {
      msg = "BLACKJACK 25!";
    }
  }

  // Em vez de escrever na página principal, chama o pop up (modal)
  showWinnerPopup(
    winner,
    msg,
    game.getCardsValue(game.getPlayerCards()),
    game.getCardsValue(game.getDealerCards())
  );

  //document.getElementById("game_status").innerText = msg;
  $("#game_status").text("");
}

//TODO: Implement this method.
/**
 * Updates the dealer's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updateDealer(state) {
  // const dealerELT = document.getElementById("dealer");
  // dealerELT.innerHTML = "";

  $("#dealer").text("");
  const dealerCards = game.getDealerCards();
  //for (let c of dealerCards) printCard(dealerELT, c);

  // percorre as cartas do dealer
  for (let i = 0; i < dealerCards.length; i++) {
    const isHiddenCard = i === 1 && !state.gameEnded; //é a 2a carta (oculta) e o jogo ainda não terminou

    // se oculta: passa a string back para o ficheiro das costas da carta
    //caso contrario: passa a carta para revelar
    const cardToPrint = isHiddenCard ? "back" : dealerCards[i];

    printCard($("#dealer").get(0), cardToPrint);
  }

  const val = game.getCardsValue(dealerCards);
  let msg = ` Score [${state.gameEnded ? val : "??"}]`; //mostra a pontuação apenas quando o jogo termina: dps de ir buscar ate pelo menos 21, revela o resultado final
  $("#dealer")
    .get(0)
    .insertAdjacentHTML("beforeend", `<div><strong>${msg}</strong></div>`);

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
  $("#player").text("");
  for (let c of game.playerCards) printCard($("#player").get(0), c); //mostra as cartas do player

  const val = game.getCardsValue(game.playerCards);
  let msg = ` Score [${val}]`;
  $("#player")
    .get(0)
    .insertAdjacentHTML("beforeend", `<div><strong>${msg}</strong></div>`);
  if (state.gameEnded) {
    finalScore(state); //msg final jogo
    finalizeButtons();
  }
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
  //debug(game);
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
  //debug(game);

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
  //debug(game);
}

//TODO: Implement this method.
/**
 * Prints the card in the graphical interface.
 * @param {HTMLElement} element - The element where the card will be displayed.
 * @param {Card} card - The card to be displayed.
 * @param {boolean} [replace=false] - Indicates whether to replace the existing image.
 */
function printCard(element, card, replace = false) {
  const $img = $("<img>");
  // let é uma variável local que pode mudar de valor e pode ser declarada sem valor inicial
  let src;
  if (card === "back") {
    src = "img/png/card_back.png";
  } else {
    const fileName = card.getFileNameStem();
    src = `img/png/${fileName}.png`;
  }
  //atribuir a src ao img
  $img.attr("src", src);
  $img.addClass("m-4 mb-1 mt-1 card-img");
  $(element).append($img);
}

/*-----------------Pop Up ------------------------*/
/**
 * Exibe o pop up de vitória/derrota com a mensagem final
 * @param {string} winnerMessage - A mensagem de resultado do jogo ("Player Wins!")
 * @param {number} PlayerScore - A pontuação final do Player.
 * @param {number} DealerScore - A pontuação final do Dealer.
 */
function showWinnerPopup(winnerMessage, description, PlayerScore, DealerScore) {
  // Atualiza o conteúdo do Pop Up
  $("#Pop_Up-message").text("");
  // Define a mensagem do vencedor no elemento do Pop Up
  $("#Pop_Up-message").get(0).textContent = winnerMessage;

  $("#Pop_Up-description").text("");
  $("#Pop_Up-description").get(0).textContent = description;

  // Encontra o elemento DOM do Pop Up
  $("#Pop_Up-player-score").text("");
  $("#Pop_Up-dealer-score").text("");

  $("#Pop_Up-player-score").get(0).textContent = PlayerScore;
  $("#Pop_Up-dealer-score").get(0).textContent = DealerScore;

  const popupInstance = bootstrap.Modal.getOrCreateInstance(
    $("#winPop_up").get(0)
  );
  // Abre o Pop Up!
  popupInstance.show();
}
