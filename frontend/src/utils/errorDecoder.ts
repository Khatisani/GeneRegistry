
import { ethers, Interface } from "ethers";
import { GENE_REGISTRY_ABI } from "@/config/contract";

const iface = new Interface(GENE_REGISTRY_ABI);

export function decodeContractError(error: any): string {

  if (error?.code === "ACTION_REJECTED" || error?.code === 4001) {
    return "Transaction was cancelled in your wallet.";
  }


  if (error?.code === "INSUFFICIENT_FUNDS") {
    return "Insufficient testnet ETH in your wallet to cover the 0.001 ETH fee + gas.";
  }


  const errorData =
    error?.data ||
    error?.error?.data ||
    error?.info?.error?.data ||
    error?.receipt?.revertData;

  if (errorData && typeof errorData === "string") {
    try {
      const parsedCustomError = iface.parseError(errorData);
      if (parsedCustomError) {
        switch (parsedCustomError.name) {
          case "duplicateSequence":
            return "This sequence is already registered in the ledger.";
          case "invalidSequence":
            return "Sequence contains invalid characters. Only A, T, C, G, and N are allowed.";
          case "emptyField":
            return `Field "${parsedCustomError.args[0]}" cannot be empty.`;
          case "insufficientFee":
            return "Incorrect registration fee provided. Exactly 0.001 ETH is required.";
          case "geneNotFound":
            return "Gene sequence was not found in the registry.";
          case "zeroDonation":
            return "Donation amount must be greater than 0 ETH.";
          case "onlyResearcher":
            return "Only the registered researcher address can withdraw these research funds.";
          case "noFundsAvailable":
            return "No research funds available to withdraw for this sequence.";
          case "transferFailed":
            return "ETH transfer failed during payout execution.";
          default:
            return `Contract reverted with: ${parsedCustomError.name}`;
        }
      }
    } catch {

        }
    }

    if (error?.reason) {
        return error.reason;
    }
    if (error?.message) {
        if (error.message.includes("user rejected action")) {
        return "Transaction was cancelled in your wallet.";
        }
        return error.message.slice(0, 120);
    }

    return "Transaction failed. Please check your wallet and try again.";
    }