import { createSlice } from "@reduxjs/toolkit";

export const ListSlice = createSlice({
  name: "list",
  initialState: {
    list: {},
    allList: [],
    currentCard: {},
    dragging: false,
    menu: [
      {
        id: 1,
        name: "Add Card",
        type: "addCard",
        show: true,
      },
      {
        id: 2,
        name: "Archive List",
        type: "archiveList",
        show: true,
      },
      {
        id: 3,
        name: "Restore List",
        type: "restoreList",
        show: true,
      },
      {
        id: 4,
        name: "Delete List",
        type: "deleteList",
        show: true,
      },
      {
        id: 5,
        name: "Copy List",
        type: "copyList",
        show: true,
      },
      {
        id: 6,
        name: "Automation",
        type: "automation",
        show: true,
      },
      {
        id: 6,
        name: "Add List Color",
        type: "listColor",
        show: true,
      },
    ],
    listColor: [
      "#F8BBD0",
      "#E1BEE7",
      "#FFCDD2",
      "#90CAF9",
      "#9FA8DA",
      "#B39DDB",
      "#80CBC4",
      "#80DEEA",
      "#81D4FA",
      "#E6EE9C",
      "#C5E1A5",
      "#A5D6A7",
      "#FFCC80",
      "#FFE082",
      "#FFF59D",
      "#E0E0E0",
      "#A1887F",
      "#FF8A65",
      "#8D6E63",
      "#BDBDBD",
    ],
    activeMenuIds: [1, 2, 5, 6],
    archiveMenuIds: [3, 4],
    currentList: {},
    selectedColor: "",
  },
  reducers: {
    setAllList: (state, action) => {
      state.allList = action.payload;
    },
    setArchiveList: (state, action) => {
      state.allList = state.allList.filter((e:any) => {
        return e.id !== action.payload;
      });
      console.log(state.allList);
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
    },
    setDragging: (state, action) => {
      state.dragging = action.payload;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setCurrentList: (state, action) => {
      console.log(action.payload);

      state.currentList = action.payload;
    },
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
    },
  },
});
export const {
  setList,
  setAllList,
  setCurrentCard,
  setDragging,
  setArchiveList,
  setMenu,
  setCurrentList,
  setSelectedColor,
} = ListSlice.actions;
export default ListSlice.reducer;
