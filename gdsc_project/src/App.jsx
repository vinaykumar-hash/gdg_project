import { useEffect, useState } from 'react'
import './App.css'
import Cards from './components/cards'

function App() {

  useEffect(()=>{
    if(localStorage.getItem("admin")==="true"){
      document.getElementById("adminBTN").textContent = "Logout";

    }
  },[localStorage.getItem("admin")])



  function login_clicked(){
    if(localStorage.getItem("admin") === "false"){
      let login_element = document.getElementById("login");
      login_element.classList.remove("hidden");
      login_element.classList.add("flex")
    }
    else{
      document.getElementById("adminBTN").textContent = "Admin";
      localStorage.setItem("admin","false");
      window.location.reload();
    }
    
  }

  function login(){
    let login_element = document.getElementById("LoginBTN");
    let login_id = document.getElementById("loginid").value;
    let login_pass = document.getElementById("loginpass").value;
    if(login_id === "admin" && login_pass === "admin"){
      let login_element = document.getElementById("login");
      login_element.classList.remove("flex");
      login_element.classList.add("hidden");
      localStorage.setItem("admin","true");
      window.location.reload();
    }
    else{
      alert("Wrong Creds")
      localStorage.setItem("admin","false");
    }
  }
  return (
    <>
      <div id='login' style={{zIndex:"999"}} className="bg-gray-400 absolute inset-0 hidden items-center justify-center font-fustat">
        <div className="bg-white p-6 rounded shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Admin Login</h3>
            <input type="text" placeholder="Login ID" name="" id="loginid" className="mb-4 p-2 border border-gray-300 rounded" />
            <input type="password" name="" id="loginpass" placeholder="Password" className="mb-4 p-2 border border-gray-300 rounded" />
            <button onClick={()=>login()} id='LoginBTN' className="bg-basecl-200 text-white p-2 rounded font-bold">Login</button>
        </div>
    </div>
      <div className='font-fustat font-bold text-basecl-200 flex justify-between w-full px-10 py-6'>
        <h1 className='text-4xl tracking-tighter'>Events</h1>
        <div className='  flex-grow mx-10'>
          <input className='bg-gray-300 rounded-lg w-full h-full outline-none px-4' placeholder='Search for Events' type="text" />
        </div>
        <button id='adminBTN' onClick={()=>login_clicked()} className='text-2xl font-bold bg-basecl-200 text-white px-10 py-2 rounded-lg '>Admin</button>
      </div>
      <Cards/>
    </>
  )
}

export default App
