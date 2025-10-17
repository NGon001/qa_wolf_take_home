import { NewsPage } from "../Pages/NewsPage";
import {test as baseTest} from '@playwright/test';

// Define a custom fixture type for the Page Object Model
type MyFixtures = {
    newsPage: NewsPage;
}

// Extend the base test with the custom fixture
export const test = baseTest.extend<MyFixtures>({
    newsPage: async ({page}, use) => {
        await use(new NewsPage(page));
    },
});
