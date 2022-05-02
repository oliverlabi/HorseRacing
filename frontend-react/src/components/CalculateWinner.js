import { Context } from "../store";
import { useContext } from "react";

const CalculateWinner = () => {
    const [state, dispatch] = useContext(Context);

    console.log(state);
}

export default CalculateWinner;