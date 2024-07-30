import { waitForTransaction, writeContract, prepareWriteContract } from '@wagmi/core'
import ContractAddresses from "@/contracts/ContractAddresses.json";
import { fundingManagerABI } from "@/contracts/FundingManager";
import { dummyDAIABI } from "@/contracts/DummyDAI";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

export async function increaseAllowance(investAmount: number) {
  const { request: increaseAllowanceConfig } = await prepareWriteContract({
    address: ContractAddresses.dummyDAIAddress as `0x${string}`,
    abi: dummyDAIABI,
    functionName: 'increaseAllowance',
    args: [
      ContractAddresses.fundingManagerAddress as `0x${string}`,
      BigInt(investAmount.asTokenSmallestUnit())
    ]
  });

  const { hash: increaseAllowanceHash } = await writeContract(increaseAllowanceConfig);
  await waitForTransaction({ hash: increaseAllowanceHash });
}

export async function investOnProject(projectId: bigint, investAmount: number) {
  const { request: investConfig } = await prepareWriteContract({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'invest',
    args: [
      projectId,
      BigInt(investAmount.asTokenSmallestUnit())
    ]
  });

  const { hash: investHash } = await writeContract(investConfig);
  await waitForTransaction({ hash: investHash });
}

export async function resetAllowance() {
  const { request: resetAllowanceConfig } = await prepareWriteContract({
    address: ContractAddresses.dummyDAIAddress as `0x${string}`,
    abi: dummyDAIABI,
    functionName: 'approve',
    args: [
      ContractAddresses.fundingManagerAddress as `0x${string}`,
      BigInt(0)
    ]
  });
  const { hash: resetAllowanceHash } = await writeContract(resetAllowanceConfig);
  await waitForTransaction({ hash: resetAllowanceHash })
}

export async function triggerUpkeep(calldata: string) {
 // try {
    const { request: upkeepConfig } = await prepareWriteContract({
      address: ContractAddresses.fundingManagerAddress as `0x${string}`,
      abi: fundingManagerABI,
      functionName: 'performUpkeep',
      args: [
        calldata as `0x${string}`
      ]
    });
    const { hash: upkeepHash } = await writeContract(upkeepConfig);
    await waitForTransaction({ hash: upkeepHash })
  //} catch (e) {
   // console.log(e);
 // }
}

export const getDocumentUrl = async (documentName: string): Promise<string> => {
  const imageRef = ref(storage, `documents/${documentName}`);
  const url = await getDownloadURL(imageRef);
  return url;
};

export const getImageUrl = async (imageName: string): Promise<string> => {
  const imageRef = ref(storage, `public/${imageName}`);
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return 'https://firebasestorage.googleapis.com/v0/b/tpprofesionaljf.appspot.com/o/public%2Fdefault-image.jpg?alt=media&token=b2a40410-5e0b-4bf3-a886-0e8e1e63095e';
  }
};

export const fileExists = async (fileName: string): Promise<boolean> => {
  const fileRef = ref(storage, `images/${fileName}`);
  try {
    await getDownloadURL(fileRef);
    return true;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return false;
  }
};

export async function setDCFCalculatorValues() {
  const industry = industries[0].id;
  let avgEvEbitda = BigInt(7.72 * 1e18);
  /*const riskFree = 0.034.asTokenSmallestUnit();
  const countryRisk = 0.02.asTokenSmallestUnit();
  const DA = 0.29.asTokenSmallestUnit();
  const incomeTaxRate = 0.3.asTokenSmallestUnit();
  const unleveredBeta = 0.95.asTokenSmallestUnit();
  const marketRiskPremium = 0.046.asTokenSmallestUnit();
  const growthRate = 0.03.asTokenSmallestUnit();*/

/*
  const { request: setFunctionConfig } = await prepareWriteContract({
    address: ContractAddresses.dcfCalculatorAddress as `0x${string}`,
    abi: dcfCalculatorABI,
    functionName: 'setAvgEvEbitda',
    args: [
      industry as unknown as number,
      BigInt(avgEvEbitda as number) * BigInt(1e18)
    ]
  });
  const { hash: setFunctionHash } = await writeContract(setFunctionConfig);
  await waitForTransaction({ hash: setFunctionHash })*/

/*
  await dcfCalculator.setAvgEvEbitda(industry, avgEvEbitda);
  await dcfCalculator.setUnleveredBeta(industry, unleveredBeta);
  await dcfCalculator.setDA(industry, DA);
  await dcfCalculator.setGrowthRate(industry, growthRate);
  await dcfCalculator.setCountryRisk(countryRisk);
  await dcfCalculator.setRiskFree(riskFree);
  await dcfCalculator.setMarketRiskPremium(marketRiskPremium);
  await dcfCalculator.setIncomeTaxRate(incomeTaxRate);*/
}

export function getIndustrieById(id: string) {
  return industries.find((industrie) => industrie.id === id);
}

export enum ProjectStage {
  FUNDING = 0,
  STARTED = 1,
  CANCELED = 2,
  FINISHED = 3
}

export enum MilestoneStage {
  VOTING = 0,
  FINISHED = 1
}

const industries = [
  {
    id: '0', name: 'Software',
  },
  {
    id: '1', name: 'Education',
  },
  {
    id: '2', name: 'Entertainment',
  },
  {
    id: '3', name: 'Engineering & Construction',
  },
  {
    id: '4', name: 'Healthcare Products',
  },
  {
    id: '5', name: 'Biotechnology',
  },
  {
    id: '6', name: 'Electronics',
  },
  {
    id: '7', name: 'Business & Consumer Services',
  },
  {
    id: '8', name: 'Machinery',
  }
];

export default industries;