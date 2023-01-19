import React, { Fragment,useEffect } from 'react'
import MetaData from '../layout/MetaData'
import {useSelector} from "react-redux";
import Loader from '../layout/loader/loader';
import { Link } from 'react-router-dom';
import "./profile.css"
const Profile = ({history}) => {
    const {user, loading,isAuthenticated}=useSelector((state)=> state.user);
    useEffect(()=>{
        if(isAuthenticated===false){
            history.push("/login");
        }
    },[history,isAuthenticated])
  return (
    <Fragment>
        {
            loading? (<Loader/>):(
                <Fragment>
                <MetaData title={user && user.name}/>
                 <div className="profilecontainer">
                    <div>
                        <h1>MY Profile</h1>
                        <img src={ user && user.avatar.url} alt={user.name} />
                        <Link to="/me/update">
                            Edit Profile
                        </Link>
                    </div>
                    <div>
                        <div>
                            <h4>Full Name</h4>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <h4>Email</h4>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <h4>Joined On</h4>
                            <p>{String(user.createdAt).substring(0,10)}</p>
                        </div>
                        <div>
                            <Link to="/orders">My Orders</Link>
                            <Link to="/password/update">Change Password</Link>
                        </div>
                    </div>
                 </div>
            </Fragment>
            )
        }
    </Fragment>
  )
}

export default Profile