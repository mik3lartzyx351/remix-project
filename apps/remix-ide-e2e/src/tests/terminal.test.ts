'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
  '@disabled': true,
  before: function (browser: NightwatchBrowser, done: VoidFunction) {
    init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false)
  },
  'Should execution a simple console command #group1 #group999': function (browser: NightwatchBrowser) {
    browser
      .waitForElementVisible('*[data-id="terminalCli"]', 10000)
      .executeScriptInTerminal('console.log(1 + 1)')
      .pause(2000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', '2', 60000)
  },

  'Should clear console #group1': function (browser: NightwatchBrowser) {
    browser
      .waitForElementVisible('*[data-id="terminalCli"]')
      .journalChildIncludes('Welcome to Remix')
      .click('#clearConsole')
      .waitForElementContainsText('*[data-id="terminalJournal"]', '', 60000)
  },

  'Async/Await Script #group1': function (browser: NightwatchBrowser) {
    browser
      .addFile('asyncAwait.js', { content: asyncAwait })
      .executeScriptInTerminal('remix.execute("asyncAwait.js")')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Waiting Promise', 60000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'result - ', 60000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Promise Resolved', 60000)
  },

  'Call Remix File Manager from a script #group2': function (browser: NightwatchBrowser) {
    browser
      .addFile('asyncAwaitWithFileManagerAccess.js', { content: asyncAwaitWithFileManagerAccess })
      .executeScriptInTerminal('remix.execute(\'asyncAwaitWithFileManagerAccess.js\')')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'contract Ballot {', 60000)
  },

  'Call web3.eth.getAccounts() using Remix VM #group2': function (browser: NightwatchBrowser) {
    browser
      .executeScriptInTerminal('web3.eth.getAccounts()')
      .waitForElementContainsText('*[data-id="terminalJournal"]', '["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB","0x617F2E2fD72FD9D5503197092aC168c91465E7f2","0x17F6AD8Ef982297579C203069C1DbfFE4348c372","0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678","0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7","0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C","0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C","0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB","0x583031D1113aD414F02576BD6afaBfb302140225","0xdD870fA1b7C4700F2BD7f44238821C26f7392148"]')
  },

  'Call web3.eth.getAccounts() using External Http Provider #group5': function (browser: NightwatchBrowser) {
    browser
      .click('*[data-id="terminalClearConsole"]') // clear  the terminal
      .clickLaunchIcon('udapp')
      .switchEnvironment('External Http Provider')
      .modalFooterOKClick('basic-http-provider')
      .executeScriptInTerminal('web3.eth.getAccounts()')
      .waitForElementContainsText('*[data-id="terminalJournal"]', '["', 60000) // we check if an array is present, don't need to check for the content
      .waitForElementContainsText('*[data-id="terminalJournal"]', '"]', 60000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', '","', 60000)
  },

  'Call Remix File Resolver (external URL) from a script #group3': function (browser: NightwatchBrowser) {
    browser
      .click('*[data-id="terminalClearConsole"]') // clear the terminal
      .addFile('resolveExternalUrlAndSave.js', { content: resolveExternalUrlAndSave })
      .openFile('resolveExternalUrlAndSave.js')
      .pause(1000)
      .executeScriptInTerminal('remix.execute(\'resolveExternalUrlAndSave.js\')')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Implementation of the {IERC20} interface.', 60000)
      .openFile('.deps/github/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol')
  },

  'Call Remix File Resolver (internal URL) from a script #group3': function (browser: NightwatchBrowser) {
    browser
      .click('*[data-id="terminalClearConsole"]') // clear the terminal
      .addFile('resolveUrl.js', { content: resolveUrl })
      .openFile('resolveUrl.js')
      .pause(1000)
      .executeScriptInTerminal('remix.execute(\'resolveUrl.js\')')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'contract Ballot {', 60000)
  },

  'Call Remix File Resolver (internal URL) from a script and specify a path #group3': function (browser: NightwatchBrowser) {
    browser
      .click('*[data-id="terminalClearConsole"]') // clear the terminal
      .addFile('resolveExternalUrlAndSaveToaPath.js', { content: resolveExternalUrlAndSaveToaPath })
      .openFile('resolveExternalUrlAndSaveToaPath.js')
      .pause(1000)
      .executeScriptInTerminal('remix.execute(\'resolveExternalUrlAndSaveToaPath.js\')')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'abstract contract ERC20Burnable', 60000)
      .openFile('.deps/github/newFile.sol')

  },

  'Deploy "Owner" using an ether.js script, listen to event and check event are logged in the terminal #group4': function (browser: NightwatchBrowser) {
    browser
      .clickLaunchIcon('settings')
      .clickLaunchIcon('udapp')
      .switchEnvironment('vm-london')
      .click('*[data-id="terminalClearConsole"]') // clear the terminal
      .clickLaunchIcon('filePanel')
      .click('*[data-id="treeViewDivtreeViewItem"]') // make sure we create the file at the root folder
      .addFile('deployWithEthersJs.js', { content: deployWithEthersJs })
      // .openFile('deployWithEthersJs.js')
      .pause(1000)
      .click('[data-id="treeViewDivtreeViewItemcontracts"]')
      .openFile('contracts/2_Owner.sol')
      .clickLaunchIcon('solidity')
      .click('*[data-id="compilerContainerCompileBtn"]').pause(5000) // compile Owner
      .executeScriptInTerminal('remix.execute(\'deployWithEthersJs.js\')')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Contract Address:', 60000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', '0xd9145CCE52D386f254917e481eB44e9943F39138', 60000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Deployment successful.', 60000)
      .addAtAddressInstance('0xd9145CCE52D386f254917e481eB44e9943F39138', true, true, false)
      .click('*[data-id="terminalClearConsole"]') // clear the terminal
      .waitForElementPresent('*[data-id="universalDappUiContractActionWrapper"]', 60000)
      .clickInstance(0)
      .clickFunction('changeOwner - transact (not payable)', { types: 'address newOwner', values: '0xd9145CCE52D386f254917e481eB44e9943F39138' }) // execute the "changeOwner" function
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'previousOwner', 60000) // check that the script is logging the event
      .waitForElementContainsText('*[data-id="terminalJournal"]', '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', 60000) // check that the script is logging the event
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'newOwner', 60000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', '0xd9145CCE52D386f254917e481eB44e9943F39138', 60000)
  },
  'Run tests using Mocha script and check result logging in the terminal #group4': function (browser: NightwatchBrowser) {
    browser
      .addFile('scripts/storage.test.js', { content: storageMochaTests })
      .pause(1000)
      .openFile('contracts/1_Storage.sol')
      .clickLaunchIcon('solidity')
      .click('*[data-id="compilerContainerCompileBtn"]')
      .pause(1000) // compile Storage
      .executeScriptInTerminal('remix.execute(\'scripts/storage.test.js\')')
      .pause(1000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'RUNS scripts/script.ts....')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'storage contract Address:')
      .waitForElementContainsText('*[data-id="terminalJournal"]', '✓ test initial value')
      .waitForElementContainsText('*[data-id="terminalJournal"]', '✓ test updating and retrieving updated value')
      .waitForElementContainsText('*[data-id="terminalJournal"]', '✘ fail test updating and retrieving updated value')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Expected: 55')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Received: 56')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Message: incorrect number: expected 56 to equal 55')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Passed: 2')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Failed: 1')
  },
  'Run tests using Mocha for a contract with library deployment and check result logging in the terminal #group4': function (browser: NightwatchBrowser) {
    browser
      .addFile('scripts/storageWithLib.test.js', { content: storageWithLibMochaTests })
      .pause(1000)
      .click('[data-id="treeViewDivtreeViewItemcontracts"]')
      .addFile('contracts/StorageWithLib.sol', { content: storageWithLibContract })
      .openFile('contracts/StorageWithLib.sol')
      .clickLaunchIcon('solidity')
      .click('*[data-id="compilerContainerCompileBtn"]')
      .pause(1000) // compile StorageWithLib
      .executeScriptInTerminal('remix.execute(\'scripts/storageWithLib.test.js\')')
      .pause(1000)
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'RUNS scripts/script.ts....')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Storage')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'deploying lib:')
      .waitForElementContainsText('*[data-id="terminalJournal"]', '✘ test library integration by calling a lib method')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Expected: 34')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Received: 14')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Message: expected \'14\' to equal \'34\'')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Passed: 0')
      .waitForElementContainsText('*[data-id="terminalJournal"]', 'Failed: 1')
  },
  'Should print hardhat logs #group4': function (browser: NightwatchBrowser) {
    browser
      .click('*[data-id="terminalClearConsole"]') // clear the terminal
      .waitForElementVisible('[for="autoCompile"]')
      .click('[for="autoCompile"]')
      .clickLaunchIcon('udapp')
      .testContracts('printHardhatlog.sol', { content: hardhatLog }, ['OwnerTest'])
      .clickLaunchIcon('udapp')
      .click('*[data-id="deployAndRunClearInstances"]')
      .selectContract('OwnerTest')
      .createContract('')
      .pause(1000)
      .journalChildIncludes('constructor', { shouldHaveOnlyOneOccurence: true })
      .pause(5000)
      .click('*[data-id="terminalClearConsole"]') // clear the terminal
      .clickInstance(0)
      .clickFunction('changeOwner - transact (not payable)', { types: 'address newOwner', values: '0xd9145CCE52D386f254917e481eB44e9943F39138' })
      .pause(1000)
      .journalChildIncludes('inside changeOwner', { shouldHaveOnlyOneOccurence: true })
      .clickFunction('getOwner - call')
      .pause(1000)
      .journalChildIncludes('inside getOwner', { shouldHaveOnlyOneOccurence: true })
  },

  'Should display auto-complete menu #group4': function (browser: NightwatchBrowser) {
    browser
      .waitForElementVisible('*[data-id="terminalCli"]')
      .click('*[data-id="terminalCli"]')
      .sendKeys('*[data-id="terminalCliInput"]', 'remix.')
      .assert.visible('*[data-id="autoCompletePopUpAutoCompleteItem"]')
  },

  'Should run a script right after compilation #group6': function (browser: NightwatchBrowser) {
    browser
      .addFile('contracts/storage.sol', { content: scriptAutoExec.contract })
      .addFile('scripts/deploy_storage.js', { content: scriptAutoExec.script })
      .openFile('contracts/storage.sol')
      .sendKeys('body', [browser.Keys.CONTROL, browser.Keys.SHIFT, 's'])
      .pause(15000)
      .journalLastChildIncludes('147')
  },

  'Should run a script which log transaction and block using web3.js and ethers #group7': function (browser: NightwatchBrowser) {
    browser
      .clickLaunchIcon('udapp')
      .switchEnvironment('External Http Provider')
      .waitForElementPresent('[data-id="basic-http-provider-modal-footer-ok-react"]')
      .execute(() => {
        (document.querySelector('*[data-id="basic-http-providerModalDialogContainer-react"] input[data-id="modalDialogCustomPromp"]') as any).focus()
      }, [], () => { })
      .setValue('[data-id="modalDialogCustomPromp"]', 'https://remix-goerli.ethdevops.io')
      .modalFooterOKClick('basic-http-provider')
      .clickLaunchIcon('filePanel')
      .openFile('README.txt')
      .addFile('scripts/log_tx_block.js', { content: scriptBlockAndTransaction })
      .pause(1000)
      .executeScriptInTerminal('remix.execute(\'scripts/log_tx_block.js\')')
      // check if the input of the transaction is being logged (web3 call)
      .waitForElementContainsText('*[data-id="terminalJournal"]', '0x775526410000000000000000000000000000000000000000000000000000000000000060464c0335b2f1609abd9de25141c0a3b49db516fc7375970dc737c32b986e88e3000000000000000000000000000000000000000000000000000000000000039e000000000000000000000000000000000000000000000000000000000000000602926b30b10e7a514d92bc71e085f5bff2687fac2856ae43ef7621bf1756fa370516d310bec5727543089be9a4d5f68471174ee528e95a2520b0ca36c2b6c6eb0000000000000000000000000000000000000000000000000000000000046f49036f5e4ea4dd042801c8841e3db8e654124305da0f11824fc1db60c405dbb39f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 120000)
      // check if the logsBloom is being logged (web3 call)
      .waitForElementContainsText('*[data-id="terminalJournal"]', '0x00000000000000000000000000100000000000000000020000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000040000000060000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000100000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000001', 120000)
      // check if the logsBloom is being logged (ethers.js call)
      .waitForElementContainsText('*[data-id="terminalJournal"]', '"hex":"0x025cd8"', 120000)
  },

  'Should listen on all transactions #group8': function (browser: NightwatchBrowser) {
    const url = 'http://127.0.0.1:8545'
    const identifier = 'Custom'
    browser
      .clickLaunchIcon('udapp') // connect to mainnet
      .connectToExternalHttpProvider(url, identifier)
      .openFile('contracts')
      .openFile('contracts/1_Storage.sol')
      .clickLaunchIcon('solidity')
      .click({
        selector: '*[data-id="compilerContainerCompileAndRunBtn"]',
      })
      .pause(10000)
      .waitForElementNotPresent({
        locateStrategy: 'xpath',
        selector: "//*[@class='remix_ui_terminal_log' and contains(.,'to:') and contains(.,'from:')]",
        timeout: 120000
      })
      .click({
        selector: '[data-id="listenNetworkCheckInput"]',
      }) // start to listen
      .click({
        selector: '*[data-id="compilerContainerCompileAndRunBtn"]',
      })
      .pause(10000)
      .findElements(
        {
          locateStrategy: 'xpath',
          selector: "//*[@class='remix_ui_terminal_log' and contains(.,'to:') and contains(.,'from:')]",
          timeout: 120000,
        }
        , async (result) => {
          if (Array.isArray(result.value) && result.value.length > 0) {
            console.log('Found ' + result.value.length + ' transactions')
            browser
            .click({
              selector: '[data-id="listenNetworkCheckInput"]',
            })
            .click({
              selector: '*[data-id="terminalClearConsole"]',
            })
            .click({
              selector: '*[data-id="compilerContainerCompileAndRunBtn"]',
            })
            .pause(10000)
            .waitForElementNotPresent({
              locateStrategy: 'xpath',
              selector: "//*[@class='remix_ui_terminal_log' and contains(.,'to:') and contains(.,'from:')]",
              timeout: 120000
            })
            .end()
          } else {
            browser
              .assert.fail('No transaction found')
              .end()
          }
        })
  }
}


