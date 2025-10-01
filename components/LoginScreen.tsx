import React, { useState, useEffect } from 'react';
import { ACCESS_CODE } from '../config';

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => {
            // Clean up class if needed, though App component will manage it
        }
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (code === ACCESS_CODE) {
            setError('');
            onLoginSuccess();
        } else {
            setError('Неверный код доступа');
        }
    };

    return (
        <div className="container min-h-screen flex justify-center items-center p-4">
          <form className="form w-full max-w-sm" onSubmit={handleSubmit}>
            <p className="title">Вход в анкету</p>
            <p className="text-sm text-center text-gray-400 mb-8 -mt-8">Введите код доступа, предоставленный дизайнером</p>

            <input 
                placeholder="Код доступа" 
                className="input" 
                type="password"
                value={code}
                onChange={(e) => {
                    setCode(e.target.value);
                    if (error) setError('');
                }}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button className="btn" type="submit">Войти</button>
          </form>

          {/* FIX: Removed unsupported 'jsx' prop from style tag to resolve TypeScript error. */}
          <style>{`
            .container {
              margin: 0 auto;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .form {
              background-image: linear-gradient(to bottom, #424242, #212121);
              display: flex;
              align-items: center;
              flex-direction: column;
              padding: 2rem;
              border-radius: 0.5rem;
            }

            .title {
              color: wheat;
              margin: 1.5rem 0;
              font-size: 2rem;
            }

            .input {
              margin: 0.5rem 0;
              padding: 1rem 0.5rem;
              width: 100%;
              background-color: inherit;
              color: wheat;
              border: none;
              outline: none;
              border-bottom: 1px solid wheat;
              transition: all 400ms;
              text-align: center;
              font-size: 1.2rem;
            }
            .input:hover {
              background-color: #424242;
              border: none;
              border-radius: 0.5rem;
            }
            .btn {
              height: 3rem;
              width: 100%;
              margin-top: 2.5rem;
              background-color: wheat;
              border-radius: 0.5rem;
              border: none;
              font-size: 1.2rem;
              transition: all 400ms;
              cursor: pointer;
              box-shadow:
                0 0 10px antiquewhite,
                0 0 10px antiquewhite;
            }
            .btn:hover {
              background-color: antiquewhite;
              box-shadow: none;
            }
          `}</style>
        </div>
    );
};