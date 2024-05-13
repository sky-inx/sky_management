import fs from "fs";

export default async function handler(req, res) {
  const data = JSON.parse(req?.body || "{}");
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data?.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>

  <body class="bg-gray-50  min-h-screen h-full ring-4 ring-red-500 w-screen flex items-start justify-center">
    <main class="w-full bg-white p-8 rounded-lg space-y-4">
      <h1
        class="flex h-14 items-center justify-start rounded-xl border-4 border-double border-red-700 !bg-red-700/10 px-4 text-lg font-semibold text-red-700"
      >
        ${data?.name}
      </h1>
      <div class="flow-root rounded-xl border-4 border-double border-red-700">
        <table class="min-w-full">
          <tbody class="[&>tr>th]:!font-extrabold">
            <tr class="h-12 border-b border-red-700 text-black">
              <th
                scope="col"
                class="px-4 py-3 text-left text-md font-semibold"
              >
                Pigment
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-right text-md font-semibold"
              >
                Percentage
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-right text-md font-semibold"
              >
                Price
              </th>
            </tr>
            ${data?.pigments
              ?.map((item) => {
                return `<tr class="border-b border-gray-200">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">
                ${item.name}
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-500">
                ${item.percentage}
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-500">
                  ${item.price}
              </td>
            </tr>`;
              })
              .join("")}

            <tr class="h-0 border-b-4 border-double border-red-700"></tr>
            <tr class="h-12 border-b border-red-700 text-black">
              <th
                scope="col"
                class="px-4 py-3 text-left text-md font-semibold"
              >
                Product
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-right text-md font-semibold"
              >
                Percentage
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-right text-md font-semibold"
              >
                Price
              </th>
            </tr>
            ${data?.products
              ?.map((item) => {
                return `<tr class="border-b border-gray-200">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">
                ${item.name}
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-500">
                ${item.percentage}
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-500">
                ${item.price}
              </td>
            </tr>`;
              })
              .join("")}
            <tr class="h-0 border-b-4 border-double border-red-700"></tr>
            <tr class="h-12">
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-black"
              >
                Total
              </th>
              <th
                class="px-4 py-3  text-right text-sm font-semibold text-black"
              >
                ${data?.percentage}
              </th>
              <th
                class="px-4 py-3  text-right text-sm font-semibold text-black"
              >
                ${data?.price}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </body>
</html>
`.replaceAll("\n", "");

  const buffer = Buffer.from(html, "utf8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.setHeader("Access-Control-Max-Age", "1728000");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${data?.name}.html`,
  );
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Length", buffer.length);
  res.end(buffer);
  return res;
}