const asyncAwait = `
  var p = function () {
    return new Promise(function (resolve, reject)  {
        setTimeout(function ()  {
            resolve("Promise Resolved")
        }, 5000)
    })
  } 

  var run = async () => {
    console.log('Waiting Promise')
    var result = await p()
    console.log('result - ', result)
  }

  run()
`

const asyncAwaitWithFileManagerAccess = `
  var p = function () {
    return new Promise(function (resolve, reject)  {
        setTimeout(function ()  {
            resolve("Promise Resolved")
        }, 0)
    })
  }

  var run = async () => {
    console.log('Waiting Promise')
    var result = await p()
    let text = await remix.call('fileManager', 'readFile', 'contracts/3_Ballot.sol')
    console.log('result - ', text)
  }

  run()
`

const resolveExternalUrlAndSave = `
(async () => {
  try {
      console.log('start')
      console.log(await remix.call('contentImport', 'resolveAndSave', 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol'))
  } catch (e) {
      console.log(e.message)
  }
})()  
`

const resolveExternalUrlAndSaveToaPath = `
(async () => {
  try {
      console.log('start')
      console.log(await remix.call('contentImport', 'resolveAndSave', 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Burnable.sol', 'github/newFile.sol'))
  } catch (e) {
      console.log(e.message)
  }
})()  
`

