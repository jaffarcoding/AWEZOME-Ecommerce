import React, { Fragment, useEffect } from 'react';
import { useRef , useState} from 'react';
import "./Loginsigup.css";
import profile  from "../../images/Profile.png"
import Loader from '../layout/loader/loader';
import { Link } from 'react-router-dom';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import {useSelector,useDispatch} from "react-redux";
import {clearErrors,login,register} from "../../actions/Useraction";
import {useAlert} from "react-alert";
const LoginSigup = ({history, location}) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const {loading, error,isAuthenticated} = useSelector((state)=> state.user);
    const loginTab = useRef(null);
    const registerTab= useRef(null);
    const switcherTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const {name, email, password} = user;

    const [avatar, setAvatar] =  useState();
    const [avatarPreview, setAvatarPreview] = useState(profile)
    const loginSubmit = (e) =>{
        e.preventDefault();
        dispatch(login(loginEmail,loginPassword))
    }

    const registerSubmit = (e)=>{
        e.preventDefault();
        const myform = new FormData();

        myform.set("name", name);
        myform.set("email", email);
        myform.set("password", password);
        myform.set("avatar", avatar);
        dispatch(register(myform))
    }

    const registerDataChange = (e) =>{
        if(e.target.name === "avatar"){
            const reader = new FileReader();
            reader.onload=()=>{
                if(reader.readyState ===2){
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }else{
            setUser({...user,[e.target.name]: e.target.value});
        }
    };  

    const redirect = location.search ? location.search.split("=")[1] : "/account";

    useEffect(() => {
       if(error){
        alert.error(error);
        dispatch(clearErrors());
       }
       if(isAuthenticated){
        history.push(redirect);
       }
    }, [dispatch,error,alert,history,isAuthenticated,redirect]);
    
    const SwitchTab = (e,tab)=>{
        if(tab=== "login"){
           switcherTab.current.classList.add("shiftToNeutral");
           switcherTab.current.classList.remove("shiftToRight");

           registerTab.current.classList.remove("shiftToNeutralForm");
           loginTab.current.classList.remove("shiftToLeft");
        }
        if(tab=== "register"){
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("ShiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    };
  return (
    <Fragment>
        {
            loading ?( <Loader/>):(
                <Fragment>
        <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
                <div>
                    <div className="login_sigup_toggle">
                        <p onClick={(e)=> SwitchTab(e,"login")}>LOGIN</p>
                        <p onClick={(e)=>
                        SwitchTab(e,"register")}>REGISTER</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>
                <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                    <div className='loginemail'>
                        <MailOutlineIcon/>
                        <input 
                        type="email"
                        placeholder='Email'
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                         />
                    </div>
                    <div className="loginPassword">
                        <LockOpenIcon/>
                        <input type="password"
                        placeholder='Password'
                        required
                        value={loginPassword}
                        onChange={(e)=> setLoginPassword(e.target.value)}
                         />
                    </div>
                    <Link to="/password/forgot">Forget Password</Link>
                    <input type="submit" 
                    value="Login"
                    className='loginBtn'
                    />
                </form>
                <form className='signUpForm' ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
                >
                    <div className="signUpName">
                        <FaceIcon/>
                        <input type="text"
                        placeholder='Name'
                        required
                        name='name'
                        value={name}
                        onChange={registerDataChange}
                         />
                    </div>
                    <div className="signUpEmail">
                        <MailOutlineIcon/>
                        <input type="email" 
                        placeholder='Email'
                        required
                        name='email'
                        value={email}
                        onChange={registerDataChange}
                        />
                    </div>
                    <div className="signUpPassword">
                        <LockOpenIcon/>
                        <input type="password" 
                        placeholder='Password'
                        required
                        name='password'
                        value={password}
                        onChange={registerDataChange}
                        />
                    </div>
                    <div id='registerImage'>
                        <img src={avatarPreview} alt="Avatar Preview" />
                        <input type="file"
                        name='avatar'
                        accept='image/*'
                        onChange={registerDataChange}
                         />
                    </div>
                    
                        <input type="submit"
                        value="Register"
                        className='sigUpBtn'
                        
                         />
                    
                </form>
            </div>
        </div>
    </Fragment>
            )
        }
    </Fragment>
  );
};

export default LoginSigup