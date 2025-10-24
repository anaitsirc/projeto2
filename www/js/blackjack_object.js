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
    const deck = [];
    // 1: ace, 11: jack, 12: queen, 13: king
    const cardValues = Array.from({ length: 13 }, (_, i) => i + 1); // conjunto [1, 2, ..., 13]
    // 4 suits: hearts, diamonds, clubs, spades
    const suits = Array.from({ length: 4 }, (_, i) => i + 1); // [1, 2, 3, 4]

    for (const suit of suits) {
      for (const value of cardValues) {
        deck.push(new Card(value, suit)); //-> conjunto de 13 x 4 naipes
      }
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
    let indices = Array.from({ length: deck.length }, (_, i) => i); //array idx 0-51 (52 cards)
    const shuffledDeck = [];

    for (let i = 0; i < deck.length; i++) {
      //para todas as 52 cartas
      const randomIdx = Math.floor(Math.random() * indices.length); // gerar idx random do array de indices disponiveis criado
      const originalIdx = indices[randomIdx]; // obter o idx correspondente no deck original
      const card = deck[originalIdx]; // a carta sorteada
      shuffledDeck.push(card); //carta inclui do deck baralhado

      indices.splice(randomIdx, 1); //esse idx deixa de estar disponivel (carta usada) e é removido no array de idx
    }
    return shuffledDeck;
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
    let result = 0;
    let aces = 0;

    for (const card of cards) {
      if (card.value >= 2 && card.value <= 10) {
        result += card.value; //cartas numeradas refletem no seu valor de pontuaçao
      } else if (card.value >= 11 && card.value <= 13) {
        result += 10; // jack, queen, king valem 10
      } else if (card.value == 1) {
        result += 11; // [ACE] vale 11 inicialmnete (continua...)
        aces++;
      }
    }

    // [ACE] (continuação)
    while (aces > 0 && result > Blackjack.MAX_POINTS) {
      //ha aces na jogada e a potuação excede MAX_POINTS 25
      //ajusta automaticamente o Ás passa de 11 para 1
      result -= 10; // 11 - 10 = 1
      aces--;
    }

    return result;
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
    const playerPoints = this.getCardsValue(this.playerCards);
    const dealerPoints = this.getCardsValue(this.dealerCards);

    //reset
    this.state = {
      gameEnded: false,
      playerWon: false,
      dealerWon: false,
      playerBusted: false,
      dealerBusted: false,
      isDraw: false,
    };

    // [check] palyer (vitória/derrota imediata)
    if (playerPoints > Blackjack.MAX_POINTS) {
      this.state.gameEnded = true;
      this.state.dealerWon = true;
      this.state.playerBusted = true;
      return this.state;
    }
    if (playerPoints === Blackjack.MAX_POINTS) {
      this.state.gameEnded = true;
      this.state.playerWon = true;
      return this.state;
    }

    // [check] final (na vez do dealer)
    if (this.dealerTurn) {
      //dealer rebenta os 25
      if (dealerPoints > Blackjack.MAX_POINTS) {
        this.state.gameEnded = true;
        this.state.playerWon = true; //player wins instant
        this.state.dealerBusted = true;
        return this.state;
      }

      // se o dealer ainda nao atingiu pelo menos 21
      if (dealerPoints < Blackjack.DEALER_MAX_TURN_POINTS) {
        //jogo continua; dealer vai buscar mais cartas
        return this.state;
      }

      // dealerPoints >= DEALER_MAX_TURN_POINTS (atingiu 21) -> comparar com o player
      if (dealerPoints > playerPoints) {
        //dealer + pontos q o player
        this.state.gameEnded = true;
        this.state.dealerWon = true;
      } else if (dealerPoints === playerPoints) {
        //dealer same pontuaçao player
        this.state.gameEnded = true;
        this.state.isDraw = true;
      } else {
        //sem rebentamentos, player tem + pontos q o dealer
        this.state.gameEnded = true;
        this.state.playerWon = true;
      }
      return this.state;
    }

    return this.state;
  }
}

//Class Card
/**
 * Class para representar uma carta única.
 * Usa strings para representar o value e suit da carta para referenciar
 * facilmente os ficheiros das imagens.
 */
class Card {
  static VALUE_MAP = {
    1: "ace",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "jack",
    12: "queen",
    13: "king",
  };
  static SUIT_MAP = {
    1: "hearts",
    2: "diamonds",
    3: "clubs",
    4: "spades",
  };

  /**
   * @param {string} value - Valor da carta (ace, 2 a 10, jack, queen, king).
   * @param {string} suit - Naipe da carta (clubs, diamonds, hearts, spades).
   */
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  /**
   * Retorna o valor para a pontuação do jogo Blabkjack 25.
   * @returns {number} Valor numérico da carta (1/11 para Ace, 10 para figuras, proprio valor para cartas numeradas).
   */
  getCardFace() {
    switch (this.value) {
      case "ace":
        return 11; // [ACE] default, tratar para ajustar entre 1 e 11
      case "king":
      case "queen":
      case "jack":
      case "10":
        return 10;
      default:
        return parseInt(this.value, 10);
    }
  }

  /**
   * Retorna a string base do nome do ficheiro (ex: 'ace_of_spades') para a imagem.
   * @returns {string} The filename stem.
   */
  getFileNameStem() {
    const valueStr = Card.VALUE_MAP[this.value];
    const suitStr = Card.SUIT_MAP[this.suit];

    if (!valueStr || !suitStr) {
      return "card_back";
    }

    if (this.value >= 11 && this.value <= 13) {
      return `${valueStr}_of_${suitStr}2`;
    }

    return `${valueStr}_of_${suitStr}`;
  }
}
