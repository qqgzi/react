import React,{Component} from 'react'

import {
Switch,Route,BrowserRouter} from 'react-router-dom'//引入路由


import Login  from './pages/login/login'
import Admin from './pages/admin/admin'
class App extends Component{
  
    render(){
      return (
        <BrowserRouter>
          <Switch>
         
            <Route path="/login" component={Login}/>
            <Route path="/"  component={Admin}/>
          </Switch>
        </BrowserRouter>
        )
    }
}


export default App;
