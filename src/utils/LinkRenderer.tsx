import React from "react";

function LinkRenderer({ text, className }: LinkRendererProps) {
  const userPattern = /@([A-Za-z0-9_]+)/g;
  const hashtagPattern = /#(\w+)/g;
  const linkPattern = /((https?:\/\/|www\.)[^\s]+)/g;

  // Replace usernames with links
  let html = text.replace(userPattern, (match, username: string) => {
    return `<a class="${className}" href="/user/${username}">@${username}</a>`;
  });

  // Replace hashtags with links
  html = html.replace(hashtagPattern, (match, hashtag: string) => {
    return `<a class="${className}" href="/search?term=#${hashtag}">#${hashtag}</a>`;
  });

  // Replace links with clickable anchor tags
  html = html.replace(linkPattern, (match, url: string) => {
    if (!url.startsWith("http")) {
      url = `http://${url}`;
    }
    return `<a class="${className}" href="${url}" target="_blank">${url}</a>`;
  });

  return (
    <p
      className="whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface LinkRendererProps {
  text: string;
  className: string;
  onClick: unknown;
}

export default LinkRenderer;