const resolveUrl = `
(async () => {
  try {
      console.log('start')
      console.log(await remix.call('contentImport', 'resolveAndSave', 'contracts/3_Ballot.sol'))
  } catch (e) {
      console.log(e.message)
  }
})()  
`

const deployWithEthersJs = `
// Right click on the script name and hit "Run" to execute
(async () => {
    try {
        console.log('Running deployWithEthers script...')
    
        const constructorArgs = []    // Put constructor args (if any) here for your contract

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated
        const artifactsPath = 'contracts/artifacts/Owner.json' // Change this for different path
    
        const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        // 'web3Provider' is a remix global variable object
        const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    
        let factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer)
    
        let contract = await factory.deploy(...constructorArgs);
    
        console.log('Contract Address: ', contract.address);
    
        // The contract is NOT deployed yet; we must wait until it is mined
        await contract.deployed()
        console.log('Deployment successful.')
        
        contract.on('OwnerSet', (previousOwner, newOwner) => {
            console.log('previousOwner' , previousOwner)
            console.log('newOwner' , newOwner)
        })
       
        console.log('ok')
    } catch (e) {
        console.log(e.message)
    }
})()`

const storageMochaTests = `
const { expect } = require("chai");

describe("Storage with lib", function () {
  it("test initial value", async function () {
    // Make sure contract is compiled and artifacts are generated
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'contracts/artifacts/Storage.json'))
    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    let Storage = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer)
    let storage = await Storage.deploy();
    console.log('storage contract Address: ' + storage.address);
    await storage.deployed()
    expect((await storage.retrieve()).toNumber()).to.equal(0);
  });

  it("test updating and retrieving updated value", async function () {
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'contracts/artifacts/Storage.json'))
    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    let Storage = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer)
    let storage = await Storage.deploy();
    await storage.deployed()
    const setValue = await storage.store(56);
    await setValue.wait();
    expect((await storage.retrieve()).toNumber()).to.equal(56);
  });

  it("fail test updating and retrieving updated value", async function () {
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'contracts/artifacts/Storage.json'))
    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    let Storage = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer)
    let storage = await Storage.deploy();
    await storage.deployed()
    const setValue = await storage.store(56);
    await setValue.wait();
    expect((await storage.retrieve()).toNumber(), 'incorrect number').to.equal(55);
  });
});`

