import { useState } from "react";
import SidebarComponent from "./sidebar/SideBar";
import Header from "./header/Header";
import Board from "./board/Board";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Project from "./project/Project";
import ListContainer from "./list/ListContainer";
import CardDetails from "./card/CardDetails";
import SearchResult from "./searchResult/SearchResult";
import UserProfile from "./user/User";
import { SidebarInset, SidebarProvider } from "../ui/_sidebar";
import Report from "./report/Report";
import TeamManagement from "./team/TeamManagement";
function Dashboard() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('boards');
  const onMenuClick = (state:string) => {
    setActiveItem(state);
    navigate("../dashboard/"+state)
  }
  return (
      <SidebarProvider>
      {/* <div className="min-h-screen bg-gray-50"> */}
        {/* <div className="flex"> */}
          <SidebarComponent activeItem={activeItem} onItemClick={onMenuClick} />
          <SidebarInset>
            <div className="flex-1">
              <Header />
              <main className="p-6">
                <Routes>
                  <Route path="/" element={<Navigate to="project/ACTIVE" />}></Route>
                  <Route path="/project" element={<Navigate to="../project/ACTIVE" />}></Route>
                  <Route path="project/:type" element={<Project />}></Route>
                  <Route path="board/:projectId/:type" element={<Board />}></Route>
                  <Route path="profile" element={<UserProfile></UserProfile>}></Route>
                  <Route path="list/:projectId/:boardId/:filterType" element={<ListContainer />}></Route>
                  <Route path="list/:projectId/:boardId/:listId/card/:cardId" element={<CardDetails />}></Route>
                  <Route path="search/:type/:searchText" element={<SearchResult />}></Route>
                  <Route path="report" element={<Report />}></Route>
                  <Route path="team" element={<TeamManagement/>}></Route>
                </Routes>
              </main>
            </div>
          </SidebarInset>
        {/* </div> */}
        {/* </div> */}
      </SidebarProvider>
    );
}
export default Dashboard;