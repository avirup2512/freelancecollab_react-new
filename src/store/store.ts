import { configureStore } from "@reduxjs/toolkit";
import { BoardSlice } from "../slices/Board";
import { AuthSlice } from "../slices/Auth";
import { ProjectSlice } from "../slices/Project";
import { DashboardSlice } from "../slices/Dashboard";
import { ListSlice } from "../slices/List";
import { CardSlice } from "../slices/Card";

export default configureStore({
    reducer: {
        // Add your reducers here
        auth: AuthSlice.reducer,
        board: BoardSlice.reducer,
        project: ProjectSlice.reducer,
        dashboard: DashboardSlice.reducer,
        list: ListSlice.reducer,
        card:CardSlice.reducer
    },
});