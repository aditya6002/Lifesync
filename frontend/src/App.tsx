import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context";

// import { useState } from "react";
import GlobalStyles from "./styles/GlobalStyles";

// import LandingPage from "./pages/LandingPage";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import AppPage from "./pages/AppPage";

const App = () => {
  return (
    <AuthProvider>
      <GlobalStyles />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;

// // Pages: "landing" | "login" | "signup" | "app"
// export default function App() {
//   const [page, setPage] = useState("landing");
//   const [user, setUser] = useState(null);

//   const handleLogin  = (userData) => { setUser(userData); setPage("app"); };
//   const handleLogout = ()         => { setUser(null);     setPage("landing"); };

//   return (
//     <>
//       <GlobalStyles />

//       {page === "landing" && (
//         <LandingPage
//           onLogin={()=>setPage("login")}
//           onSignup={()=>setPage("signup")}
//         />
//       )}

//       {page === "login" && (
//         <LoginPage
//           onLogin={handleLogin}
//           onGoSignup={()=>setPage("signup")}
//           onBack={()=>setPage("landing")}
//         />
//       )}

//       {page === "signup" && (
//         <SignupPage
//           onSignup={handleLogin}
//           onGoLogin={()=>setPage("login")}
//           onBack={()=>setPage("landing")}
//         />
//       )}

//       {page === "app" && user && (
//         <AppPage
//           user={user}
//           onLogout={handleLogout}
//         />
//       )}
//     </>
//   );
// }
