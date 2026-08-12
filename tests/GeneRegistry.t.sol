// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; 

import {Test, console} from "forge-std/Test.sol";
import {GeneRegistry} from "../GeneRegistry.sol";

contract GeneRegistryTest is Test {
    GeneRegistry public registry;

    // Test accs
    address public owner;
    address public researcher = address(0x1);
    address public researcher2 = address(0x2);

    uint256 public constant REGISTRATION_FEE = 0.001 ether;

    // Assign contract owner, deploy contract, give test ETH to researchers
    function setUp() public {
        owner = address(this);
        registry = new GeneRegistry(); 

        vm.deal(researcher, 10 ether); 
        vm.deal(researcher2, 10 ether); 
    }

    function test_something () public {
        assertEq(REGISTRATION_FEE,0.001 ether );
    }
    

}