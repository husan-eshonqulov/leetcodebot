type LeetcodeError = {
  message: string;
  locations: {
    line: number;
    column: number;
  }[];
  path: string[];
  extensions: {
    handled: true;
  };
};

type SubmissionData = {
  difficulty: "All" | "Easy" | "Medium" | "Hard";
  count: number;
  submissions: number;
};

type RecentSubmission = {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
};

type MatchedUser = {
  submitStats: {
    acSubmissionNum: SubmissionData[];
  };
};

export type LeetcodeResponseSuccess = {
  data: {
    matchedUser: MatchedUser;
    recentSubmissionList: RecentSubmission[];
  };
};

type LeetcodeResponseError = {
  errors: LeetcodeError[];
  data: {
    matchedUser: null;
    recentSubmissionList: RecentSubmission[];
  };
};

type LeetcodeResponse = LeetcodeResponseSuccess | LeetcodeResponseError;

const URL = "https://leetcode.com/graphql";

const graphqlQuery = `query getUserStats($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
  recentSubmissionList(username: $username) {
    title
    titleSlug
    timestamp
    statusDisplay
    lang
  }
}`;

export const fetchLeetcodeStats = async (username: string) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: { username }
    })
  };

  const response = await fetch(URL, fetchOptions);
  const result = (await response.json()) as LeetcodeResponse;

  if ("errors" in result) return undefined;

  return {
    acSubmissionNum: result.data.matchedUser.submitStats.acSubmissionNum,
    recentSubmissionList: result.data.recentSubmissionList
  };
};
