const puppeteer = require('puppeteer');
require('dotenv').config();
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //This tests for strength of password enforced on user Signup page.
    async function test1() {

        await page.goto('http://localhost:5173/auth/signup');
        await page.type('input[name="email"]', 'email@example.com');
        await page.type('input[name="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForNavigation();
        await page.waitForSelector('.error-message');

        const errorMessage = await page.$eval('.error-message', el => el.textContent);
        if (errorMessage.includes('Password must contain at least one UpperCase character')) {
            console.log('Test passed: Error message appeared as expected');
        } else {
            console.error('Test failed: Error message did not appear as expected');
        }
    }
    //This test that when a user logs in with their email and correct password, then a call to action for MFA will appear on the page.
    async function test2() {

        await page.goto('http://localhost:5173/auth/login');
        await page.type('input[name="email"]', process.env.EMAIL);
        await page.type('input[name="password"]', process.env.PASSWORD);
        await page.click('button[type="submit"]');

        await page.waitForSelector('.confirm-message');

        const confirmMessage = await page.$eval('.confirm-message', el => el.textContent);
        if (confirmMessage.includes('A 4 digit code has been sent to your email')) {
            console.log('Test passed: confirm message appeared');
        } else {
            console.error('Test failed: MFA code message did not appear as expected.');
        }
    }
    //This test is End-to-End. A user will login with their email and password, the tester will input on the CLI the correct MFA code and the test will proceed to the 'yourdata' page and test that when expense is increased, then the bottom line will decrease.
    async function test3() {
        await page.goto('http://localhost:5173/auth/login');
        await page.type('input[name="email"]', process.env.EMAIL);
        await page.type('input[name="password"]', process.env.PASSWORD);
        await page.click('button[type="submit"]');

        try {
                    await page.waitForSelector('.confirm-message');
                    let login_one = false;
            
                    const confirmMessage = await page.$eval('.confirm-message', el => el.textContent);
                    if (confirmMessage.includes('A 4 digit code has been sent to your email')) {
                        console.log('puppeter first step login');
                        login_one = true;
            
                    } else {
                        console.error('Test failed: MFA code message did not appear as expected.');
                        return;
                    }
                    if (login_one) {
            
                        const secretValue = await new Promise((resolve) => {
                            const realine = require('readline');
                            const r1 = realine.createInterface({ input: process.stdin, output: process.stdout });
                            r1.question('MFA code: ', (answer) => {
                                r1.close();
                                resolve(answer.trim());
                            });
            
                        })
                        await page.type('input[name="Code"]', secretValue.toString());
                        await page.click('button[name="mfa-button"]');
                        await page.waitForSelector('#your_data_link');
                        await page.click('#your_data_link');
                        await page.waitForSelector('input[name="incrementer"]');
                        await page.waitForSelector('#disposable_value');
                        const firstValue = await page.$eval('#disposable_value', el => el.textContent);
                        await page.type('input[name="incrementer"]', "10");
                        await page.click('button[name="enter_expense_btn"]');
                        await page.waitForNavigation();
                        await page.waitForSelector('#disposable_value');
                        const secondValue = await page.$eval('#disposable_value', el => el.textContent);
                        const testPass = Number(secondValue) < Number(firstValue);
                        if (testPass) {
                            console.log("successfully logged in with MFA, and tested that increasing expense will decrease disposable income");
                        } else {
                            console.log("successfully logged in with MFA, but dashboard malfunction");
                        }
                    }
        } catch(e) {
            console.error(e.message);
        }

    }
    await test1();
    await test2();
    await test3();

    await browser.close();
})();