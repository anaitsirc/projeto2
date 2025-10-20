// Blackjack object

/**
 * Class that represents the Blackjack game.
 */
class Blackjack {
  // Constant that defines the maximum points to avoid busting in Blackjack
  static MAX_POINTS = 25;
  // Constant that defines the point threshold at which the dealer must stand
  static DEALER_MAX_TURN_POINTS = 21;

  /**
   * Creates an instance of Blackjack and initializes the deck.
   */
  constructor() {
    this.dealerCards = []; // Array to hold the dealer's cards
    this.playerCards = []; // Array to hold the player's cards
    this.dealerTurn = false; // Flag to indicate if it's the dealer's turn to play

    // State of the game with information about the outcome
    this.state = {
      gameEnded: false, // Indicates whether the game has ended
      playerWon: false, // Indicates if the player has won
      dealerWon: false, // Indicates if the dealer has won
      playerBusted: false, // Indicates if the player has exceeded MAX_POINTS
      dealerBusted: false, // Indicates if the dealer has exceeded MAX_POINTS
    };

    // Initialize the deck of cards
    this.deck = this.shuffle(this.newDeck()); // Create and shuffle a new deck
  }

  //TODO: Implement this method
  /**
   * Creates a new deck of cards.
   * @returns {Card[]} - An array of cards.
   */
  newDeck() {
    const values = [
      "ace",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "jack",
      "queen",
      "king",
    ];
    const suits = ["clubs", "diamonds", "hearts", "spades"];
    const deck = [];
    for (let s of suits) {
      for (let v of values) deck.push(`${v}_of_${s}`);
    }
    return deck;
  }

  //TODO: Implement this method
  /**
   * Shuffles the deck of cards.
   * @param {Card[]} deck - The deck of cards to be shuffled.
   * @returns {Card[]} - The shuffled deck.
   */
  shuffle(deck) {
    const indices = [...Array(deck.length).keys()];
    const shuffled = [];
    while (indices.length > 0) {
      const r = Math.floor(Math.random() * indices.length);
      const idx = indices.splice(r, 1)[0];
      shuffled.push(deck[idx]);
    }
    return shuffled;
  }

  /**
   * Returns the dealer's cards.
   * @returns {Card[]} - An array containing the dealer's cards.
   */
  getDealerCards() {
    return this.dealerCards.slice(); // Return a copy of the dealer's cards
  }

  /**
   * Returns the player's cards.
   * @returns {Card[]} - An array containing the player's cards.
   */
  getPlayerCards() {
    return this.playerCards.slice(); // Return a copy of the player's cards
  }

  /**
   * Sets whether it is the dealer's turn to play.
   * @param {boolean} val - Value indicating if it's the dealer's turn.
   */
  setDealerTurn(val) {
    this.dealerTurn = val; // Update the dealer's turn status
  }

  //TODO: Implement this method
  /**
   * Calculates the total value of the provided cards.
   * @param {Card[]} cards - Array of cards to be evaluated.
   * @returns {number} - The total value of the cards.
   */
  getCardsValue(cards) {
    let sum = 0;
    let aceCount = 0;
    for (let card of cards) {
      const value = card.split("_of_")[0];
      if (["jack", "queen", "king"].includes(value)) sum += 10;
      else if (value === "ace") {
        sum += 11;
        aceCount++;
      } else sum += parseInt(value);
    }
    while (sum > Blackjack.MAX_POINTS && aceCount > 0) {
      sum -= 10;
      aceCount--;
    }
    return sum;
  }

  //TODO: Implement this method
  /**
   * Executes the dealer's move by adding a card to the dealer's array.
   * @returns {Object} - The game state after the dealer's move.
   */
  dealerMove() {
    this.dealerCards.push(this.deck.pop());
    return this.getGameState();
  }

  //TODO: Implement this method
  /**
   * Executes the player's move by adding a card to the player's array.
   * @returns {Object} - The game state after the player's move.
   */
  playerMove() {
    this.playerCards.push(this.deck.pop());
    return this.getGameState();
  }

  //TODO: Implement this method
  /**
   * Checks the game state based on the dealer's and player's cards.
   * @returns {Object} - The updated game state.
   */
  getGameState() {
    const playerValue = this.getCardsValue(this.playerCards);
    const dealerValue = this.getCardsValue(this.dealerCards);

    this.state = {
      gameEnded: false,
      playerWon: false,
      dealerWon: false,
      playerBusted: false,
      dealerBusted: false,
    };

    // Player bust
    if (playerValue > Blackjack.MAX_POINTS) {
      this.state.playerBusted = true;
      this.state.dealerWon = true;
      this.state.gameEnded = true;
      return this.state;
    }

    // Dealer bust
    if (this.dealerTurn && dealerValue > Blackjack.MAX_POINTS) {
      this.state.dealerBusted = true;
      this.state.playerWon = true;
      this.state.gameEnded = true;
      return this.state;
    }

    // Player hits 25 exactly
    if (playerValue === Blackjack.MAX_POINTS) {
      this.state.playerWon = true;
      this.state.gameEnded = true;
      return this.state;
    }

    // If dealer's turn, compare results only when both under 25
    if (this.dealerTurn) {
      if (dealerValue >= playerValue && dealerValue <= Blackjack.MAX_POINTS) {
        if (dealerValue === playerValue) {
          this.state.gameEnded = true; // tie
        } else {
          this.state.dealerWon = true;
          this.state.gameEnded = true;
        }
      }
    }

    return this.state;
  }
}
