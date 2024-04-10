import React, { useEffect, useState } from "react";
//TODO: to local speech recognition without internet
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import Dictaphone from "../../Dictaphone";
import "./RobotUI.css";
import { FaMicrophone } from "react-icons/fa";
import Keyboard from "../Keyboard/Keyboard";
import Header from "../Header/Header";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { setBook } from "../../store/Books";

const RobotUI = () => {
    const [searchTerm, setSearchTerm] = useState("");
	const [inputText, setInputText] = useState(''); 

    const [isKeyboardVisible, setKeyboardVisible] = useState(true);
    const [voiceSearchTerm, setVoiceSearchTerm] = useState("");
    const [recommededBooks, setRecommededBooks] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleButtonClick = (buttonLabel) => {
        console.log(`Button ${buttonLabel} clicked`);
    };

    const handleSearchClick = () => {
        setKeyboardVisible(true);
    };

    
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const onClickHandlerSetVoiceInput = () => {
        setVoiceSearchTerm(transcript);
    };
    useEffect(() => {
        setSearchTerm(voiceSearchTerm);
    }, [voiceSearchTerm]);
    useEffect(()=>{
        setInputText(transcript)
    }, [listening])

    const onClickHandlerMic = () => SpeechRecognition.startListening;
    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    function handleDescription(book) {
        dispatch(setBook(book));
        navigate("/Description")
      }

    function handleSubmit(event) {
        SpeechRecognition.stopListening();
        console.log("submit clicked", inputText, searchTerm);
        setRecommededBooks([]);
        // setSearchTerm("");
        // event.preventDefault();

        console.log(searchTerm);
    
        // Make an HTTP POST request to your Flask API
        fetch("http://127.0.0.1:5000/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: inputText }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            
            // Use speech synthesis to speak the result
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(
                "Here are your results from Libro"
            );
            synth.speak(utterance);
            setRecommededBooks(data);
            setShowTable(true);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

    return (
        <div className="robot-screen">
            {/* <Dictaphone /> */}
            <Header />
            {listening ? (
                <p className="pgreen">Currently Speaking: {transcript}</p>
            ) : (
                <></>
            )}
            <div className="button-row">
                <button
                    className="button"
                    onClick={() => handleButtonClick("Button 1")}
                >
                    Home
                </button>
                <button
                    className="button"
                    onClick={() => handleButtonClick("Button 2")}
                >
                    Tutorial
                </button>
                <button
                    className="button"
                    onClick={() => handleButtonClick("Button 3")}
                >
                    Books
                </button>
            </div>
            <div className="search-bar">
                <FaMicrophone
                    onClick={SpeechRecognition.startListening}
                    className="voice-icon"
                />
                <button
                    className="btngood"
                    onClick={() => {
                        onClickHandlerSetVoiceInput();
                    }}
                >
                    <button
                        className="button_1"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </button>
                <button className="button_1" onClick={() => {
                    setInputText("");
                    setShowTable(false);
                    resetTranscript();
                }}>
                    Reset
                </button>
            </div>
            <Keyboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearchClick={handleSearchClick} setInputText={setInputText} inputText={inputText} />

            {showTable ? (<table class="content-table">
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Issued</th>
                        <th>Shelf No</th>
                        <th>Section</th>
                    </tr>
                </thead>
                {recommededBooks.length === 0 ? (
                    <></>
                ) : (
                    recommededBooks.map((book) => {
                        return (
                            <>
                                <tbody>
                    
                                    <tr onClick={(e) => handleDescription(book)}>
                                        <td>{book["Title"]}</td>
                                        <td>{book["Authors"]}</td>
                                        <td>{book["Issued"] ? "True" : "False"}</td>
                                        <td>{book["shelf_no"] }</td>
                                        <td>{book["section"] }</td>
                                    </tr>
                    
                                </tbody>
                            </>
                        );
                    })
                )}
            </table>) : <></>}
        </div>
    );
};

export default RobotUI;
