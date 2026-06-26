/**
 * 🎯 CONFIGURAÇÃO BASE DO JOGO DE DAMA
 * 
 * Este ficheiro contém apenas regras e constantes.
 * NÃO deve conter lógica de jogo.
 */

const DAMA_CONFIG = {
  // 📐 Tabuleiro
  BOARD: {
    SIZE: 8, // 8x8 padrão internacional
    DARK_SQUARE: 1,
    LIGHT_SQUARE: 0
  },

  // 👥 Jogadores
  PLAYERS: {
    PLAYER_1: {
      id: 1,
      color: "white",
      direction: -1 // sobe no tabuleiro
    },
    PLAYER_2: {
      id: 2,
      color: "black",
      direction: 1 // desce no tabuleiro
    }
  },

  // ♟️ Peças
  PIECES: {
    EMPTY: 0,

    WHITE: 1,
    WHITE_KING: 2,

    BLACK: -1,
    BLACK_KING: -2
  },

  // 🎮 Regras do jogo
  RULES: {
    MUST_CAPTURE: true, // captura obrigatória
    MULTI_CAPTURE: true, // múltiplas capturas permitidas
    KING_CAN_MOVE_MULTIPLE: true, // dama anda várias casas
    KING_CAN_CAPTURE_BACKWARD: true,
    NORMAL_CAN_CAPTURE_BACKWARD: true, // dependendo da variante
    PROMOTION_ROW_PLAYER_1: 0,
    PROMOTION_ROW_PLAYER_2: 7
  },

  // ⏱️ Tempo (opcional para futuro)
  TIMER: {
    ENABLED: false,
    TURN_TIME_LIMIT: 60 // segundos
  },

  // 🧠 Match / Estado
  MATCH: {
    MAX_PLAYERS: 2,
    MIN_PLAYERS: 2,
    INITIAL_TURN: 1, // Player 1 começa
    ALLOW_DRAW: true
  },

  // 📡 Eventos de socket (padronização)
  SOCKET_EVENTS: {
    MOVE: "dama:move",
    VALID_MOVE: "dama:valid_move",
    INVALID_MOVE: "dama:invalid_move",
    GAME_START: "dama:start",
    GAME_END: "dama:end",
    UPDATE_BOARD: "dama:update_board"
  },

  // 📊 Estados do jogo
  GAME_STATUS: {
    WAITING: "waiting",
    STARTED: "started",
    FINISHED: "finished",
    DRAW: "draw"
  },

  // 🧪 Debug
  DEBUG: {
    ENABLE_LOGS: true
  }
};

module.exports = DAMA_CONFIG;