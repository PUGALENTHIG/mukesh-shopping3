import React from "react";

function UserLinkRenderer({ text, className }: UserLinkRendererProps) {
  const userPattern = /@([A-Za-z0-9_]+)/g;
  const html = text.replace(userPattern, (match, username) => {
    return `<a class="${className}" href="user/${username}">@${username}</a>`;
  });

  return (
    <p
      className="whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface UserLinkRendererProps {
  text: string;
  className: string;
  onClick: unknown;
}

export default UserLinkRenderer;
