// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; 

import {Test, console} from "forge-std/Test.sol";
import {GeneRegistry} from "../src/GeneRegistry.sol";

contract GeneRegistryTest is Test {
    GeneRegistry public registry;

    // Test accs
    address public owner;
    address public researcher = address(0x1);
    address public researcher2 = address(0x2);

    uint256 public constant REGISTRATION_FEE = 0.001 ether;

    // Assign contract owner, deploy contract, fund testing accounts 
    function setUp() public {
        owner = address(this);
        registry = new GeneRegistry(); 

        vm.deal(researcher, 10 ether); 
        vm.deal(researcher2, 10 ether); 
    }
    
/// ================================================= isValidSequence Tests ===========================================

/// Accepts sequence with lowercase letters
    function test_isValidSequence_Lowercase() public {
        vm.prank(researcher2);

        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "atcgatcgn"
        );
    }

/// Accepts sequence with uppercase letters
    function test_isValidSequence_Uppercase() public {
        vm.prank(researcher2);

        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "ATTGCGT"
        );
    }

/// Accepts sequence with valid mixed case letters
    function test_isValidSequence_AcceptsMixed() public {
        vm.prank(researcher);

        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "aTcGaTcGN"
        );
    }    

/// Reverts when sequence contains invalid characters
    function test_RevertWhen_InvalidSequence() public {
        vm.prank(researcher);

        string memory invalidSeq = "ATCG123X";

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.invalidSequence.selector, invalidSeq)
        );
        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            invalidSeq
        );
    }

/// Reverts when sequence contains inavlid character
    function test_RevertWhen_SequenceContainsInvalidChar() public {
        vm.prank(researcher);

        string memory invalidSeq = "ATCGaTcGr";

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.invalidSequence.selector, invalidSeq)
        );
        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            invalidSeq
        );
    }

/// Accepts lowercase sequence and emits normalized uppercase
    function test_IsValidSequence_NormalizesLowercase() public {
        vm.prank(researcher);

        vm.expectEmit(true, true, true, true);
        emit GeneRegistry.registered("ATCGATCG", researcher, "Sorghum bicolor", "Drought Resistance");

        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "atcgatcg"
        );
    }

/// Prevents duplicate registration when sending lowercase version of an uppercase sequence
    function test_RevertWhen_DuplicateCaseInsensitive() public {
        vm.startPrank(researcher2);
        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "ATCGATCG"
        );

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.duplicateSequence.selector, "ATCGATCG")
        );
        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "atcgatcg"
        );

        vm.stopPrank();
    }

/// Accepts mixed-case sequence and emits normalized uppercase
    function test_isValidSequence_NormalizesMixedCase() public {
        vm.prank(researcher);

        vm.expectEmit(true, true, true, true);
        emit GeneRegistry.registered("ATCGATCG", researcher, "Sorghum bicolor", "Drought Resistance");

        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "aTcGaTcG"
        );
    }


/// ================================================= registerGene Tests ===========================================

/// Perfect scenarion, valid registration emitting event and storing state
    function test_RegisterGene_Success() public {
        vm.prank(researcher);

        vm.expectEmit(true, true, true, true);
        emit GeneRegistry.registered("ATCGATCG", researcher, "Sorghum bicolor", "Drought Resistance");

        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "ATCGATCG"
        );
    }

/// Reverts when insufficient eth is sent 
    function test_RevertWhen_InsufficientETH() public {
        vm.prank(researcher);

        uint256 insufficientAmount = 0.0005 ether;

        vm.expectRevert(
            abi.encodeWithSelector(
                GeneRegistry.insufficientFee.selector,
                REGISTRATION_FEE,
                insufficientAmount
            )
        );
        registry.registerGene{value: insufficientAmount}(
            "Sorghum bicolor",
            "Drought Resistance",
            "ATCGATCG"
        );
    }

/// Reverts when speciesName is empty
    function test_RevertWhen_SpeciesNameIsEmpty() public {
        vm.prank(researcher);

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.emptyField.selector, "speciesName")
        );
        registry.registerGene{value: REGISTRATION_FEE}(
            "",
            "Drought Resistance",
            "ATCGATCG"
        );
    }

/// Reverts when traitType is empty
    function test_RevertWhen_TraitTypeIsEmpty() public {
        vm.prank(researcher);

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.emptyField.selector, "traitType")
        );
        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "",
            "ATCGATCG"
        );
    }

/// Reverts when sequence is empty
    function test_RevertWhen_SequenceIsEmpty() public {
        vm.prank(researcher);

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.emptyField.selector, "sequence")
        );
        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            ""
        );
    }

/// Reverts when attempting to register a sequence containing invalid non-DNA characters
    function test_RevertWhen_InvalidSequenceProvided() public {
        vm.prank(researcher);
        string memory invalidSeq = "ATCG123X";

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.invalidSequence.selector, invalidSeq)
        );
        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            invalidSeq
        );
    }

/// Reverts when attempting to register an already registered sequence
    function test_RevertWhen_DuplicateSequenceRegistered() public {
        vm.startPrank(researcher);

        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "ATCGATCG"
        );

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.duplicateSequence.selector, "ATCGATCG")
        );
        registry.registerGene{value: REGISTRATION_FEE}(
            "Sorghum bicolor",
            "Drought Resistance",
            "ATCGATCG"
        );

        vm.stopPrank();
    }
    
/// ================================================= getGeneBySequence Tests =====================================================

/// Succcessful retrieval of registered gene
    function test_GetGeneBySequence_Success() public {
        string memory species = "Sorghum bicolor";
        string memory trait = "Drought Resistance";
        string memory sequence = "ATCGATCGAT";

        vm.prank(researcher);
        registry.registerGene{value: REGISTRATION_FEE}(species, trait, sequence);

        GeneRegistry.GeneRecord memory record = registry.getGeneBySequence(sequence);

        assertTrue(record.exists);
        assertEq(record.speciesName, species);
        assertEq(record.traitType, trait);
        assertEq(record.sequence, sequence);
        assertEq(record.researcher, researcher);
    }

/// Reverts when gene is not registered
    function test_RevertWhen_UnregisteredGene() public {
        string memory unregisteredSeq = "CGATCGATCG";

        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.geneNotFound.selector, unregisteredSeq)
        );
        registry.getGeneBySequence(unregisteredSeq);
    }

/// Reverts when sequence is empty
    function test_getGeneBySequenceRevertWhen_SequenceIsEmpty() public {
        vm.expectRevert(
            abi.encodeWithSelector(GeneRegistry.emptyField.selector, "sequence")
        );
        registry.getGeneBySequence("");
    }
/// ====================================================== isRegistered Tests ======================================================
}