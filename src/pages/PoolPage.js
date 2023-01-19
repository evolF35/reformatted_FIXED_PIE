import React, {useState} from 'react'
import {ethers} from 'ethers'
import deployABI from '../utils/Deploy.json'
import claimABI from '../utils/Claim.json'
import poolABI from '../utils/Pool.json'

const PoolJS = () => {
	let contractAddress = '0xFf408125bf10064a4518f9aDa10b0E2124FAA807';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [tb, setTb] = useState(null);
	const [tb2,setTb2] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
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
		updateEthers();
	}

	const chainChangedHandler = () => {
		window.location.reload();
	}

	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, deployABI, tempSigner);
		setContract(tempContract);	
        console.log("contract set");
	}
	
    const getEvents = async () => {

		const tb = await contract.queryFilter("*");
		setTb(tb);

		let z = poolInfo(tb[0].args[8]);
		console.log(z);

		console.log(tb[0].args[8]);

		const modifiedTb = tb.map(async (element, index) => {
			const zPOSBal = await getPoolInfo(tb[index].args[8]);

			let zPOSADD = zPOSBal[0].args[0];
			let zNEGADD = zPOSBal[0].args[1];

			let depPOS = 0;

			try{
				depPOS = await callViewPoolFunction(tb[index].args[8],'getDepNumPOS');
			}
			catch(error){
				return {...element}
			}
			let depNEG = await callViewPoolFunction(tb[index].args[8],'getDepNumNEG');
			let totBal = await callViewPoolFunction(tb[index].args[8],'getBalance');
			let condition = await callViewPoolFunction(tb[index].args[8],'getCondition');
			let withdrawON = await callViewPoolFunction(tb[index].args[8],'withdrawOn');
			let dValue = await callViewPoolFunction(tb[index].args[8],'getDiscountedValue');
			let pastSettleDate = await callViewPoolFunction(tb[index].args[8],'pastSettlementDate');

			return {
			  ...element, // Spread the existing properties of element
			  zPOSBal: (ethers.utils.formatEther(depPOS)).toString(),
			  zNEGBal: (ethers.utils.formatEther(depNEG)).toString(),
			  zPOSADD: zPOSADD,
			  zNEGADD: zNEGADD,
			  zTOTBAL: (ethers.utils.formatEther(totBal)).toString(),
			  zCONDITION: condition.toString(),
			  zWITHDRAW: withdrawON.toString(),
			  zDVALUE: dValue.toString(),
			  zPSDATE: pastSettleDate.toString(),
			}
		  });

		let done = await Promise.all(modifiedTb);
		setTb(done);

		const hiddenRows = document.querySelectorAll('.Hidden');
		for (let row of hiddenRows) {
  			row.style.display = 'none';
		}

		const expandButtons = document.querySelectorAll('.expand-button');

for (let button of expandButtons) {
  button.addEventListener('click', function() {
    const hiddenTable = this.parentElement.parentElement.querySelectorAll('.Hidden');
	if(hiddenTable[0].style.display === 'none') {
		hiddenTable[0].style.display = '';
	}
	else {
		hiddenTable[0].style.display = 'none';
	}

  });
}



}
	  const getPoolInfo = async (pool) => {
		try {
		  const result = await poolInfo(pool);
		  return result;
		} catch (error) {
		  console.error(error);
		}
	  };

	  const poolInfo = async (pool) => {

		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, poolABI, tempProvider2);
		const bfor4 = await tempContract3.queryFilter("*");
		return(bfor4);
	}

	const callViewPoolFunction = async (pool, functionName) => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		let tempContract = new ethers.Contract(pool, poolABI, tempProvider);
		let result;
		switch (functionName) {
		  case 'getDepNumPOS':
			result = await tempContract.getDepNumPOS();
			break;
		  case 'getDepNumNEG':
			result = await tempContract.getDepNumNEG();
			break;
		  case 'getBalance':
			result = await tempProvider.getBalance(pool);
			break;
		  case 'getCondition':
			result = await tempContract.getCondition();
			break;
		  case 'withdrawOn':
			result = await tempContract.withdrawOn();
			break;
		  case 'getDiscountedValue':
			result = await tempContract.getDiscountedValue();
			break;
		  case 'pastSettlementDate':
			result = await tempContract.pastSettlementDate();
			break;
		  default:
			throw new Error(`Invalid function name: ${functionName}`);
		}
		return result;
	  }
	  
	const depToPOS = async (event,Addr1) => {
		event.preventDefault();
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();
		let tempContract3 = new ethers.Contract(Addr1, poolABI, tempSigner2);
		let stringNum = (event.target[0].value).toString();
		let deus = ethers.utils.parseEther(stringNum);

		await tempContract3.depositToPOS({value:deus});
	}

	const depToNEG = async (event,Addr1) => {
		event.preventDefault();
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();
		let tempContract3 = new ethers.Contract(Addr1, poolABI, tempSigner2);
		let stringNum = (event.target[0].value).toString();
		let deus = ethers.utils.parseEther(stringNum);

		await tempContract3.depositToNEG({value:deus});
	}

	const approveNEG = async (event,Addr1,Addr2) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract44 = new ethers.Contract(Addr1, claimABI, tempProvider2);
		let tempContract3 = new ethers.Contract(Addr1, claimABI, tempSigner2);

		let balance = await tempContract44.balanceOf(defaultAccount);

		await tempContract3.approve(Addr2,balance);
	}

	const approvePOS = async (event,Addr1,Addr2) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract44 = new ethers.Contract(Addr1, claimABI, tempProvider2);
		let tempContract3 = new ethers.Contract(Addr1, claimABI, tempSigner2);

		let balance = await tempContract44.balanceOf(defaultAccount);

		await tempContract3.approve(Addr2,balance);
	}
	const callContractFunction = async (event, contractAddress, functionName) => {
		event.preventDefault();
		
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner = tempProvider.getSigner();
		
		let tempContract = new ethers.Contract(contractAddress, poolABI, tempSigner);
	  
		switch (functionName) {
		  case 'redeemwithPOS':
			await tempContract.redeemWithPOS();
			break;
		  case 'redeemwithNEG':
			await tempContract.redeemWithNEG();
			break;
		  case 'withdrawNEG':
			await tempContract.withdrawWithNEG();
			break;
		  case 'withdrawPOS':
			await tempContract.withdrawWithPOS();
			break;
		  case 'settle':
			await tempContract.settle();
			break;
		  case 'makeWithdrawable':
			await tempContract.turnWithdrawOn();
			break;
		  case 'deZtruction':
			await tempContract.turnToDust();
			break;
		  default:
			throw new Error(`Invalid function name: ${functionName}`);
		}
	  }
	  
	return (
		<div>
		<h4> Current Pools </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>User_Address: {defaultAccount}</h3>
			</div>
      <div>
        <p>Deployer Contract: {contractAddress}</p>
        <p> On : Goerli Testnet </p>
      </div>
            <button onClick={getEvents}>Get Events</button>
			{errorMessage}

			{tb && (
        <table>
          <thead>
            <tr>
				
			<th> Total Balance </th>
			<th> POS Balance </th>
			<th> NEG Balance </th>

			<th> Settlement Price </th>
			  <th> Settlement Date </th>
			  <th> Decay Rate  </th>
			  <th> Max Ratio </th>
			  <th> Max Ratio Date </th>

			<th> Past Settlement Date </th>
			<th> Condition </th>
			<th> Discount Rate </th>
			<th> Withdraw </th>

			<th> Details </th>

            </tr>
          </thead>
          <tbody>
            {tb.map((event, index) => (
              <tr key={index}>

				<td>{event.zTOTBAL}</td>
				<td>{event.zPOSBal}</td>
				<td>{event.zNEGBal}</td>

				<td>{event.args[1].toString()}</td>
                <td>{event.args[2].toString()}</td>
                <td>{event.args[3].toString()}</td>
				<td>{event.args[4].toString()}</td>
                <td>{event.args[5].toString()}</td>

				<td> {event.zPSDATE} </td>
				<td> {event.zCONDITION} </td>
				<td> {event.zDVALUE} </td>
				<td> {event.zWITHDRAW} </td>

				<td><button className="expand-button">Expand</button></td>

<tr>
	<td>

<table className='Hidden'>

<thead>

			<th > Contract Address </th>
              <th >Oracle Address</th>

			  <th > name </th>
			  <th > acronym </th>
			  <th > DestructionDate </th>

			  <th > POS address </th>
			  <th > NEG address </th>

			  <th > Deposit POS </th>
			  <th > Deposit NEG </th>

			  <th >Approve POS </th>
			  <th > Approve NEG </th>

			  <th > Redeem POS </th>
			  <th > Redeem NEG </th>

			  <th > Withdraw POS </th>
			  <th > Withdraw NEG </th>

			  <th > settle </th>
			  <th > turnWithdrawOn </th>
			  <th > SELF DESTRUCTION!</th>


</thead>
	<tbody>
  					<td>{event.args[8].toString()}</td>

  					<td>{event.args[0].toString()}</td>

  					<td>{event.args[6].toString()}</td>

  					<td>{event.args[7].toString()}</td>

  					<td>{event.args[9].toString()}</td>

  					<td>{event.zPOSADD}</td>

  					<td>{event.zNEGADD}</td>

					<td> <form className='deposit' onSubmit={(e) => depToPOS(e, event.args[8].toString())}> <input id={"POSd"+index} type="text" ></input> <button type="submit" >POS</button> </form>
					</td>

					<td><form className='deposit' onSubmit={(e) => depToNEG(e, event.args[8].toString())}> <input id={"NEGd"+index} type="text" ></input> <button type="submit" >NEG</button> </form>
					</td>
					<td><form className='approvePOS' onSubmit={(e) => approvePOS(e, event.args[8].toString())}> <button type="submit" >Approve POS </button> </form>
					</td>
					<td><form className='approveNEG' onSubmit={(e) => approveNEG(e, event.args[8].toString())}> <button type="submit" >Approve NEG </button> </form>
					</td>
					<td><form className='redeemPOS' onSubmit={(e) => callContractFunction(e, event.args[8].toString(),'redeemwithPOS')}> <button type="submit" >Redeem POS </button> </form>
					</td>
					<td><form className='redeemNEG' onSubmit={(e) => callContractFunction(e, event.args[8].toString(),'redeemwithNEG')}> <button type="submit" >Redeem NEG </button> </form>
					</td>
					<td><form className='withdrawPOS' onSubmit={(e) => callContractFunction(e, event.args[8].toString(),'withdrawPOS')}> <button type="submit" >Withdraw POS </button> </form>
					</td>
					<td><form className='withdrawNEG' onSubmit={(e) => callContractFunction(e, event.args[8].toString(),'withdrawNEG')}> <button type="submit" >Withdraw NEG </button> </form>
					</td>
					<td><form className='settle' onSubmit={(e) => callContractFunction(e, event.args[8].toString(),'settle')}> <button type="submit" > Settle </button> </form>
					</td>
					<td><form className='turnwithdrawon' onSubmit={(e) => callContractFunction(e, event.args[8].toString(),'makeWithdrawable')}> <button type="submit" > TurnWithdrawOn </button> </form>
					</td>
					<td><form className='SelfDestruct' onSubmit={(e) => callContractFunction(e, event.args[8].toString(),'deZtruction')}> <button type="submit" > DESTRUCTION </button> </form>
					</td>

				</tbody>

				</table>
				
				</td>

				</tr>
				
</tr>
            ))}

          </tbody>
        </table>

)}

		</div>
	);
}

export default PoolJS;

