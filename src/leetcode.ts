// https://github.com/faisal-shohag/leetcode_api

import { LeetcodeError } from "./error.js";

const ACCEPTED = "Accepted";
const GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";
const PROFILE_QUERY = `query getUserStats($username: String!) {
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
    titleSlug timestamp
    statusDisplay
    lang
  }
}`;

interface Submission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

interface LeetcodeResponse {
  data: {
    matchedUser: object | null;
    recentSubmissionList: Submission[];
  };
}

export class Leetcode {
  private static async fetchUserProfile(username: string) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: PROFILE_QUERY,
        variables: { username }
      })
    });

    if (!response.ok) {
      throw new LeetcodeError(`Leetcode API error: ${response.status}`);
    }

    return (await response.json()) as LeetcodeResponse;
  }

  static async isValidUsername(username: string) {
    const result = await this.fetchUserProfile(username);
    return !!result.data.matchedUser;
  }

  static async getSubmissions(username: string) {
    const result = await Leetcode.fetchUserProfile(username);
    return result.data.recentSubmissionList;
  }

  static async getAcceptedSubmissions(username: string) {
    const submissions = await this.getSubmissions(username);
    return submissions.filter((sub) => sub.statusDisplay === ACCEPTED);
  }

  static solvedWithinLast24(now: number, submission: Submission) {
    const { timestamp } = submission;
    return Math.floor(now / 1000) - Number(timestamp) <= 86_400;
  }
}
