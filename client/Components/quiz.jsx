import React, { useState, useEffect, useRef } from 'react';
import './Quiz.css';
import { data } from '../data';
import { toast } from 'react-toastify';

import { useLocation } from 'react-router-dom';

const Quiz = () => {
  const location = useLocation();
  let {email} = location.state || {};
  console.log(email);
  let [index, setIndex] = useState(0);
  let [question, setQuestion] = useState(data[index]);
  let [lock, setLock] = useState(false);
  let [score, setScore] = useState(0);
  let [timeLeft, setTimeLeft] = useState(10); 
  let [totalTimeTaken, setTotalTimeTaken] = useState(0); 
  let [completed, setCompleted] = useState(false);

  let Option1 = useRef(null);
  let Option2 = useRef(null);
  let Option3 = useRef(null);
  let Option4 = useRef(null);

  let option_array = [Option1, Option2, Option3, Option4];

  useEffect(() => {
    if (timeLeft === 0 && !lock) {
      setLock(true);
      option_array[question.ans - 1].current.classList.add('correct');
    }

    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
        setTotalTimeTaken((prev) => prev + 1); 
      } else if (!lock) {
        setLock(true);
      } else if (index < data.length - 1) {
        next();
      } else {
        setCompleted(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, lock, index]);

  const checkAns = (e, ans) => {
    if (lock === false) {
      if (question.ans === ans) {
        e.target.classList.add('correct');
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add('incorrect');
        option_array[question.ans - 1].current.classList.add('correct');
      }
      setLock(true);
    }
  };

  const next = () => {
    if (lock === true && index < data.length - 1) {
      setIndex((prev) => prev + 1);
      setQuestion(data[index + 1]);
      setLock(false);
      setTimeLeft(10);
      option_array.forEach((option) => option.current.classList.remove('correct', 'incorrect'));
    }
  };

  const saveScore = async()=>{
    try {
      const response = await fetch("http://localhost:7000/api/v1/user/setScore",{
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email,
          score
        })
      })
      if(response.ok){
        toast.success("Success");
      }
      else{
        toast.error("Cannot send your score")
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.log("Error", error)
    }
  }

  if (completed) {

    saveScore();

    return (
      <div className="result">
        <div className='cdn'><i class="fa-solid fa-check "></i></div>
        <h1>Quiz Completed</h1>
        <p>Your Score: {score}/{data.length}</p>
        <p>Total Time Taken: {totalTimeTaken} seconds</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Quiz</h1>
      <hr />
      <div className="timer">Time Left to Answer: {timeLeft} sec</div>
      <h2>{index + 1}. {question.question}</h2>
      <ul>
        <li ref={Option1} onClick={(e) => checkAns(e, 1)}>{question.option1}</li>
        <li ref={Option2} onClick={(e) => checkAns(e, 2)}>{question.option2}</li>
        <li ref={Option3} onClick={(e) => checkAns(e, 3)}>{question.option3}</li>
        <li ref={Option4} onClick={(e) => checkAns(e, 4)}>{question.option4}</li>
      </ul>
      <div className="btns">
        <button onClick={next} className='btn ri' disabled={!lock}>Next</button>
      </div>
      <div className="index">{index + 1} of {data.length} Questions</div>
    </div>
  );
};

export default Quiz;