const storageWithLibContract = `
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

library Lib {
    function test () public view returns (uint) {
        return 14;
    }
}
/**
 * @title Storage
 * @dev Store & retrieve value inr a variable
 */
contract StorageWithLib {

    uint256 number;

    /**
     * @dev Store valrue in variable
     * @param num value to store
     */
    function store(uint256 num) public {        
        number = num;        
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return number;
    }

    function getFromLib() public view returns (uint) {
        return Lib.test();
    }
}
`

const storageWithLibMochaTests = `
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Storage", function () {
    it("test library integration by calling a lib method", async function () {
        const metadataLib = JSON.parse(await remix.call('fileManager', 'readFile', 'contracts/artifacts/Lib.json'))
        console.log('deploying lib:')
        const artifactLib  = {
            contractName: 'Lib',
            sourceName: 'contracts/StorageWithLib.sol',
            abi: metadataLib.abi,
            bytecode: '0x' + metadataLib.data.bytecode.object,
            deployedBytecode:  '0x' + metadataLib.data.deployedBytecode.object,
            linkReferences: metadataLib.data.bytecode.linkReferences,
            deployedLinkReferences: metadataLib.data.deployedBytecode.linkReferences,
        }

        const optionsLib = {}
        const factoryLib = await ethers.getContractFactoryFromArtifact(artifactLib, optionsLib)
        const lib = await factoryLib.deploy();
        await lib.deployed()

        const metadata = JSON.parse(await remix.call('fileManager', 'readFile', 'contracts/artifacts/StorageWithLib.json'))
        const artifact  = {
            contractName: 'StorageWithLib',
            sourceName: 'contracts/StorageWithLib.sol',
            abi: metadata.abi,
            bytecode: '0x' + metadata.data.bytecode.object,
            deployedBytecode:  '0x' + metadata.data.deployedBytecode.object,
            linkReferences: metadata.data.bytecode.linkReferences,
            deployedLinkReferences: metadata.data.deployedBytecode.linkReferences,
        }
        const options = {
            libraries: { 
                'Lib': lib.address
            }
        }
        
        const factory = await ethers.getContractFactoryFromArtifact(artifact, options)
        const storage = await factory.deploy();
        await storage.deployed()
        const storeValue = await storage.store(333);
        await storeValue.wait();
        expect((await storage.getFromLib()).toString()).to.equal('34');
    });
});`

