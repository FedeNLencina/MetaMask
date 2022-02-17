import React, {useState} from 'react';
import {ethers} from 'ethers';
import '../styles/WalletCard.css';

const WalletCard = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
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
					{errorMessage}
			</div>
		</div>
	);
}

export default WalletCard;
