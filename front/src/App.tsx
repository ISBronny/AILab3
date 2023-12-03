import React, {useState} from 'react';
import './App.css';
import {stat} from "fs";

function App() {
    const [state, setState] = useState({
        status: "none",
        theme: "",
        annotation: "",
        conclusion: ""
    });

    return (
        <div className="container mx-auto">
            <h1 className="text-center text-5xl">КНИР по теме:</h1>
            <div>
                <input type="text"
                       id="first_name"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
               focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                dark:focus:border-blue-500"
                       placeholder="Использование нейронных сетей для генерации изображений"
                       required onChange={(event) => setState({...state, theme: event.currentTarget.value})}/>
            </div>
            <button type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
          focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5
          text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                        setState({...state, status: "loading"})
                        fetch(`http://localhost:8000/api/generate?text=${state.theme}`)
                            .then(data => data.json())
                            .then(data => setState({
                                ...state,
                                status: "loaded",
                                annotation: data.annotation,
                                conclusion: data.conclusion
                            }))
                            .catch(data => {
                                console.error(data);
                                setState({...state, status: "none"})
                            })
                        ;
                    }}
            >
                Сгенерировать
            </button>

            {state.status === "none" ? (
                <></>
            ) : (state.status === "loading" ? (<>
                <h1 className="text-center text-3xl">Аннотация:</h1>

                <div>
                    <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>

                <h1 className="text-center text-3xl">Введение:</h1>

                <div>
                    <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>

            </>): <>
                <h1 className="text-center text-3xl">Аннотация:</h1>

                <div>
                    {state.annotation}
                </div>

                <h1 className="text-center text-3xl">Вывод:</h1>

                <div>
                    {state.conclusion}
                </div>
            </>)}

        </div>
    );
}

export default App;