const hardhatLog = `
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

/**
 * @title Owner
 * @dev Set & change owner
 */
contract OwnerTest {

    address private owner;
    
    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    
    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        console.log("constructor");
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), owner);
    }

    /**
     * @dev Change owner
     * @param newOwner address of new owner
     */
    function changeOwner(address newOwner) public isOwner {
        console.log("inside changeOwner");
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        console.log("inside getOwner");
        return owner;
    }
}`

const scriptAutoExec = {
  contract: `// SPDX-License-Identifier: GPL-3.0

  pragma solidity >=0.7.0 <0.9.0;
  
  library lib {
      function test () public view returns (uint) {
  
          return 147;
      }
  }
  
  /**
   * @title Storage
   * @dev Store & retrieve value inr a variable
   * @custom:dev-run-script ./scripts/deploy_storage.js
   */
  contract Storage {
  
      uint256 number;
  
      /**
       * @dev Store valrue in variable
       * @param num value to store
       */
      function store(uint256 num) public {
          number = num;        
      }
  
      /**
       * @dev Return value 
       * @return value of 'number'
       */
      function retrieve() public view returns (uint256){
          return number;
      }
  
      function getFromLib() public view returns (uint) {
          return lib.test();
      }
  }
  `,
  script: `
  // Right click on the script name and hit "Run" to execute
  const { expect } = require("chai");
  const { ethers } = require("hardhat");
  
  (async () => {
      try {
          // function getContractFactoryFromArtifact(artifact: Artifact, signer?: ethers.Signer): Promise<ethers.ContractFactory>;
  
          // function getContractFactoryFromArtifact(artifact: Artifact, factoryOptions: FactoryOptions): Promise<ethers.ContractFactory>;
          
          const metadataLib = JSON.parse(await remix.call('fileManager', 'readFile', 'contracts/artifacts/lib.json'))
          console.log('deploying lib:')
          
          const artifactLib  = {
              contractName: 'Lib',
              sourceName: 'contracts/1_Storage.sol',
              abi: metadataLib.abi,
              bytecode: '0x' + metadataLib.data.bytecode.object,
              deployedBytecode:  '0x' + metadataLib.data.deployedBytecode.object,
              linkReferences: metadataLib.data.bytecode.linkReferences,
              deployedLinkReferences: metadataLib.data.deployedBytecode.linkReferences,
          }
          const optionsLib = {}
          
          const factoryLib = await ethers.getContractFactoryFromArtifact(artifactLib, optionsLib)
          
          const lib = await factoryLib.deploy();
  
          await lib.deployed()
  
          console.log('lib deployed', lib.address)
  
          const metadata = JSON.parse(await remix.call('fileManager', 'readFile', 'contracts/artifacts/Storage.json'))
          const artifact  = {
              contractName: 'Storage',
              sourceName: 'contracts/1_Storage.sol',
              abi: metadata.abi,
              bytecode: '0x' + metadata.data.bytecode.object,
              deployedBytecode:  '0x' + metadata.data.deployedBytecode.object,
              linkReferences: metadata.data.bytecode.linkReferences,
              deployedLinkReferences: metadata.data.deployedBytecode.linkReferences,
          }
          const options = {
              libraries: { 
                  'lib': lib.address
              }
          }
          
          const factory = await ethers.getContractFactoryFromArtifact(artifact, options)
  
          const storage = await factory.deploy();
          
          await storage.deployed()
  
          const storeValue = await storage.store(333);
  
          // wait until the transaction is mined
          await storeValue.wait();
  
          console.log((await storage.getFromLib()).toString())
          // expect((await storage.getFromLib()).toString()).to.equal('34');
  
      } catch (e) {
          console.error(e.message)
      }
    })()
  `
}

const scriptBlockAndTransaction = `
// Right click on the script name and hit "Run" to execute
(async () => {
    try {
        web3.eth.getTransaction('0x022ccd55747677ac50f8d9dfd1bf5b843fa2f36438a28c1d0a0958e057bb3e2a').then(console.log)
        web3.eth.getBlock('7367447').then(console.log);
        let ethersProvider = new ethers.providers.Web3Provider(web3Provider)
        ethersProvider.getBlock(7367447).then(console.log)
    } catch (e) {
        console.log(e.message)
    }
})()
`
