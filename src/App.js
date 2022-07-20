// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

//data
import { wordsList } from './data/words';

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]
const guessesQtd = 3;



function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([""]);
  const [wrongLetters, setWrongLetters] = useState([""]);
  const [guesses, setGuesses] = useState(guessesQtd);
  const [score, setScore] = useState(0);
  
 
  const pickWordAndCategory = useCallback(() => {
    //random category
    const categories = Object.keys(words);
    const category = 
    categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { category, word };
  }, [words]);

  // start game
  const startGame = useCallback(() => {
    clearLetterStates();
    // pick word and pick category
    const { category, word } = pickWordAndCategory();
    // array letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    // fill states
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //process letter

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    // check already been utilized

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //push guessed letter or remove chance
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const retry = () => {
    setScore(0);
    setGuesses(guessesQtd);
    setGameStage(stages[0].name);
   }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
  //lose condition
  useEffect(() => {
    if (guesses === 0) {
      //reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses])

  //win condition
  useEffect(() => {

    const uniqueLetters =[...new Set(letters)];
    
    
    if(guessedLetters.length === uniqueLetters.length) {
      //add score
      
      setScore((actualScore) => actualScore += 100);
      setGuesses(guessesQtd);
      startGame();
      //resetar new word
      
      
    }

  }, [guessedLetters, letters, startGame])

 // restart game
 


  return (
    <div className="App">
      
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && 
      (<Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
