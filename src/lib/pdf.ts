import puppeteer from "puppeteer";

export async function generateCarouselPdf(slides: string[]) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const htmlContent = `
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; }
          .slide { 
            width: 800px; 
            height: 800px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            background: linear-gradient(135deg, #2e026d 0%, #15162c 100%); 
            color: white; 
            font-size: 32px; 
            text-align: center;
            padding: 40px;
            box-sizing: border-box;
            page-break-after: always;
          }
          .slide:last-child { page-break-after: auto; }
          h1 { font-size: 48px; margin-bottom: 20px; }
          p { font-size: 28px; line-height: 1.5; }
        </style>
      </head>
      <body>
        ${slides
      .map(
        (slide) => `
          <div class="slide">
            <div>
              ${slide}
            </div>
          </div>
        `
      )
      .join("")}
      </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({
    width: "800px",
    height: "800px",
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer).toString("base64");
}
