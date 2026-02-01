import { test } from "@playwright/test";

import { BASE_URL } from "../consts";

test("loads", async ({ page }) => {
  await page.goto(BASE_URL);
});
