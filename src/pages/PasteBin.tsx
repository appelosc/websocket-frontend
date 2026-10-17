import { useEffect, useState } from "react";
import {socket} from "../api/connection.ts"
import type { Status } from "../types/status.ts";
import "../styling/PasteBin.css";

function PasteBin (){
    const statusText: Record<Status, string> = {
        green: "Connected",
        yellow: "Connecting…",
        red: "Not connected",
    };
    const [received,setReceived] = useState("");
    const [status,setStatus] = useState<Status>(socket.connected ? 'green' : 'yellow');
    const [attempt,setAttempt] = useState(0);
    useEffect(() => {
        socket.connect()
        const onConnect = () => setStatus('green');
        const onDisconnect = () => setStatus(socket.active? 'yellow': 'red');
        const reConnect = () => setStatus('yellow');
        const reConnectFailed = () => setStatus('red');
        const onConnectError = () => setStatus(socket.active ? 'yellow' : 'red');

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.io.on('reconnect_attempt', reConnect);
        socket.io.on('reconnect_failed',reConnectFailed);
        socket.on('connect_error', onConnectError);

        const onMessage = (text:string) => setReceived(text)
        socket.on('message',onMessage)

        return () =>{
            socket.off('message',onMessage)
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.io.off('reconnect_attempt', reConnect);
            socket.io.off('reconnect_failed', reConnectFailed);
            socket.off('connect_error', onConnectError);
        }
    },[attempt])

    const handleReconnect = () =>{
        setStatus('yellow')
        setAttempt((n) => n + 1)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
        const value = e.target.value
        socket.emit('message',value)
    }

    return (
    <main className="paste">
        <header className="paste-header">
            <h1 className="paste-title">Pastebin</h1>
            <p className="paste-intro">
                Type on the left. Every connected screen sees it as you type.
            </p>
            <div className="paste-status" role="status">
                <span className={`paste-light paste-light--${status}`} aria-hidden="true" />
                <span>{statusText[status]}</span>
                {status === 'red' && (
                    <button className="paste-reconnect" type="button" onClick={handleReconnect}>
                        Reconnect
                    </button>
                )}
            </div>
        </header>

        <label className="paste-field">
            <span>Your text</span>
            <textarea
                className="paste-input"
                onChange={handleChange}
                spellCheck={false}
                placeholder="Start typing…"
            />
        </label>

        <section className="paste-echo" aria-live="polite">
            <h2 className="paste-label">From other screens</h2>
            <div className="paste-sheet">
                {received ? (
                    <p className="paste-received">{received}</p>
                ) : (
                    <p className="paste-empty">
                        Nothing yet. Text typed on another screen appears here.
                    </p>
                )}
            </div>
        </section>
    </main>

    );
}
    


export default PasteBin
