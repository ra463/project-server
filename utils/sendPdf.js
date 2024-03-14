const pdf = require("html-pdf-node");

exports.sendInvoice = async (product) => {
  let alltotal = 0;
  let grandtotal = 0;

  product.forEach((item) => {
    alltotal += item.quantity * item.price;
  });

  grandtotal = alltotal + (alltotal * 18) / 100;

  return new Promise(async (resolve, reject) => {
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
        <div
          style="
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
              Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
              sans-serif;
          "
        >
          <ul
            style="
              padding-left: 0;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #ebebeb;
              padding-bottom: 1rem;
            "
          >
            <li style="font-weight: bold; list-style: none">Product Name</li>
            <li style="font-weight: bold; list-style: none">Qty</li>
            <li style="font-weight: bold; list-style: none">Rate</li>
            <li style="font-weight: bold; list-style: none">Total</li>
          </ul>
          ${product
            .map(
              (item, index) => `
            <ul
              key=${index}
              style="
                padding-left: 0;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                margin-bottom: 2rem;
              "
            >
              <li style="list-style: none">${item.name}</li>
              <li style="list-style: none; color: #7f88bd">${item.quantity}</li>
              <li style="list-style: none">${item.price}</li>
              <li style="list-style: none">INR ${item.total}</li>
            </ul>
          `
            )
            .join("")}
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
      </div>
      <footer
        style="
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;margin-top: 3rem;
        "
      >
        <div style="font-size: 14px;padding-left: 2rem;margin-bottom: 1rem;">
          <span style="font-weight: bold">Valid Until</span>: 12/04/23
        </div>
        <div style="background: rgb(57, 56, 56); color: white; padding: 1px 3rem;border-radius: 50px;margin: 0 2rem;">
          <p style="margin-bottom: 0; font-weight: bold; font-size: 14px">
            Terms and Conditions
          </p>
          <p style="margin-top: 0; font-size: 13px">
            We are happy to supply any further information you need and trust that
            you call on us to fill your order, which will receive our prompt and
            careful attention.
          </p>
        </div>
      </footer>`;

      const options = { format: "A4" };
      const file = { content: htmlTemplate };
      const pdfBuffer = await pdf.generatePdf(file, options);

      resolve(pdfBuffer);
    } catch (error) {
      console.error("Error sending invoice:", error);
      reject(error);
    }
  });
};
