import { waitForTransaction, writeContract, prepareWriteContract } from '@wagmi/core'
import ContractAddresses from "@/contracts/ContractAddresses.json";
import { fundingManagerABI } from "@/contracts/FundingManager";
import { dummyDAIABI } from "@/contracts/DummyDAI";

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

export function getIndustrieById(id: string) {
  return industries.find((industrie) => industrie.id === id);
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