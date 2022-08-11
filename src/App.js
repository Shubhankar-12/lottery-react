import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { useState, useEffect } from "react";
function App() {
  const [managerName, setManagerName] = useState("");
  const [playerList, setPlayerList] = useState([]);
  const [fund, setFund] = useState("");
  const [inputAmount, setInputAmount] = useState("");

  useEffect(() => {
    const fetchManger = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setManagerName(manager);
      setPlayerList(players);
      setFund(balance);
    };
    fetchManger();
  }, []);

  const handleChange = (e) => {
    setInputAmount(e.target.value);
  };

  return (
    <div className="App">
      <h1>Lottery Contract</h1>
      <p>
        This Lottery is managed by {managerName}. There are {playerList.length}{" "}
        people entered, competing to win {web3.utils.fromWei(fund, "ether")}{" "}
        ether.
      </p>
      <hr />
      <form>
        <h4>Want to try your Luck?</h4>
        <label>Amount(in ether): </label>
        <input
          type="number"
          value={inputAmount}
          onChange={handleChange}
        ></input>
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}

export default App;
