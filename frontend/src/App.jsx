import { useState } from 'react'
import Login from './components/Login'
import {Routes, Route, Navigate, UNSAFE_NavigationContext} from 'react-router-dom'
import Main from './components/Main'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Unauth from './components/Unauth'
import UserList from './components/admin/UserList'
import PrivateList from './components/playlist/PrivateList'
import ListShow from './components/playlist/ListShow'
import CreateList from './components/playlist/CreateList'
import CreateReview from './components/playlist/CreateReview'
import ChangePass from './components/ChangePass'
import LogsDMCA from './components/LogsDMCA'
import AdminWin from './components/admin/AdminWin'


function App() {
  const [count, setCount] = useState(0)
  const {currentUser}=useContext(AuthContext)


  const RequireAuth= ({children}) => {
    return currentUser ? (children) : <Navigate to='/' />;
  }

  return (
    <div >
      <Routes>
        <Route path='/'>
          <Route path='login' element={<Login />} />
          <Route index element={<Unauth />}></Route>          
          <Route 
            path='main' 
            element={
            <RequireAuth>
              <Main />
            </RequireAuth>
          }>
          </Route>
          <Route path='admin' element={<AdminWin />}/>
          <Route path='main/user/list/private' element={<PrivateList />}/>
          <Route path='main/user/list/private/create' element={<CreateList/>}/>
          <Route path='main/user/list' element={<ListShow />}/>
          <Route path='main/create-review' element={<CreateReview />}/>
          <Route path='main/change-password' element={<ChangePass />}/>
          <Route path='admin/logs-dmca' element={<LogsDMCA />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
