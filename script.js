const App = () => {
    const [breakTime, setBreakTime] = React.useState(5 * 60); // 5 minutes in seconds
    const [sessionTime, setSessionTime] = React.useState(25 * 60); // 25 minutes in seconds
    const [displayTime, setDisplayTime] = React.useState(25 * 60); // Initially set to the session time
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [intervalId, setIntervalId] = React.useState(null);

    const playBreakSound = () => {
        const beep = document.getElementById('beep');
        beep.currentTime = 0; // Restart sound
        beep.play();
    }

    const changeTime = (amount, type) => {
        if (type === 'break') {
            setBreakTime(prev => {
                const newTime = prev + amount;
                // Prevent the break time from going below 1 minute or above 60 minutes
                return newTime > 0 && newTime <= 3600 ? newTime : prev;
            });
        } else {
            setSessionTime(prev => {
                const newTime = prev + amount;
                // Prevent the session time from going below 1 minute or above 60 minutes
                if (newTime > 0 && newTime <= 3600) {
                    if (!timerOn) setDisplayTime(newTime);
                    return newTime;
                }
                return prev;
            });
        }
    }

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return (minutes < 10 ? `0${minutes}` : minutes) + ":" + (seconds < 10 ? `0${seconds}` : seconds);
    }

    const resetTime = () => {
        setBreakTime(5 * 60);
        setDisplayTime(25 * 60);
        setSessionTime(25 * 60);
        setTimerOn(false);
        setOnBreak(false);
        clearInterval(intervalId);
        setIntervalId(null);
        const beep = document.getElementById('beep');
        beep.pause(); // Stop audio
        beep.currentTime = 0; 
    }

    const controlTime = () => {
        if (!timerOn) {
            const interval = setInterval(() => {
                setDisplayTime(prev => {
                    if (prev === 0) {
                        playBreakSound();
                        setOnBreak(prevBreak => !prevBreak);
                        return !onBreak ? breakTime : sessionTime;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerOn(true);
            setIntervalId(interval);
        } else {
            clearInterval(intervalId);
            setTimerOn(false);
        }
    };

    React.useEffect(() => {
        return () => clearInterval(intervalId);
    }, [intervalId]);

    return (
        <div className="center-align">
            <h1>25+5 Clock</h1>
            <div className="dualcontainer">
                <div className="time-sets">
                    <h3 id="break-label">Break Length</h3>
                    <button id="break-decrement" className="btn-small deep-purple lighten-2"
                        onClick={() => changeTime(-60, "break")}>
                        <i className="material-icons">arrow_downward</i>
                    </button>
                    <span id="break-length">{Math.floor(breakTime / 60)}</span>
                    <button id="break-increment" className="btn-small deep-purple lighten-2"
                        onClick={() => changeTime(60, "break")}>
                        <i className="material-icons">arrow_upward</i>
                    </button>
                </div>
                <div className="time-sets">
                    <h3 id="session-label">Session Length</h3>
                    <button id="session-decrement" className="btn-small deep-purple lighten-2"
                        onClick={() => changeTime(-60, "session")}>
                        <i className="material-icons">arrow_downward</i>
                    </button>
                    <span id="session-length">{Math.floor(sessionTime / 60)}</span>
                    <button id="session-increment" className="btn-small deep-purple lighten-2"
                        onClick={() => changeTime(60, "session")}>
                        <i className="material-icons">arrow_upward</i>
                    </button>
                </div>
                <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
                <button id="start_stop" className="btn-small deep-purple lighten-2" onClick={controlTime}>
                    {timerOn ? (
                        <i className="material-icons">pause_circle_filled</i>
                    ) : (
                        <i className="material-icons">play_circle_filled</i>
                    )}
                </button>
                <span id="time-left">{formatTime(displayTime)}</span>
                <button id="reset" className="btn-small deep-purple lighten-2"
                    onClick={resetTime}>
                    <i className="material-icons">autorenew</i>
                </button>
            </div>
            <audio id="beep" src="Audio.mp3"></audio>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));