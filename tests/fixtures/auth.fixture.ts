import { test as baseTest, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { LoginPage } from "../pages/LoginPage";

const AUTH_DIR = path.resolve(__dirname, "../../playwright/.auth");
const STATE_FILE = path.join(AUTH_DIR, "user.json");
const LOCK_FILE = path.join(AUTH_DIR, "user.lock");
/**
 * Checks if the session file exists and all cookies inside it are not expired.
 * 
 * @param filePath Path to the session state file
 * @returns boolean True if session is valid and not expired, false otherwise
 */
function isSessionValid(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const state = JSON.parse(raw);
    if (!state.cookies || !Array.isArray(state.cookies) || state.cookies.length === 0) {
      return false;
    }

    const nowSeconds = Date.now() / 1000;

    for (const cookie of state.cookies) {
      // Check if the cookie has an expiration date and if it is in the past
      if (cookie.expires !== undefined && cookie.expires !== -1 && cookie.expires < nowSeconds) {
        console.log(`[Auth Fixture] Session cookie '${cookie.name}' has expired (expires at: ${new Date(cookie.expires * 1000).toISOString()}).`);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("[Auth Fixture] Error parsing session file:", error);
    return false;
  }
}

/**
 * Checks if the lock file is stale (the process that created it is not running).
 * If stale, it deletes the lock file to prevent deadlock.
 */
function checkAndClearStaleLock(): void {
  if (!fs.existsSync(LOCK_FILE)) {
    return;
  }
  try {
    const pidStr = fs.readFileSync(LOCK_FILE, "utf8").trim();
    const pid = parseInt(pidStr, 10);
    if (!isNaN(pid)) {
      try {
        process.kill(pid, 0); // 0 signal only checks if process is alive without killing it
      } catch (e: any) {
        // ESRCH indicates the process is not running. Stale lock can be cleared.
        console.warn(`[Auth Fixture] Stale lock file detected (PID ${pid} is not running). Deleting lock file.`);
        fs.unlinkSync(LOCK_FILE);
      }
    }
  } catch (err) {
    // Suppress errors during stale lock check to keep execution robust
  }
}

// Extend base test to inject storageState automatically
export const test = baseTest.extend({
  storageState: async ({ browser }, use) => {
    // Ensure authentication directory exists
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    let isSessionReady = false;

    // Check if session is already valid
    if (isSessionValid(STATE_FILE)) {
      isSessionReady = true;
    }

    if (!isSessionReady) {
      checkAndClearStaleLock();

      let lockAcquired = false;
      const startTime = Date.now();
      const lockTimeout = 30000; // 30 seconds timeout to prevent infinite loops

      // Polling loop to acquire lock or wait for lock owner to finish
      while (Date.now() - startTime < lockTimeout) {
        try {
          // 'wx' flag makes writing atomic. It will throw EEXIST if file exists.
          fs.writeFileSync(LOCK_FILE, process.pid.toString(), { flag: "wx" });
          lockAcquired = true;
          break;
        } catch (err: any) {
          if (err.code !== "EEXIST") {
            throw err;
          }
        }

        // Periodically check if lock is stale during wait loop
        checkAndClearStaleLock();
        
        // Wait 500ms before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (lockAcquired) {
        try {
          // Double check if session is valid now (another worker might have completed login while we waited)
          if (!isSessionValid(STATE_FILE)) {
            console.log("[Auth Fixture] Session file missing or expired. Performing fresh login.");
            const context = await browser.newContext();
            const page = await context.newPage();
            
            const loginPage = new LoginPage(page);
            await loginPage.loginAsStandardUser();
            
            // Capture and save standard user state (cookies, localStorage)
            await context.storageState({ path: STATE_FILE });
            await context.close();
            console.log("[Auth Fixture] Session state saved successfully.");
          }
        } catch (loginError) {
          console.error("[Auth Fixture] Failed to perform login and save session state:", loginError);
          throw loginError;
        } finally {
          // Clean up the lock file
          if (fs.existsSync(LOCK_FILE)) {
            try {
              fs.unlinkSync(LOCK_FILE);
            } catch (err) {
              console.error("[Auth Fixture] Failed to delete lock file:", err);
            }
          }
        }
      } else {
        // Fallback if we timed out waiting for the lock. We login directly.
        console.warn("[Auth Fixture] Lock acquisition timed out. Falling back to fresh authentication without lock.");
        if (!isSessionValid(STATE_FILE)) {
          const context = await browser.newContext();
          const page = await context.newPage();
          const loginPage = new LoginPage(page);
          await loginPage.loginAsStandardUser();
          await context.storageState({ path: STATE_FILE });
          await context.close();
        }
      }
    }

    // Supply the state file path to the browser context
    await use(STATE_FILE);
  },
});

export { expect } from "@playwright/test";
