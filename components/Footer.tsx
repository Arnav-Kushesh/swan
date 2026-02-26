"use client";

import { css } from "@/styled-system/css";
import Link from "next/link";
import { useGlobalConfig } from "@/components/providers/GlobalConfigProvider";

export function Footer() {
  const { config } = useGlobalConfig();
  const showSwanLink = config.info?.mention_this_tool_in_footer !== "false";

  return (
    <footer
      className={css({
        py: "32px",
        mt: "60px",
        borderTop: "1px solid token(colors.border.default)",
        textAlign: "center",
        color: "text.tertiary",
        fontSize: "0.8rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      })}
    >
      <span>Copyright © {new Date().getFullYear()} {config.info?.title || 'My Website'}</span>
      {showSwanLink && (
        <Link
          href="https://github.com/arnav-kushesh/notion-zero"
          target="_blank"
          className={css({
            color: "text.tertiary",
            transition: "color 0.2s",
            _hover: { color: "text.secondary" },
          })}
        >
          Made With Notion Zero
        </Link>
      )}
    </footer>
  );
}
