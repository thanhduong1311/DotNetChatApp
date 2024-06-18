import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBInputGroup, MDBRow } from "mdb-react-ui-kit";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

const inter = Inter({ subsets: ["latin"] });

type MessageType = {
   user: string,
      message:string
      time:string
}

export default function Home() {

  var connection = new HubConnectionBuilder().withUrl("https://8c87-14-160-176-136.ngrok-free.app/chatHub").build();

const [newMessage, setNewMessage] = useState<MessageType>({user: "",message:"",time:""});
const [username, setUsername] = useState('');
const [message, setMessage] = useState('');
const [mesageList, setMessageList] = useState<MessageType[]>([]);

connection.on("ReceiveMessage", function (data) {
    const item = {
      user: data.username,
      message:data.content,
      time:data.timestamp
    }

    setNewMessage(item);
});

 useEffect(() => {
  const value = mesageList?.filter(x => x?.time?.toString() === newMessage?.time?.toString())
  if(value.length !== 1)
    setMessageList([...mesageList,newMessage])
 }, [newMessage])

connection.start().then(function () {
  console.log("OK")
}).catch(function (err) {
     return console.error(err.toString());
});

const SendMessage = () => {
    connection.invoke("SendMessage",username,message).catch(function (err) {
    })
    setMessage('');  
}


  return (
    <>
      <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
        <MDBRow className="d-flex justify-content-center">
          <MDBCol md="8" lg="6" xl="4">
            <MDBCard>
                   <input
                    className="form-control"
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={e=> setUsername(e.target.value)}
                  />
              <MDBCardHeader
                className="d-flex justify-content-between align-items-center p-3"
                style={{ borderTop: "4px solid #ffa900" }}
              >
              
                <h5 className="mb-0">Chat messages</h5>
                <div className="d-flex flex-row align-items-center">
                  <span className="badge bg-warning me-3"></span>
                  <MDBIcon
                    fas
                    icon="minus"
                    size="xs"
                    className="me-3 text-muted"
                  />
                  <MDBIcon
                    fas
                    icon="comments"
                    size="xs"
                    className="me-3 text-muted"
                  />
                  <MDBIcon
                    fas
                    icon="times"
                    size="xs"
                    className="me-3 text-muted"
                  />
                </div>
              </MDBCardHeader>
              <div
                style={{ position: "relative", height: "400px", overflowY:"scroll" }}
              >
                <MDBCardBody>
                 {
                  mesageList.map((item, index) => (
                   <div key={index} >
                   <p ><b>{item.user}</b></p >
                   <p className="border border-1 p-2">{item.message}</p>
                   <br/>
    </div>
  ))
}
                  
                </MDBCardBody>
              </div>
              <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                <MDBInputGroup className="mb-0">
                
                   <input
                    className="form-control"
                    placeholder="Type message"
                    type="text"
                    value={message}
                    onChange={e=> setMessage(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={SendMessage} color="warning" style={{ paddingTop: ".55rem" }}>
                    Button
                  </button>
                </MDBInputGroup>
              </MDBCardFooter>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
   </>
  );
}
