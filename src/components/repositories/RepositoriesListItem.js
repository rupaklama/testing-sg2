import { Link } from "react-router-dom";
import FileIcon from "../tree/FileIcon";
import RepositoriesSummary from "./RepositoriesSummary";
import { MarkGithubIcon } from "@primer/octicons-react";

function RepositoriesListItem({ repository }) {
  const { full_name, language, description, owner, name, html_url } = repository;

  return (
    <div className="py-3 border-b flex">
      <FileIcon name={language} className="shrink w-6 pt-1" />

      <div>
        <div className="flex items-center">
          <Link to={`/repositories/${full_name}`} className="text-xl mr-4">
            {owner.login}/<span className="font-bold">{name}</span>
          </Link>

          <span>
            <a href={html_url} aria-label="github repository" target="_blank" rel="noopener noreferrer">
              <MarkGithubIcon />
            </a>
          </span>
        </div>

        <p className="text-gray-500 italic py-1">{description}</p>
        <RepositoriesSummary repository={repository} />
      </div>
    </div>
  );
}

export default RepositoriesListItem;
