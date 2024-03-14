const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const os = require("os");
const path = require("path");

exports.sendInvoice = async (product) => {
  let alltotal = 0;
  let grandtotal = 0;

  product.forEach((item) => {
    alltotal += item.qty * item.rate;
  });

  grandtotal = alltotal + (alltotal * 18) / 100;

  try {
    const htmlTemplate = `<div
      style="
        display: flex;
        flex-direction: column;
        margin: 0 2.5rem;
        gap: 3rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
          sans-serif;
      "
    >
      <div style="display: flex; justify-content: space-between">
        <div>
          <h2 style="margin-bottom: 7px">
            <strong>INVOICE GENERATOR</strong>
          </h2>
          <span>Sample Output should be this</span>
        </div>
        <div>
          <h2 style="margin-bottom: 7px; font-weight: 500">levition</h2>
          <span>infotech</span>
        </div>
      </div>
      <table
        style="
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
          width: 100%;
          border-collapse: collapse;
        "
      >
        <thead>
          <tr>
            <th style="font-weight: bold; border-bottom: 1px solid #ebebeb;">Product Name</th>
            <th style="font-weight: bold; border-bottom: 1px solid #ebebeb;">Qty</th>
            <th style="font-weight: bold; border-bottom: 1px solid #ebebeb;">Rate</th>
            <th style="font-weight: bold; border-bottom: 1px solid #ebebeb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${product
            .map(
              (item, index) => `
            <tr key=${index} style="border-bottom: 1px solid #ebebeb;">
              <td>${item.name}</td>
              <td style="color: #7f88bd;">${item.qty}</td>
              <td>${item.rate}</td>
              <td>INR ${alltotal}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div style="border-top: 2px solid #ebebeb; margin-top: 1.5rem">
        <div
          style="
            display: flex;
            float: right;
            flex-direction: column;
            gap: 1rem;
            width: 40%;
            margin-top: 1rem;
          "
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <span style="font-weight: bold">Total</span><span>INR ${alltotal}</span>
          </div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <span>GST</span><span style="color: rgb(180, 180, 180)">18%</span>
          </div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1rem 0;
              border-bottom: 2px solid #ebebeb;
              border-top: 2px solid #ebebeb;
            "
          >
            <span style="font-weight: bold">Grand Total</span
            ><span style="color: #7f88bd">₹ ${grandtotal}</span>
          </div>
        </div>
      </div>
    </div>
    <footer
      style="
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
          sans-serif;margin-top: 5rem;
      "
    >
      <div style="font-size: 14px;padding-left: 2rem;margin-left:2rem;">
        <span style="font-weight: bold">Valid Until</span>: 12/04/23
      </div>
      <div style="background-color: #2d2c2c; color: white; padding: 1px 3rem;border-radius: 50px;margin: 0 1rem;">
        <p style="background-color: #2d2c2c; margin-bottom: 0; font-weight: bold; font-size: 14px">
          Terms and Conditions
        </p>
        <p style="background-color: #2d2c2c; margin-top: 0; font-size: 13px">
          We are happy to supply any further information you need and trust that
          you call on us to fill your order, which will receive our prompt and
          careful attention.
        </p>
      </div>
    </footer>`;

    const browser = await puppeteer.launch({
      // headless:false,
      userDataDir: join(__dirname, ".cache", `puppeteer`, `${Date.now()}`),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // Remove the temporary user data directory
    fs.rmdirSync(join(__dirname, ".cache", `puppeteer`, `${Date.now()}`), {
      recursive: true,
      // force: true,
    });
    return pdfBuffer;
  } catch (error) {
    console.error("Error sending invoice:", error);
    throw error;
  }
};
