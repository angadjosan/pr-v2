"use client";

import Image from "next/image";
import { ProjectInfo } from "@/lib/types";
import { AccordionContent } from "./accordion";
import { AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import Link from "next/link";
import { useSession } from "@/lib/sessionContext";
import { EventType } from "@/lib/types";

export default function ProjectRow({
  idx,
  projectInfo,
}: {
  idx: number;
  projectInfo: ProjectInfo;
}) {
  const { submitEvent } = useSession();

  const handleProjectClick = (type: "logo" | "link") => {
    const metadata = {
      project_name: projectInfo.projectName,
    };

    switch (type) {
      case "logo":
        submitEvent(EventType.ProjectLogoClicked, metadata);
        break;
      case "link":
        submitEvent(EventType.ProjectLinkClicked, metadata);
        break;
      default:
        break;
    }
  };

  return (
    <AccordionItem
      value={"project-" + idx.toString()}
      className="flex flex-col gap-4"
      onFocus={(e) => {
        // Check if the accordion item is being expanded
        const isExpanded =
          (e.target as HTMLElement).getAttribute("data-state") === "open";
        if (isExpanded) {
          submitEvent(EventType.ProjectExpanded, {
            project_name: projectInfo.projectName,
            project_link: projectInfo.projectLink || "",
          });
        }
      }}
    >
      <div className="flex flex-row gap-4 items-center">
        {/* Image container */}
        {(projectInfo.projectLogoUrl || projectInfo.customLogo) && (
          <div className="relative h-12 aspect-square">
            {projectInfo.customLogo ||
              (projectInfo.projectLogoUrl && (
                <Link
                  href={projectInfo.projectLink || ""}
                  target="_blank"
                  onClick={() => handleProjectClick("logo")}
                >
                  <Image
                    src={projectInfo.projectLogoUrl}
                    alt="Company logo"
                    layout="fill"
                    className="rounded-lg shadow-lg shadow-slate-200 dark:shadow-black transition hover:scale-110 ease-in-out bg-rose-200 dark:bg-rose-950"
                  />
                </Link>
              ))}
          </div>
        )}
        {/* Company info */}
        <AccordionTrigger className="flex flex-col w-full text-start">
          <div className="flex flex-row gap-4 justify-between items-baseline w-full">
            {projectInfo.projectLink ? (
              <Link
                className="text-slate-700 dark:text-slate-200 font-semibold sm:text-lg transition ease-in-out hover:scale-110 hover:text-blue-500 dark:hover:text-blue-400"
                href={projectInfo.projectLink || ""}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectClick("link");
                }}
              >
                {projectInfo.projectName}
              </Link>
            ) : (
              <div className="text-slate-700 dark:text-slate-200 font-semibold sm:text-lg">
                {projectInfo.projectName}
              </div>
            )}
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            {projectInfo.projectCaption}
          </div>
        </AccordionTrigger>
      </div>
      {(projectInfo.description ||
        projectInfo.listDescription ||
        projectInfo.tags) && (
        <AccordionContent className="text-slate-700 dark:text-slate-300">
          <div>{projectInfo.description}</div>
          {projectInfo.listDescription && (
            <ul className="list-disc pl-8">
              {projectInfo.listDescription.map((desc, idx) => (
                <li key={idx}>{desc}</li>
              ))}
            </ul>
          )}
          {projectInfo.tags && (
            <div className="flex flex-row gap-2 flex-wrap mt-4">
              {projectInfo.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs transition ease-in-out hover:scale-110 font-semibold text-slate-500 dark:text-slate-400"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      )}
    </AccordionItem>
  );
}
