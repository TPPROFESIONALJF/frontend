export interface VotingResult {
  forVotes: number;
  againstVotes: number;
  waitingVotes: number;
  userVotedFor: boolean;
  finalResult: boolean | undefined;
}
