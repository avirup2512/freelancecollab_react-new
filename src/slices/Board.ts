import { createSlice } from "@reduxjs/toolkit";

export const BoardSlice = createSlice({
  name: "board",
  initialState: {
    board: { user: [] },
    boardList: {},
    activeBoardList: [],
    archivedBoardList: [],
    selectedUser: [],
    selectedBoard: {},
    tagNameSet: {},
    tagColorSet: [],
  },
  reducers: {
    setBoardList: (state, action) => {
      state.boardList = action.payload;
    },
    setArchiveBoard: (state:any, action) => {
      for (let x in state.boardList) {
        if (action.payload.indexOf(x) !== -1) {
          delete state.boardList[x];
        }
      }
    },
    deleteBoardRedux: (state:any, action) => {
      for (let x in state.boardList) {
        if (action.payload.indexOf(x) !== -1) {
          delete state.boardList[x];
        }
      }
    },
    setBoard: (state:any, action) => {
      state.board = action.payload;
      if (
        state.board.hasOwnProperty("tag") &&
        Object.entries(state.board.tag).length > 0
      ) {
        Object.entries(state.board.tag).forEach((e) => {
          state.tagNameSet[e[1].tagName] = {
            color: e[1].tagColor,
            attachInBoard: e[1].attachInboard,
          };
        });
      }
    },
    setSelectedBoard: (state:any, action) => {
      state.selectedBoard[action.payload.id] = action.payload;
    },
    removeSelectedBoard: (state:any, action) => {
      delete state.selectedBoard[action.payload];
    },
    resetSelectedBoard: (state, action) => {
      state.selectedBoard = action.payload;
    },
    selectAllBoard: (state:any, action) => {
      for (var x in state.boardList) {
        state.selectedBoard[state.boardList[x].id] = state.boardList[x];
      }
    },
    setTagNameInStore: (state:any, action) => {
      state.board.tag[action.payload.id].tagName = action.payload.tagName;
    },
    setTagColorInStore: (state:any, action) => {
      state.board.tag[action.payload.id].tagColor = action.payload.tagColor;
    },
    setTagAttachInBoardInStore: (state, action) => {
      state.board.tag[action.payload.id].attachInboard =
        action.payload.attachInboard;
    },
  },
});
export const {
  setBoard,
  setBoardList,
  setSelectedBoard,
  removeSelectedBoard,
  resetSelectedBoard,
  selectAllBoard,
  setArchiveBoard,
  deleteBoardRedux,
  setTagNameInStore,
  setTagColorInStore,
  setTagAttachInBoardInStore,
} = BoardSlice.actions;
export default BoardSlice.reducer;
