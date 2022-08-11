import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { useState, useEffect } from "react";
function App() {
  const [managerName, setManagerName] = useState("");
  const [playerList, setPlayerList] = useState([]);
  const [fund, setFund] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [message, setMessage] = useState("");

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
  const submitHandle = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("Hang on! the transaction is being proccessed!");
    console.log(typeof parseFloat(fund));
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(fund, "ether"),
    });
    setMessage("wooho! You have entered Successfully!!!");
  };
  const pickHandler = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Picking Winner! Hold on.");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    const winner = await lottery.methods.getWinner().call();
    setMessage("Winner picked: " + winner);
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
      <form onSubmit={submitHandle}>
        <h4>Want to try your Luck?</h4>
        <label>Amount(in ether): </label>
        <input
          type="number"
          value={inputAmount}
          onChange={handleChange}
        ></input>
        <button type="submit">Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a Winner?</h4>
      <button onClick={pickHandler}>Pick One</button>
      <hr />
      <h2>{message} </h2>
    </div>
  );
}

export default App;
