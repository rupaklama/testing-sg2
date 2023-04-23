import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { setupServer } from "msw/node";
import { rest } from "msw";

import HomeRoute from "../HomeRoute";

const handlers = [
  rest.get("/api/repositories", (req, res, ctx) => {
    // note - access query params with 'req.url.searchParams.get()'
    const language = req.url.searchParams.get("q").split("language:")[1];
    // console.log(language);

    return res(
      // mock json data
      ctx.json({
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => server.close());

describe("<HomeRoute />", () => {
  test("renders two links for each language in a table", async () => {
    render(
      <MemoryRouter>
        <HomeRoute />
      </MemoryRouter>
    );

    // await pauseWhileAsyncUpdate();
    // screen.debug();

    // loop over each language
    const languages = ["javascript", "typescript", "rust", "go", "python", "java"];

    for (let language of languages) {
      const links = await screen.findAllByRole("link", {
        // dynamic reg expression with partial matcher
        name: new RegExp(`${language}_`),
      });

      // make sure we see two links for each language
      expect(links).toHaveLength(2);

      // assert that the links have the appropriate full_name
      expect(links[0]).toHaveTextContent(`${language}_one`);
      expect(links[1]).toHaveTextContent(`${language}_two`);

      // assert that the links have the correct href
      expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
      expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
    }
  });

  // helper func to pause test execution while promise gets resolved to see the output
  const pauseWhileAsyncUpdate = () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
});
