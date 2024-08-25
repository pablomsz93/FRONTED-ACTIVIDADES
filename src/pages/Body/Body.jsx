import {Routes, Route, Navigate} from 'react-router-dom'
import { Home } from '../Home/Home'
import { Register } from '../Register/Register'
import { Login } from '../Login/Login'
import { Profile } from '../Profile/Profile'
import { Aquatic_Activities } from '../Aquatic Activity/Aquatic Activity'
import { Land_Activity } from '../Land Activity/Land Activity'
import { Activity } from '../Activity/Activity'
import { ActivityById } from '../ActivityById/ActivityById'
import { Appointment } from '../Appointment/Appointment'
import { Users } from '../Users/Users'


export const Body = () => {
    return (
        <>
        <Routes>
        <Route path='*' element={<Navigate to='/' />}/>
        <Route path='/' element={<Home />}/> 
        <Route path='/actividad' element={<Activity />}/> 
        <Route path='/registro' element={<Register />}/> 
        <Route path='/login' element={<Login />}/> 
        <Route path='/perfil' element={<Profile />}/>
        <Route path='/infor_actividad' element={<ActivityById />}/>
        <Route path='/actividad_acuatica' element={<Aquatic_Activities />}/> 
        <Route path='/actividad_terrestre' element={<Land_Activity />}/> 
        <Route path='/reservas' element={<Appointment />}/>
        <Route path='/usuarios' element={<Users />}/>

        </Routes>
        </>
    )
}