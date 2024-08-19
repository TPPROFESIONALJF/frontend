export const dcfCalculatorABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "y",
        "type": "uint256"
      }
    ],
    "name": "PRBMath_MulDiv18_Overflow",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "y",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "denominator",
        "type": "uint256"
      }
    ],
    "name": "PRBMath_MulDiv_Overflow",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      }
    ],
    "name": "PRBMath_SD59x18_Convert_Overflow",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      }
    ],
    "name": "PRBMath_SD59x18_Convert_Underflow",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PRBMath_SD59x18_Div_InputTooSmall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "x",
        "type": "int256"
      },
      {
        "internalType": "SD59x18",
        "name": "y",
        "type": "int256"
      }
    ],
    "name": "PRBMath_SD59x18_Div_Overflow",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "x",
        "type": "int256"
      }
    ],
    "name": "PRBMath_SD59x18_Exp2_InputTooBig",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "x",
        "type": "int256"
      }
    ],
    "name": "PRBMath_SD59x18_Log_InputTooSmall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PRBMath_SD59x18_Mul_InputTooSmall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "x",
        "type": "int256"
      },
      {
        "internalType": "SD59x18",
        "name": "y",
        "type": "int256"
      }
    ],
    "name": "PRBMath_SD59x18_Mul_Overflow",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "int256[5]",
        "name": "cashFlows",
        "type": "int256[5]"
      },
      {
        "internalType": "SD59x18",
        "name": "liquidityPremium",
        "type": "int256"
      },
      {
        "internalType": "SD59x18",
        "name": "spreadSob",
        "type": "int256"
      },
      {
        "internalType": "SD59x18",
        "name": "survivalRate",
        "type": "int256"
      },
      {
        "internalType": "enum DCFCalculator.Industrie",
        "name": "industry",
        "type": "uint8"
      }
    ],
    "name": "calculate",
    "outputs": [
      {
        "internalType": "SD59x18",
        "name": "result",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256[5]",
        "name": "cashFlows",
        "type": "int256[5]"
      },
      {
        "internalType": "SD59x18",
        "name": "ebitda",
        "type": "int256"
      },
      {
        "internalType": "enum DCFCalculator.Industrie",
        "name": "industry",
        "type": "uint8"
      }
    ],
    "name": "calculateAndCompare",
    "outputs": [
      {
        "internalType": "enum DCFCalculator.Gauge",
        "name": "gauge",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "ev",
        "type": "int256"
      },
      {
        "internalType": "SD59x18",
        "name": "ebitda",
        "type": "int256"
      },
      {
        "internalType": "enum DCFCalculator.Industrie",
        "name": "industry",
        "type": "uint8"
      }
    ],
    "name": "comparePerformanceBasedOnEbitda",
    "outputs": [
      {
        "internalType": "enum DCFCalculator.Gauge",
        "name": "gauge",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum DCFCalculator.Industrie",
        "name": "industrie",
        "type": "uint8"
      }
    ],
    "name": "getUSAGrowthRate",
    "outputs": [
      {
        "internalType": "SD59x18",
        "name": "growthRate",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum DCFCalculator.Industrie",
        "name": "industrie",
        "type": "uint8"
      },
      {
        "internalType": "SD59x18",
        "name": "avgEvEbitda",
        "type": "int256"
      }
    ],
    "name": "setAvgEvEbitda",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "countryRisk",
        "type": "int256"
      }
    ],
    "name": "setCountryRisk",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum DCFCalculator.Industrie",
        "name": "industrie",
        "type": "uint8"
      },
      {
        "internalType": "SD59x18",
        "name": "DA",
        "type": "int256"
      }
    ],
    "name": "setDA",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum DCFCalculator.Industrie",
        "name": "industrie",
        "type": "uint8"
      },
      {
        "internalType": "SD59x18",
        "name": "growthRate",
        "type": "int256"
      }
    ],
    "name": "setGrowthRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "incomeTaxRate",
        "type": "int256"
      }
    ],
    "name": "setIncomeTaxRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "marketRiskPremium",
        "type": "int256"
      }
    ],
    "name": "setMarketRiskPremium",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "SD59x18",
        "name": "riskFree",
        "type": "int256"
      }
    ],
    "name": "setRiskFree",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum DCFCalculator.Industrie",
        "name": "industrie",
        "type": "uint8"
      },
      {
        "internalType": "SD59x18",
        "name": "unleveredBeta",
        "type": "int256"
      }
    ],
    "name": "setUnleveredBeta",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
