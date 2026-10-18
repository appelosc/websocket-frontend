import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../api/login.ts";
import { refreshUser } from "../api/refresh.ts";
import { clearSession } from "../api/session.ts";
import "../styling/Login.css";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking,setChecking] = useState(true)
  const navigate = useNavigate();

  useEffect(() =>{
    const tryRefresh = async () =>{
      const refreshToken = localStorage.getItem('refreshtoken')
      if(!refreshToken){
        setChecking(false)
        return
      }
      try {
        const {token} = await refreshUser();
        localStorage.setItem('token',token)
        navigate('/pastebin')
      } catch  {
        clearSession()
        setError('Session expired')
        setChecking(false)
      }
    }
    tryRefresh()
  },[navigate]) 

  if (checking) return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token , refresh} = await loginUser({ username, password });
      localStorage.setItem("token", token)
      localStorage.setItem("refreshtoken", refresh)
      navigate("/pastebin")
    } catch {
      setError("Couldn't sign in. Check your username and password, then try again.")
    } finally {
      setLoading(false)
    }
  };

  return (
    <main className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Sign in</h1>
        <p className="login-intro">
          Anything you type in the pastebin shows up on every connected screen
          as you type it.
        </p>

        <label className="login-field">
          <span>Username</span>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="login-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <figure className="login-echo" aria-hidden="true">
        <div className="login-sheet">
          {username ? (
            <span className="login-echo-text">
              {username}
              <span className="login-caret" />
            </span>
          ) : (
            <span className="login-echo-empty">
              Type your username to see it here
            </span>
          )}
        </div>
        <figcaption>
          In the pastebin, other screens see your text like this, live.
        </figcaption>
      </figure>
    </main>
  );
}

export default Login;
