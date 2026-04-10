import { useEffect, useRef, useState } from "react";
import { siteConfig } from "./siteConfig";

const SOURCE_URL = "/gymate/home2-source.html";
const LOCAL_ASSET_BASE = "/gymate/assets/";
const ASSET_PREFIXES = [
  "Home%202%20%E2%80%93%20gymate_files/",
  "Home 2 – gymate_files/",
];
const DEMO_BASE_URL = "https://radiustheme.com/demo/wordpress/themes/gymat";
const SOCIAL_ICON_MAP = [
  { iconClass: "fa-facebook-f", network: "facebook" },
  { iconClass: "fa-x-twitter", network: "twitter" },
  { iconClass: "fa-linkedin-in", network: "linkedin" },
  { iconClass: "fa-instagram", network: "instagram" },
];
const EXECUTABLE_SCRIPT_TYPES = new Set([
  "",
  "text/javascript",
  "application/javascript",
  "module",
]);
const BLOCKED_HEAD_RELS = new Set([
  "alternate",
  "canonical",
  "edituri",
  "https://api.w.org/",
  "profile",
  "shortlink",
]);

function rewriteAssetPaths(value = "") {
  return ASSET_PREFIXES.reduce(
    (result, prefix) => result.split(prefix).join(LOCAL_ASSET_BASE),
    value,
  );
}

