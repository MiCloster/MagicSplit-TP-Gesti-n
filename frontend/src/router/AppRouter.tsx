import { Routes, Route, Navigate} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import { Grupos } from "../pages/Grupos";
import { Grupo } from "../pages/grupo/[id]";
import { Historial } from "../pages/Historial";
  
  export const AppRouter = () => {
    return (
      <Routes>

        {/*RUTAS PUBLICAS  */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element = {<Login/>} />


        {/* RUTAS PROTEGIDAS */}
        <Route path="/grupos" element={<ProtectedRoute />}>
          <Route path="/grupos" element = {<Grupos/>} />
        </Route>
        <Route path="/grupo" element={<ProtectedRoute />}>
          <Route path="/grupo/:id" element={<Grupo />} />
        </Route>
        <Route path="/historial" element={<ProtectedRoute />}>
          <Route path="/historial" element = {<Historial/>} />
        </Route>

        <Route path="/" element = {<Navigate to="/signup" />} />
        <Route path="/*" element = { <Navigate to="/signup" />} />
    </Routes>
    )
  }
  