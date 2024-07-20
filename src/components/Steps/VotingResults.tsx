import { VotingResult } from "@/domain/VotingResult";
import { Stack, Typography } from "@mui/material";

interface VotingResultsProps {
  results: VotingResult | undefined
}

export function VotingResults({ results }: VotingResultsProps) {
  console.log(results);
  if (results === undefined) {
    return "";
  }
  return (
    <Stack direction="row" spacing={1} justifyContent="space-around" alignItems="center" sx={{ pt: 2 }}>
      <Typography variant="body2">
        Voting results: {results.forVotes} <Typography variant="body2" display="inline" color="success.main" fontWeight="bold">FOR</Typography>/
        {results.againstVotes} <Typography variant="body2" display="inline" color="error.main" fontWeight="bold">AGAINST</Typography>/
        {results.abstainVotes} <Typography variant="body2" display="inline" fontWeight="bold">ABSTEIN</Typography> 
      </Typography>
      {results.finalResult != undefined &&
        <Typography variant="body2">
          End result: {
            results.finalResult ? <Typography variant="body2" display="inline" color="success.main">Continue project (release funds)</Typography>
              : <Typography variant="body2" display="inline" color="error.main">Cancel project</Typography>
          }
        </Typography>
      }
    </Stack>
  );
}
