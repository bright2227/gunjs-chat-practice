import { useEffect, useState } from 'react'
import "./App.css"
import Gun from 'gun'

const gun = Gun({
  peers: [
    'http://localhost:8000/gun'
  ]
})


export default function App() {
  const [inputState, setForm] = useState({name: '', message: ''})
  const [msgstate, setState] = useState([])

  useEffect(() => {

    console.log("on eff");

    const st = Date.now();

    gun.get('messages').on(m => {
      if ( (!Boolean(m) )||(m.createdAt < st) ){
        return
      }
      const msg = {
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      };
      setState(
        (msgstate)=>{
          console.log("set")
          console.log({msgstate})
          return [msg, ...msgstate]
        }
      )
    })
  }, [])

  function saveMessage() {
    if(inputState.message.length===0 || inputState.name.length ===0){
      return
    }
    gun.get('messages').put({
      name: inputState.name,
      message: inputState.message,
      createdAt: Date.now()
    })

    setForm({
      name: '', message: ''
    })
  }

  function onChange(e) {
    setForm({ ...inputState, [e.target.name]: e.target.value  })
  }

  return (
    <div className='container'>
      <h1 className='head'>GunJS Chatting</h1>

      {
        msgstate.map(message => (
          <div className="message" key={message.createdAt}>
            <h2 className="content">{message.message}</h2>
            <h4 className="from">From: {message.name}</h4>
          </div>
        ))
      }

      <div className='inputs'>
        <input onChange={onChange} placeholder="Name" name="name" value={inputState.name}/>
        <input onChange={onChange} placeholder="Message" name="message" value={inputState.message} />
        <button onClick={saveMessage}> Send Message</button>
      </div>
    </div>
  );
}