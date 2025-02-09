import { expect, test } from "@playwright/test";
import path from "path";

test("Vector Store RAG", async ({ page }) => {
  test.skip(
    !process?.env?.OPENAI_API_KEY,
    "OPENAI_API_KEY required to run this test",
  );

  test.skip(
    !process?.env?.ASTRA_DB_API_ENDPOINT,
    "ASTRA_DB_API_ENDPOINT required to run this test",
  );

  test.skip(
    !process?.env?.ASTRA_DB_APPLICATION_TOKEN,
    "ASTRA_DB_APPLICATION_TOKEN required to run this test",
  );

  await page.goto("/");
  await page.waitForSelector('[data-testid="mainpage_title"]', {
    timeout: 30000,
  });

  await page.waitForSelector('[id="new-project-btn"]', {
    timeout: 30000,
  });

  let modalCount = 0;
  try {
    const modalTitleElement = await page?.getByTestId("modal-title");
    if (modalTitleElement) {
      modalCount = await modalTitleElement.count();
    }
  } catch (error) {
    modalCount = 0;
  }

  while (modalCount === 0) {
    await page.getByText("New Project", { exact: true }).click();
    await page.waitForTimeout(3000);
    modalCount = await page.getByTestId("modal-title")?.count();
  }

  await page.getByRole("heading", { name: "Vector Store RAG" }).click();
  await page.waitForSelector('[title="fit view"]', {
    timeout: 100000,
  });

  await page.getByTitle("fit view").click();
  await page.getByTitle("zoom out").click();
  await page.getByTitle("zoom out").click();
  await page.getByTitle("zoom out").click();

  let outdatedComponents = await page.getByTestId("icon-AlertTriangle").count();

  while (outdatedComponents > 0) {
    await page.getByTestId("icon-AlertTriangle").first().click();
    await page.waitForTimeout(1000);
    outdatedComponents = await page.getByTestId("icon-AlertTriangle").count();
  }

  await page
    .getByTestId("popover-anchor-input-api_key")
    .nth(0)
    .fill(process.env.OPENAI_API_KEY ?? "");

  await page
    .getByTestId("popover-anchor-input-openai_api_key")
    .nth(0)
    .fill(process.env.OPENAI_API_KEY ?? "");

  await page
    .getByTestId("popover-anchor-input-openai_api_key")
    .nth(1)
    .fill(process.env.OPENAI_API_KEY ?? "");

  await page
    .getByTestId("popover-anchor-input-token")
    .nth(0)
    .fill(process.env.ASTRA_DB_APPLICATION_TOKEN ?? "");
  await page
    .getByTestId("popover-anchor-input-token")
    .nth(1)
    .fill(process.env.ASTRA_DB_APPLICATION_TOKEN ?? "");

  await page
    .getByTestId("popover-anchor-input-api_endpoint")
    .nth(0)
    .fill(process.env.ASTRA_DB_API_ENDPOINT ?? "");
  await page
    .getByTestId("popover-anchor-input-api_endpoint")
    .nth(1)
    .fill(process.env.ASTRA_DB_API_ENDPOINT ?? "");

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByTestId("icon-FileSearch2").last().click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(
    path.join(__dirname, "../../assets/test_file.txt"),
  );
  await page.getByText("test_file.txt").isVisible();

  await page.waitForTimeout(1000);

  await page.getByTestId("button_run_astra db").first().click();
  await page.waitForSelector("text=built successfully", { timeout: 60000 * 2 });

  await page.getByText("built successfully").last().click({
    timeout: 30000,
  });

  await page.getByTestId("button_run_chat output").click();
  await page.waitForSelector("text=built successfully", { timeout: 60000 * 2 });

  await page.getByText("built successfully").last().click({
    timeout: 30000,
  });

  await page.getByTestId("button_run_astra db").last().click();
  await page.waitForSelector("text=built successfully", { timeout: 60000 * 2 });

  await page.getByText("built successfully").last().click({
    timeout: 30000,
  });

  await page.getByText("Playground", { exact: true }).click();

  await page.waitForSelector('[data-testid="input-chat-playground"]', {
    timeout: 100000,
  });

  await page.getByTestId("input-chat-playground").last().fill("hello");

  await page.getByTestId("icon-LucideSend").last().click();

  await page
    .getByText("This is a test file.", { exact: true })
    .last()
    .isVisible();

  await page.getByText("Memories", { exact: true }).last().click();
  await page.getByText("Default Session").last().click();

  await page.getByText("timestamp", { exact: true }).last().isVisible();
  await page.getByText("text", { exact: true }).last().isVisible();
  await page.getByText("sender", { exact: true }).last().isVisible();
  await page.getByText("sender_name", { exact: true }).last().isVisible();
  await page.getByText("session_id", { exact: true }).last().isVisible();
  await page.getByText("files", { exact: true }).last().isVisible();

  await page.getByRole("gridcell").last().isVisible();
  await page.getByTestId("icon-Trash2").first().click();

  await page.waitForSelector('[data-testid="input-chat-playground"]', {
    timeout: 100000,
  });

  await page.getByTestId("input-chat-playground").last().isVisible();
});
