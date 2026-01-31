import { css } from "@/styled-system/css";
import Link from "next/link";
import { grid, flex } from "@/styled-system/patterns";
import { Post } from "@/lib/data";

interface ProjectListProps {
    projects: Post[];
    title?: string;
    viewType?: string;
}

const sectionTitleStyle = css({
    fontSize: "1.5rem",
    fontWeight: "bold",
    mb: "20px",
    color: "primary",
});

const listContainerStyle = flex({ direction: "column", gap: "20px" });

const gridContainerStyle = css({
    display: "grid",
    gridTemplateColumns: { base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
    gap: "20px",
});

const cardStyle = css({
    borderRadius: "8px",
    bg: { base: "white", _dark: "#121212" },
    border: "1px solid token(colors.border.default)",
    transition: "all 0.2s",
    display: "block",
    overflow: "hidden",
    _hover: {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
});

const imageContainerStyle = css({
    overflow: "hidden",
});

const imageStyle = css({ width: "100%", height: "100%", objectFit: "cover" });

const cardContentStyle = css({ p: "14px 20px" });

const cardTitleStyle = css({
    fontSize: "1.2rem",
    fontWeight: "bold",
    mb: "5px",
    color: "text.primary",
});

const cardDescStyle = css({
    fontSize: "0.95rem",
    color: "text.secondary",
    mb: "12px",
    lineHeight: "1.5",
});

const toolsContainerStyle = flex({ gap: "8px", flexWrap: "wrap", mb: "16px" });

const toolPillStyle = css({
    fontSize: "0.75rem",
    color: "text.secondary",
    fontWeight: "500",
    fontFamily: "mono",
    bg: "bg.secondary",
    px: "12px",
    py: "4px",
    borderRadius: "full",
});

export function ProjectList({
    projects,
    title = "Projects",
    viewType = "Grid",
}: ProjectListProps) {
    return (
        <section>
            <h2 className={sectionTitleStyle}>{title}</h2>
            <div
                className={
                    viewType === "List" ? listContainerStyle : gridContainerStyle
                }
            >
                {projects.map((project) => (
                    <Link
                        key={project.slug}
                        href={`/project/${project.slug}`}
                        className={cardStyle}
                    >
                        {/* Image */}
                        {project.thumbnail && (
                            <div
                                className={imageContainerStyle}
                                style={{ height: viewType === "List" ? "200px" : "180px" }}
                            >
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className={imageStyle}
                                />
                            </div>
                        )}
                        <div className={cardContentStyle}>
                            <h3 className={cardTitleStyle}>{project.title}</h3>
                            <p className={cardDescStyle}>{project.description}</p>
                            {/* <div className={toolsContainerStyle}>
                                {project.tools
                                    ? project.tools.split(",").map((tool) => (
                                        <span key={tool} className={toolPillStyle}>
                                            {tool.trim()}
                                        </span>
                                    ))
                                    : null}
                            </div> */}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
