import { render, screen } from "@testing-library/react";
import RepositoriesSummary from "../RepositoriesSummary";

describe("<RepositoriesSummary />", () => {
  test("displays information about the repository", () => {
    const repository = {
      language: "Javascript",
      stargazers_count: 5,
      forks: 30,
      open_issues: 3,
    };

    render(<RepositoriesSummary repository={repository} />);

    // expect(screen.getByText("Javascript")).toBeInTheDocument();
    // expect(screen.getByText("5")).toBeInTheDocument();
    // expect(screen.getByText("30 Forks")).toBeInTheDocument();
    // expect(screen.getByText("3 issues need help")).toBeInTheDocument();

    for (let key in repository) {
      const value = repository[key];
      const element = screen.getByText(new RegExp(`\\b${value}\\b`));

      expect(element).toBeInTheDocument();
    }
  });
});
