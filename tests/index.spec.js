// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { test } from '../Helper/base.ts';
import { SortBy } from '../Pages/NewsPage.ts';

test("Sort Hacker News Articles", async ({ newsPage }) => {
  await newsPage.goto(SortBy.New); // Navigate to the News Page sorted by "New" newest articles
  const timestamps = []; // Array to hold article timestamps
  for (timestamps.length; timestamps.length <= 100;) { // Loop until we have at least 100 timestamps
    const timeStamp = await newsPage.getCurrentPageArticlesTimeStamps(); // Get timestamps of articles on the current page
    timestamps.push(...timeStamp); // Add the retrieved timestamps to the array
    await newsPage.clickMoreLink(); // Click the "More" link to load additional articles
  };
  await newsPage.verifyTimeStampsAreInDescendingOrder(timestamps); // Verify that the timestamps are in descending order
});