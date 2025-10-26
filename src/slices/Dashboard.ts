import { createSlice } from "@reduxjs/toolkit";
import { Tab } from "../interfaces/App";

export const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    page: "",
    activateTab:Tab.ACTIVE,
    allRoles: [],
    paginationState: {
      currentOffset: 0,
      itemsPerPage: 5,
      type:Tab.ACTIVE
    }
  },
  reducers: {
    setAllRoles: (state, action) => {
      state.allRoles = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setActivateTab: (state, action) => {
      state.activateTab = action.payload;
    },
    setPaginationState: (state, action) => {
      state.paginationState = action.payload;
    }
  },
});
export const {
  setPage,
  setAllRoles,
  setActivateTab,
  setPaginationState
} = DashboardSlice.actions;
export default DashboardSlice.reducer;
