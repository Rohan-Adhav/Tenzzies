import Die from "/components/Die"
import { nanoid } from "nanoid"
import { useState, useRef, useEffect } from "react"
import Confetti from "react-confetti"

export default function App() {


  const [dice, setDice] = useState(() => generateAllNewDice())

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)
  const buttonRef = useRef(null)
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
    }
  }, [gameWon])
  function generateAllNewDice() {
    return new Array(10)
      .fill(0)
      .map(() => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      }))
  }

  function hold(id) {
    setDice(oldDice => oldDice.map((die) => {
      return id == die.id ? { ...die, isHeld: !die.isHeld } : die
    }))
  }

  const diceElements = dice.map(obj => <Die
    isHeld={obj.isHeld}
    key={obj.id}
    value={obj.value}
    hold={() => hold(obj.id)} />)


  function roll_die() {
    if (!gameWon) {
      setDice(oldDice => oldDice.map(die =>
        die.isHeld ?
          die :
          { ...die, value: Math.ceil(Math.random() * 6) }
      ))
    }
    else {
      setDice(generateAllNewDice())
    }
  }

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button ref={buttonRef} onClick={roll_die} className="roll-dice">
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  )
}