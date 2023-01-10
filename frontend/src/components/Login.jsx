import { useState } from "react"
import { auth, db, signInWithGoogle } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useEffect } from 'react'
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 
import jwt_decode from "jwt-decode";
import { GoogleAuthProvider, sendEmailVerification  } from 'firebase/auth'


export default function Login(){

    const [err,setErr]=useState(false)
    const [sameNameErr,setSameNameErr]=useState(false)
    const [email,setEmail]=useState("")
    const [isLogIn, setIsLogIn]=useState(true)
    const [password,setPassword]=useState("")
    const [userName,setuserName]= useState("")
    const [missName,setMissName]=useState(false)
    const [missEmail,setMissEmail]=useState(false)
    const [missPass,setMissPass]=useState(false)
    const [miss,setMiss]=useState(false)
   
    const [loginEmailEmpty,setLoginEmailEmpty] = useState(false)
    const [loginPasswordEmpty,setLoginPasswordEmpty] = useState(false);

    const navigate=useNavigate()

    const {dispatch,users} = useContext(AuthContext)
     

    const handleRegister = async (e) =>{
        e.preventDefault()

        if(!users.includes(userName) && userName!="" && email!="" && password!=""){
            try {
                //check if email is already in database
                const res= await createUserWithEmailAndPassword(auth, email, password)
                await setDoc(doc(db, "users", res.user.uid), {
                    admin: false,
                    disable:false,
                    email: email,
                    name: userName
                });
                await sendEmailVerification(res.user);
              dispatch({type: "LOGIN", payload:res.user})
              navigate("/")
            } catch (e) {
                setErr(true)
              console.error("Error adding document: ", e);
            }
        } else if( userName=="" && email!="" && password!=""){setMissName(true);setMissEmail(false);setMissPass(false);setSameNameErr(false);setMiss(false)}
        else if(!users.includes(userName) && userName!="" && email=="" && password!=""){setMissName(false);setMissEmail(true);setMissPass(false);setSameNameErr(false);setMiss(false)}
        else if(!users.includes(userName) && userName!="" && email!="" && password==""){setMissName(false);setMissEmail(false);setMissPass(true);setSameNameErr(false);setMiss(false)}
        else if(users.includes(userName) && userName!="" && email!="" && password!=""){setMissName(false);setMissEmail(false);setMissPass(false);setSameNameErr(true);setMiss(false)}
        else {setMissName(false);setMissEmail(false);setMissPass(false);setSameNameErr(false);setMiss(true)}
    }

    const handleLogIn = (e) =>{
        e.preventDefault()

        if(!email){
            setLoginEmailEmpty(true);
        }
        if(!password){
            setLoginPasswordEmpty(true);
        }

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch({type: "LOGIN", payload:user})
          alert('Successful login!')
          navigate("/main")
        })
        .catch((error) => {
            setErr(true)
        });
    }

    const handleGoogleLogin = async(e) => {
        const response = await signInWithGoogle();
        dispatch({type: "LOGIN", payload:response})
        console.log(response) //start
        alert('Successful login!')
        navigate("/main") //end
    }

    return(
        <div className="login">
            { isLogIn ?      
            <div>      
                <form onSubmit={handleLogIn}>
                    <input type="email" placeholder="email" onChange={e => setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
                    <button type="submit">Login</button>
                    <div id="googleBtn"></div>
                    <div onClick={e => setIsLogIn(false)}>Register</div>
                    {err && <span>Wrong email or password</span>}
                    {loginEmailEmpty && <span>Email required</span>}
                    {loginPasswordEmpty && <span>Password required</span>}
                </form>
                <div>
                    <button onClick={e => handleGoogleLogin(e)}>Sign in with Google</button>
                </div>
            </div> :
            <form onSubmit={handleRegister}>
            <input  placeholder="user name" onChange={e => setuserName(e.target.value)}/>
             <input type="email" placeholder="email" onChange={e => setEmail(e.target.value)}/>
             <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
             <button type="submit">Register</button>
             <div onClick={e => setIsLogIn(true)}>Log in</div>
             {err && <span>Email already in use</span>}
             {sameNameErr && <span>User name already exist</span>}
             {missEmail && <span>Missing email</span>}
             {missName && <span>Missing username</span>}
             {missPass && <span>Missing Password</span>}
             {miss && <span>Missing more than 1 thing</span>}
            </form>
            }
        </div>
    )
}