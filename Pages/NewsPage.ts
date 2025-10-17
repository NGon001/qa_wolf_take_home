import { Locator, Page, expect } from "@playwright/test";

export class NewsPage {
    readonly page: Page;
    readonly moreLinkLocator: Locator;
    readonly hackerNewsTitleLocator: Locator;
    readonly articlesTimeStampLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.moreLinkLocator = this.page.getByRole("link", {name: "More", exact: true}); // get the "More" link at the bottom of the page
        this.hackerNewsTitleLocator = this.page.getByRole("link", {name: "Hacker News"}); // get the "Hacker News" title link at the top of the page
        this.articlesTimeStampLocator = this.page.locator('span[class="age"]'); // get all article timestamp elements on the current page (usually 30 articles per page)
    };

    // Verify that the Hacker News title link is visible
    async expectHackerNewsTitleVisible() {
        await expect(this.hackerNewsTitleLocator).toBeVisible();
    }

    // Navigate to a specific path on the Hacker News site and verify the title is visible
    async goto(path: string = "") {
        await this.page.goto("/" + path); // navigate to the specified path, defoult is homepage and located inside of baseURL
        await this.expectHackerNewsTitleVisible(); // verify that the Hacker News title link is visible
    };

    // Click the "More" link to load more articles
    async clickMoreLink(){
        await expect(this.moreLinkLocator).toBeVisible(); // ensure the "More" link is visible
        await this.moreLinkLocator.click(); // click the "More" link
    }

    // Extract the Unix timestamp from a given article element ("1760723583")
    async getArticleTimeStamp(element: Locator) {
        await expect(element).toBeVisible(); // ensure the element is visible
        const title = await element.getAttribute('title'); // e.g. title="time 2025-10-17T17:46:44 1760723204"
        if(title){ // ensure the title attribute exists
            return (title.split(" ")[1]); // extract and return the timestamp part
        }
        throw new Error("Timestamp title attribute not found"); // throw error if title attribute is missing
    }

    // Get all article timestamps on the current page as an array of numbers ([1760723583, 1760719983, ...])
    async getCurrentPageArticlesTimeStamps() {
        const elements = await this.articlesTimeStampLocator.all(); // get all timestamp elements on the page (usually 30)

        const timeStamps: Number[] = []; // initialize an array to hold the timestamps
        for(const element of elements){ // iterate through each timestamp element
            const timeStamp =  await this.getArticleTimeStamp(element); // extract the timestamp
            timeStamps.push(Number(timeStamp)); // convert to number and add to the array
        }

        await expect(timeStamps.length).toBeGreaterThan(0); // ensure we have at least one timestamp
        return timeStamps; // return the array of timestamps
    }

    async verifyTimeStampsAreInDescendingOrder(timeStamps: [], amountOfArticlesToCheck: number = 100) {
          await expect(timeStamps.length).toBeGreaterThanOrEqual(amountOfArticlesToCheck); // ensure we have enough timestamps to check
          const first100TimeStamps = timeStamps.slice(0, amountOfArticlesToCheck); // get the first 100 timestamps
          const sortedTimestamps = [...first100TimeStamps].sort((a, b) => b - a); // create a sorted copy in descending order (largest to smallest eg. 1760723583, 1760719983, ...)
          expect(first100TimeStamps).toEqual(sortedTimestamps); // compare the original first 100 timestamps with the sorted version to verify order
    };
};

export const SortBy = {
    New: "newest",
    Past: "front",
    Comments: "newcomments",
    Ask: "ask",
    Show: "show",
    Jobs: "jobs",
    Submit: "submit"
};