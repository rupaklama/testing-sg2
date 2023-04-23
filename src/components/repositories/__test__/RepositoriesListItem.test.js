import { render, screen, act } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import RepositoriesListItem from "../RepositoriesListItem";

// SECOND CHOICE - interaction between the FileIcon module & RepositoriesListItem is untested on doing this
// note - mocking FileIcon module to avoid rendering the troublesome component in our test
// Need a relative path to the module so that we can render it with custom mock data
// It means DO NOT go & import actual FileIcon component at all in our test instead use custom mock module below
// jest.mock("../../tree/FileIcon", () => {
//   // mock data of FileIcon.js, displays text instead of rendering real FileIcon component
//   return () => {
//     return "File Icon Component";
//   };
// });

describe("<RepositoriesListItem />", () => {
  const renderComponent = () => {
    const repository = {
      full_name: "facebook/react",
      language: "javascript",
      description: "a js library",
      owner: {
        login: "facebook",
      },
      name: "react",
      html_url: "https://github.com/facebook/react",
    };

    render(
      // RepositoriesListItem uses Link from Router Context
      // Using low-level router to wrap up with to avoid issues
      // A memory router manages its own history stack in memory
      // It's primarily useful for testing
      <MemoryRouter>
        <RepositoriesListItem repository={repository} />
      </MemoryRouter>
    );

    return { repository };
  };

  // helper func to pause test execution while promise gets resolved to see the output
  const pauseWhileAsyncUpdate = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  };

  test("displays a link to the github homepage for this repository", async () => {
    const { repository } = renderComponent();

    // note - Act Warning Debugging
    // screen.debug(); - before
    // await pauseWhileAsyncUpdate(); - wait promise to resolve
    // screen.debug(); - after

    // FIRST CHOICE - Preferred Solution
    // note - need to await icon which is using promise
    await screen.findByRole("img", { name: "javascript" });

    const link = screen.getByRole("link", { name: /github repository/i });
    expect(link).toHaveAttribute("href", repository.html_url);

    // LAST CHOICE - If the best approaches, don't work at all as a last resort
    // NOTE - Always try to avoid using 'act'
    // act() - opens a window time for promise to resolve
    // await act(async () => {
    //   await pauseWhileAsyncUpdate();
    // });
  });

  test("displays a fileIcon with the appropriate icon", async () => {
    renderComponent();

    const icon = await screen.findByRole("img", { name: "javascript" });
    expect(icon).toHaveClass("js-icon");
  });

  test("displays a link to the code editor page", async () => {
    const { repository } = renderComponent();

    await screen.findByRole("img", { name: "javascript" });

    const link = await screen.findByRole("link", { name: new RegExp(repository.owner.login) });
    expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
  });
});
