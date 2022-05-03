import BackendUrl from "./BackendUrl";
import ErrorMessage from "./messages/ErrorMessage";

const CalculateWinner = (raceID, horses) => {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    var winningHorse = horses[getRandomInt(horses.length)];

    const winner = {
        horse: winningHorse
    }

    fetch(BackendUrl + 'api/race/addWinningHorse/' + raceID,{
        method: "PUT",
        body: JSON.stringify(winner),
        headers: {"Content-Type":"application/json"}
    }).catch(error => {
        ErrorMessage(error);
    });
}

export default CalculateWinner;