function parseHtmlAttribute(source, attributeName) {
  const match = source.match(
    new RegExp(`${attributeName}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"),
  );

  return match?.[2] ?? match?.[3] ?? "";
}

function extractSourceParts(rawHtml) {
  const htmlMatch = rawHtml.match(/<html([^>]*)>/i);
  const headMatch = rawHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = rawHtml.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!htmlMatch || !headMatch || !bodyMatch) {
    throw new Error("Unable to parse the saved Gymate HTML.");
  }

  const headTemplate = document.createElement("template");
  headTemplate.innerHTML = rewriteAssetPaths(headMatch[1]);

  const bodyTemplate = document.createElement("template");
  bodyTemplate.innerHTML = rewriteAssetPaths(bodyMatch[2]);

  const title = headTemplate.content.querySelector("title")?.textContent || "";
  const headScripts = [...headTemplate.content.querySelectorAll("script")];
  const bodyScripts = [...bodyTemplate.content.querySelectorAll("script")];

  headScripts.forEach((script) => script.remove());
  bodyScripts.forEach((script) => script.remove());

  return {
    bodyAttributes: bodyMatch[1],
    bodyHtml: bodyTemplate.innerHTML,
    headNodes: [...headTemplate.content.children],
    htmlAttributes: htmlMatch[1],
    scripts: [...headScripts, ...bodyScripts],
    title,
  };
}

function shouldCloneHeadNode(node) {
  const tagName = node.tagName?.toLowerCase();

  if (tagName === "style") {
    return true;
  }

  if (tagName !== "link") {
    return false;
  }

  const rel = (node.getAttribute("rel") || "").toLowerCase();

  if (BLOCKED_HEAD_RELS.has(rel)) {
    return false;
  }

  return (
    rel === "stylesheet"
  );
}

function cloneNodeWithRewrittenAttributes(node) {
  const clone = document.createElement(node.tagName.toLowerCase());

  for (const attribute of node.attributes) {
    clone.setAttribute(attribute.name, rewriteAssetPaths(attribute.value));
  }

  if (node.textContent) {
    clone.textContent = rewriteAssetPaths(node.textContent);
  }

  clone.dataset.gymateManaged = "true";
  return clone;
}

function applyBodyAttributes(sourceBody) {
  const previous = {
    className: document.body.className,
    dataset: { ...document.body.dataset },
  };

  document.body.className = sourceBody.className;

  for (const key of Object.keys(document.body.dataset)) {
    delete document.body.dataset[key];
  }

  for (const [key, value] of Object.entries(sourceBody.dataset)) {
    document.body.dataset[key] = value;
  }

  return () => {
    document.body.className = previous.className;

    for (const key of Object.keys(document.body.dataset)) {
      delete document.body.dataset[key];
    }

    for (const [key, value] of Object.entries(previous.dataset)) {
      document.body.dataset[key] = value;
    }
  };
}

function applyHtmlAttributes({ lang, dir, title }) {
  const previous = {
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    title: document.title,
  };

  document.documentElement.lang = lang || "en-US";
  document.documentElement.dir = dir || "";
  document.title = title || previous.title;

  return () => {
    document.documentElement.lang = previous.lang;
    document.documentElement.dir = previous.dir;
    document.title = previous.title;
  };
}

function getConfiguredSocialLink(network) {
  return (siteConfig.socialLinks[network] || "").trim();
}

function findSocialNetwork(anchor) {
  return SOCIAL_ICON_MAP.find(({ iconClass }) =>
    anchor.querySelector(`.${iconClass}`),
  )?.network;
}

function isExternalUrl(value) {
  if (!value || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(value, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function sanitizeHref(value) {
  if (!value) {
    return "#";
  }

  try {
    const url = new URL(value, window.location.origin);

    if (url.origin === window.location.origin) {
      return url.pathname === "/home-2/" ? "/" : url.pathname + url.search + url.hash;
    }

    if (url.href.startsWith(DEMO_BASE_URL)) {
      return url.pathname === "/demo/wordpress/themes/gymat/" ||
        url.pathname === "/demo/wordpress/themes/gymat/home-2/"
        ? "/"
        : "#";
    }

    return "#";
  } catch {
    return value;
  }
}

function sanitizeInjectedMarkup(root) {
  const anchors = root.querySelectorAll("a[href]");

  anchors.forEach((anchor) => {
    const socialNetwork = findSocialNetwork(anchor);

    if (socialNetwork) {
      const configuredUrl = getConfiguredSocialLink(socialNetwork);

      anchor.setAttribute("href", configuredUrl || "#");

      if (configuredUrl) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noreferrer");
      } else {
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
      }

      return;
    }

    const href = anchor.getAttribute("href") || "";

    if (isExternalUrl(href)) {
      anchor.dataset.originalHref = href;
      anchor.setAttribute("href", sanitizeHref(href));
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
    }
  });

  root.querySelectorAll("form[action]").forEach((form) => {
    const action = form.getAttribute("action") || "";

    if (isExternalUrl(action)) {
      form.dataset.originalAction = action;
      form.setAttribute("action", "/");
    }
  });
}

async function appendScriptInOrder(scriptNode, managedNodes) {
  const clone = cloneNodeWithRewrittenAttributes(scriptNode);
  managedNodes.push(clone);

  const type = (scriptNode.getAttribute("type") || "").toLowerCase();
  const src = clone.getAttribute("src");

  if (!src) {
    document.body.appendChild(clone);
    return;
  }

  clone.async = false;

  await new Promise((resolve) => {
    clone.addEventListener("load", resolve, { once: true });
    clone.addEventListener("error", resolve, { once: true });
    document.body.appendChild(clone);
  });

  if (!EXECUTABLE_SCRIPT_TYPES.has(type)) {
    return;
  }
}

export default function App() {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;
    let restoreBody = () => {};
    let restoreHtml = () => {};
    const managedNodes = [];

    const cleanup = () => {
      for (let index = managedNodes.length - 1; index >= 0; index -= 1) {
        managedNodes[index].remove();
      }

      managedNodes.length = 0;

      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }

      restoreBody();
      restoreHtml();
    };

    async function loadPage() {
      try {
        const response = await fetch(SOURCE_URL);

        if (!response.ok) {
          throw new Error(`Failed to load source HTML: ${response.status}`);
        }

        const sourceHtml = await response.text();
        const sourceParts = extractSourceParts(sourceHtml);
        const bodyShell = new DOMParser().parseFromString(
          `<!doctype html><html><body ${sourceParts.bodyAttributes}></body></html>`,
          "text/html",
        );

        restoreHtml = applyHtmlAttributes({
          dir: parseHtmlAttribute(sourceParts.htmlAttributes, "dir"),
          lang: parseHtmlAttribute(sourceParts.htmlAttributes, "lang"),
          title: sourceParts.title,
        });
        restoreBody = applyBodyAttributes(bodyShell.body);

        sourceParts.headNodes.forEach((node) => {
          if (!shouldCloneHeadNode(node)) {
            return;
          }

          const clone = cloneNodeWithRewrittenAttributes(node);
          managedNodes.push(clone);
          document.head.appendChild(clone);
        });

        if (!mountRef.current) {
          return;
        }

        mountRef.current.innerHTML = sourceParts.bodyHtml;
        sanitizeInjectedMarkup(mountRef.current);

        for (const script of sourceParts.scripts) {
          if (disposed) {
            return;
          }

          await appendScriptInOrder(script, managedNodes);
        }

        if (!disposed) {
          setStatus("ready");
        }
      } catch (loadError) {
        cleanup();

        if (!disposed) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load the saved Gymate page.",
          );
          setStatus("error");
        }
      }
    }

    loadPage();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  if (status === "error") {
    return (
      <div className="gymate-status">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && (
        <div className="gymate-status">
          <p>Loading Gymate page...</p>
        </div>
      )}
      <div
        id="gymate-app"
        ref={mountRef}
        style={{ display: status === "ready" ? "contents" : "none" }}
      />
    </>
  );
}
