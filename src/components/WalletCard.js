import React, {useState} from 'react';
import {ethers} from 'ethers';
import '../styles/WalletCard.css';


const WalletCard = () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [blockNumber, setBlockNumber] = useState(0);
	
	async function connectToMetamask(){
		await provider.send("eth_requestAccounts", []);
		const signer = provider.getSigner();
		const account= await signer.getAddress();
		console.log("Account:", account);
		console.log('MetaMask Here!');
		accountChangedHandler(account);
		setConnButtonText('Wallet Connected');
		getAccountBalance(account);
		timerBalance(account);
		getBlockNumber();
		timerBlockNumber();
	 }


	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');
			connectToMetamask();
		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}
	
	const timerBalance = (account) =>{
		setInterval(getAccountBalance(account),10000);
	}
	

	const timerBlockNumber= () =>{
		setInterval(getBlockNumber,30000);
	}

	const getBlockNumber = () => {
			provider.getBlockNumber().then(function(blockNumber) {
				setBlockNumber(blockNumber);
				console.log("Current block number: " + blockNumber);
			});	
	};
	
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		provider.getBalance(account).then(function(balance) {
			var etherString = ethers.utils.formatEther(balance);
			setUserBalance(etherString);
			console.log("Balance: " + etherString);
		});
	};

	const chainChangedHandler = () => {
		window.location.reload();
	}

	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);
	
	return (
		<div className='d-flex justify-content-center'>
			<div className='d-flex flex-column align-items-center py-3 my-5 wallet'>
				<h3 className='my-3'>To connect with MetaMask press the button below.</h3>
					<button className='my-3 buttonSubmit' onClick={connectWalletHandler}>{connButtonText}</button>
					<div className='accountDisplay my-3'>
						<h4>Address: {defaultAccount}</h4>
					</div>
					<div className='balanceDisplay my-3'>
						<h4>Balance: {userBalance}</h4>
					</div>
					<div className='balanceDisplay my-3'>
						<h4>BlockNumber: {blockNumber}</h4>
					</div>
					{errorMessage}
			</div>
		</div>
	);
}

export default WalletCard;
