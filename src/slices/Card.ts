import { createSlice } from "@reduxjs/toolkit";

export const CardSlice = createSlice({
  name: "card",
  initialState: {
    card: {},
    allTag: [],
    allBoardTag: [],
    menu: [
      {
        id: 1,
        name: "Copy Card",
        type: "copyCard",
        show: true,
      },
      {
        id: 2,
        name: "Delete Card",
        type: "deleteCard",
        show: true,
      },
    ],
  },
  reducers: {
    setAllTag: (state, action) => {
      state.allTag = action.payload;
    },
    setCurrentCard: (state, action) => {
      console.log(action);
      
      state.card = action.payload;
    },
    setCheckList: (state:any, action) => {
      state.card.checkList.forEach((e:any, i:number) => {
        if (e.cliId == action.payload.cliId) {
          state.card.checkList[i] = action.payload;
        }
      });
    },
    setAllBoardTag: (state, action) => {
      state.allBoardTag = action.payload;
    },
    setCardMenu: (state, action) => {
      state.menu = action.payload;
    },
  },
});
export const {
  setAllTag,
  setCurrentCard,
  setCheckList,
  setAllBoardTag,
  setCardMenu,
} = CardSlice.actions;
export default CardSlice.reducer;
