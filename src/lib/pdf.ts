import puppeteer from "puppeteer";

export async function generateCarouselPdf(slides: string[]) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set viewport to a typical carousel slide aspect ratio (e.g., 1080x1350 vertical or 1080x1080 square)
    // LinkedIn carousels are often documents, A4 or square. Let's send square for now or 4:5.
    // We'll generate a single PDF with multiple pages.

    // HTML Content generation
    const htmlContent = `
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; }
          .slide { 
            width: 800px; 
            height: 1000px; 
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
        height: "1000px",
        printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdfBuffer).toString("base64");
}
