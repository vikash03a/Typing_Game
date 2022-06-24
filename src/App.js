import React, { Component } from "react";
import "./styles.css";

class App extends Component {
  state = {
    text: "",
    inputValue: "",
    lastLetter: "",
    words: [],
    completedWords: [],
    completed: false,
    startTime: undefined,
    timeElapsed: 0,
    wpm: 0,
    started: false,
    progress: 0
  };

  setText = () => {
    const texts = [
      `You never read a book on psychology.`,
      `I know more about the private lives.`,
      `A spider's body consists of two main .`,
      `As customers of all races, nationalities existence.`,
      `Outside of two men on a train platform there's nothing in sight.`,
      `I'm a broke-nose fighter. I'm a loose-lipped liar. Searching.`
    ];
    const text = texts[Math.floor(Math.random() * texts.length)];
    const words = text.split(" ");

    this.setState({
      text: text,
      words: words,
      completedWords: []
    });
  };

  startGame = () => {
    this.setText();

    this.setState({
      started: true,
      startTime: Date.now(),
      completed: false,
      progress: 0
    });
  };

  handleChange = (e) => {
    const { words, completedWords } = this.state;
    const inputValue = e.target.value;
    const lastLetter = inputValue[inputValue.length - 1];

    const currentWord = words[0];

    if (lastLetter === " " || lastLetter === ".") {
      if (inputValue.trim() === currentWord) {
        const newWords = [...words.slice(1)];
        const newCompletedWords = [...completedWords, currentWord];

        const progress =
          (newCompletedWords.length /
            (newWords.length + newCompletedWords.length)) *
          100;
        this.setState({
          words: newWords,
          completedWords: newCompletedWords,
          inputValue: "",
          completed: newWords.length === 0,
          progress: progress
        });
      }
    } else {
      this.setState({
        inputValue: inputValue,
        lastLetter: lastLetter
      });
    }

    this.calculateWPM();
  };

  calculateWPM = () => {
    const { startTime, completedWords } = this.state;
    const now = Date.now();
    const diff = (now - startTime) / 1000 / 60;

    const wordsTyped = Math.ceil(
      completedWords.reduce((acc, word) => (acc += word.length), 0) / 5
    );

    const wpm = Math.ceil(wordsTyped / diff);

    this.setState({
      wpm: wpm,
      timeElapsed: diff
    });
  };

  render() {
    const {
      text,
      inputValue,
      completedWords,
      wpm,
      timeElapsed,
      started,
      completed,
      progress
    } = this.state;

    if (!started)
      return (
        <div className="container">
          <h2 className="type">Type The Alphabet</h2>
          <p className="type">
            Typing game to see how fast you type.Timer starts when you do :)
          </p>
          <div className="box">
            <h2>Q</h2>
          </div>
          <div>
            <h4>Time 0.000s</h4>
          </div>
          <div>
            <p>My Best Time 1.20s!</p>
          </div>
          <div>
            <button className="btn">Reset</button>
          </div>

          <button className="start-btn" onClick={this.startGame}>
            Start game
          </button>
          <p className="name">
            <i>Developed By Vikash</i>
          </p>
        </div>
      );

    if (!text) return <p>Loading...</p>;

    if (completed) {
      return (
        <div className="container">
          <h2>
            <p className="success">Success!</p>
            <strong>WPA :{wpm}</strong>
          </h2>
          <p>My Best Time 1.20s!</p>
          <button className="start-btn" onClick={this.startGame}>
            Play again
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="wpm">
          <strong>WPM: </strong>
          {wpm}
          <br />
          <strong>Time: </strong>
          {Math.floor(timeElapsed * 60)}s
        </div>
        <div className="container">
          <h4>Type the text below</h4>
          <progress value={progress} max="100" />
          <p className="text">
            {text.split(" ").map((word, w_idx) => {
              let highlight = false;
              let currentWord = false;

              if (completedWords.length > w_idx) {
                highlight = true;
              }

              if (completedWords.length === w_idx) {
                currentWord = true;
              }

              return (
                <span
                  className={`word 
                                ${highlight && "green"} 
                                ${currentWord && "underline"}`}
                  key={w_idx}
                >
                  {word.split("").map((letter, l_idx) => {
                    const isCurrentWord = w_idx === completedWords.length;
                    const isWronglyTyped = letter !== inputValue[l_idx];
                    const shouldBeHighlighted = l_idx < inputValue.length;

                    return (
                      <span
                        className={`letter ${
                          isCurrentWord && shouldBeHighlighted
                            ? isWronglyTyped
                              ? "red"
                              : "green"
                            : ""
                        }`}
                        key={l_idx}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </p>
          <input
            type="text"
            onChange={this.handleChange}
            value={inputValue}
            autoFocus={true}
          />
        </div>
      </div>
    );
  }
}

export default App;
