import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import providers from "./providers.js";

const REGISTRY_OWNER = "stripe";
const REGISTRY_REPO = "projects-template-registry";
const REGISTRY_REF = "main";
const REGISTRY_API_BASE = `https://api.github.com/repos/${REGISTRY_OWNER}/${REGISTRY_REPO}`;
const REGISTRY_RAW_BASE = `https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/${REGISTRY_REF}`;
const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "projects-site",
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(__dirname, "../../.cache");
const CACHE_FILE = path.join(CACHE_DIR, "templates-registry.json");
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function readCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) return cached.data;
  } catch {
    // corrupt cache — ignore
  }
  return null;
}

function writeCache(data) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ timestamp: Date.now(), data }),
    );
  } catch {
    // non-critical — skip silently
  }
}

const PROVIDER_NAME_OVERRIDES = {
  e2b: "E2B",
  openrouter: "OpenRouter",
  auth0: "Auth0",
  flyio: "Fly.io",
};

const ASSET_SOURCES = [
  {
    dir: new URL("../assets/images/svg/provider-icons/", import.meta.url),
    urlPrefix: "/assets/images/svg/provider-icons/",
  },
  {
    dir: new URL("../assets/images/svg/provider-logos/", import.meta.url),
    urlPrefix: "/assets/images/svg/provider-logos/",
  },
];

const providerNameMap = new Map(
  providers.map((provider) => [provider.slug.split("/")[0], provider.name]),
);

function titleCase(value) {
  return String(value)
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getProviderName(providerSlug) {
  return (
    PROVIDER_NAME_OVERRIDES[providerSlug] ||
    providerNameMap.get(providerSlug) ||
    titleCase(providerSlug)
  );
}

function getProviderInitials(name) {
  const parts = String(name).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function getProviderIconUrl(providerSlug) {
  for (const source of ASSET_SOURCES) {
    const assetUrl = new URL(`${providerSlug}.svg`, source.dir);
    if (fs.existsSync(assetUrl)) {
      return `${source.urlPrefix}${providerSlug}.svg`;
    }
  }

  return null;
}

function getRepoRootUrl(repoUrl) {
  if (!repoUrl) return "";
  const match = repoUrl.match(/^(https:\/\/github\.com\/[^/]+\/[^/]+)/i);
  return match ? match[1] : repoUrl;
}

function normalizeTags(tags = []) {
  const seen = new Set();
  return tags.filter(Boolean).filter((tag) => {
    const key = String(tag).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createServiceItem(serviceSlug) {
  const [providerSlug, ...serviceParts] = String(serviceSlug).split("/");
  const providerName = getProviderName(providerSlug);

  return {
    slug: serviceSlug,
    providerSlug,
    providerName,
    serviceName: serviceParts.join("/"),
    iconUrl: getProviderIconUrl(providerSlug),
    fallbackInitials: getProviderInitials(providerName),
  };
}

function sortVariants(left, right) {
  if (left.isDefault !== right.isDefault) {
    return left.isDefault ? -1 : 1;
  }

  return left.variantId.localeCompare(right.variantId);
}

function sortFamilies(left, right) {
  return left.name.localeCompare(right.name);
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: GITHUB_HEADERS });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { headers: GITHUB_HEADERS });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${url}`);
  }
  return response.text();
}

/*
 * The home page carousel leads with this template; /templates keeps the plain
 * alphabetical order. Applied outside the cached payload below, so a cache
 * written before this existed still gets the ordering rather than serving a
 * shape the carousel cannot read.
 */
const CAROUSEL_LEAD = "Shopify Trending Products";

function withCarousel(result) {
  const families = result.families ?? [];
  const lead = families.filter((family) => family.name === CAROUSEL_LEAD);
  return {
    ...result,
    carousel: [...lead, ...families.filter((family) => family.name !== CAROUSEL_LEAD)],
  };
}

export default async function () {
  const cached = readCache();
  if (cached) return withCarousel(cached);

  const tree = await fetchJson(`${REGISTRY_API_BASE}/git/trees/${REGISTRY_REF}?recursive=1`);
  const guidedRaw = await fetchText(`${REGISTRY_RAW_BASE}/guided.yaml`);
  const guided = yaml.load(guidedRaw) || {};
  const guidedCategories = new Map(
    (guided.categories || []).map((category) => [category.key, category]),
  );

  const manifestPaths = (tree.tree || [])
    .map((entry) => entry.path)
    .filter((path) => path && /\.(yaml|yml)$/i.test(path))
    .filter((path) => path !== "guided.yaml" && path !== "example/example.yaml")
    .sort((left, right) => left.localeCompare(right));

  const manifestTexts = await Promise.all(
    manifestPaths.map(async (path) => ({
      path,
      source: await fetchText(`${REGISTRY_RAW_BASE}/${path}`),
    })),
  );

  const variants = manifestTexts.map(({ path, source }) => {
    const manifest = yaml.load(source);

    if (!manifest?.template || !manifest?.variant || !manifest?.metadata?.name) {
      throw new Error(`Registry manifest is missing required fields: ${path}`);
    }

    const [owner = "", templateSlug = ""] = String(manifest.template).split("/");
    const ownerSlug = owner.toLowerCase();
    const templatePathSlug = templateSlug.toLowerCase();
    const routeUrl = `/templates/${ownerSlug}/${templatePathSlug}/`;
    const variantSlug = String(manifest.variant).toLowerCase();
    const services = (manifest.services || []).map(createServiceItem);
    const categoryKey = manifest.guided?.category || "other";
    const frameworkKey = manifest.guided?.framework || "other";
    const categoryLabel = guidedCategories.get(categoryKey)?.label || titleCase(categoryKey);

    return {
      templateId: manifest.template,
      variantId: manifest.variant,
      variantSlug,
      fullTemplateId: `${manifest.template}/${manifest.variant}`,
      familyPath: path.split("/")[0] || "",
      path,
      isDefault: Boolean(manifest.default),
      routeUrl,
      url: `/templates/${ownerSlug}/${templatePathSlug}/${variantSlug}/`,
      ownerSlug,
      templateSlug: templatePathSlug,
      categoryKey,
      categoryLabel,
      frameworkKey,
      frameworkLabel: titleCase(frameworkKey),
      variantDescription: manifest.variant_description || "",
      installCommand: manifest.install_command || "npm install",
      repoUrl: manifest.repo,
      repoRootUrl: getRepoRootUrl(manifest.repo),
      ref: manifest.ref || "",
      metadata: {
        name: manifest.metadata.name,
        description: manifest.metadata.description || "",
        owner: manifest.metadata.owner || ownerSlug,
        tags: normalizeTags(manifest.metadata.tags || []),
      },
      services,
      nextSteps: manifest.next_steps || [],
      buildCommand: `stripe projects build my-app --template ${manifest.template}/${manifest.variant}`,
      tierPlans: manifest.tier_plans || {},
      serviceOverrides: manifest.service_overrides || {},
    };
  });

  const familiesById = new Map();

  for (const variant of variants) {
    const family = familiesById.get(variant.templateId) || {
      templateId: variant.templateId,
      ownerSlug: variant.ownerSlug,
      templateSlug: variant.templateSlug,
      url: variant.routeUrl,
      variants: [],
    };

    family.variants.push(variant);
    familiesById.set(variant.templateId, family);
  }

  const families = Array.from(familiesById.values())
    .map((family) => {
      const variants = family.variants.sort(sortVariants);
      const canonicalVariant = variants[0];
      const servicesBySlug = new Map();
      const providersBySlug = new Map();
      const tags = [];
      const seenTags = new Set();

      for (const variant of variants) {
        for (const service of variant.services) {
          if (!servicesBySlug.has(service.slug)) {
            servicesBySlug.set(service.slug, service);
          }
          if (!providersBySlug.has(service.providerSlug)) {
            providersBySlug.set(service.providerSlug, {
              providerSlug: service.providerSlug,
              providerName: service.providerName,
              iconUrl: service.iconUrl,
              fallbackInitials: service.fallbackInitials,
            });
          }
        }

        for (const tag of variant.metadata.tags) {
          const key = String(tag).toLowerCase();
          if (!seenTags.has(key)) {
            seenTags.add(key);
            tags.push(tag);
          }
        }
      }

      return {
        ...family,
        name: canonicalVariant.metadata.name,
        description: canonicalVariant.metadata.description,
        owner: canonicalVariant.metadata.owner,
        categoryKey: canonicalVariant.categoryKey,
        categoryLabel: canonicalVariant.categoryLabel,
        frameworkKey: canonicalVariant.frameworkKey,
        frameworkLabel: canonicalVariant.frameworkLabel,
        variantDescription: canonicalVariant.variantDescription,
        buildCommand: `stripe projects build my-app --template ${family.templateId}`,
        defaultVariant: canonicalVariant,
        variantCount: variants.length,
        services: Array.from(servicesBySlug.values()).sort((left, right) =>
          left.slug.localeCompare(right.slug),
        ),
        providers: Array.from(providersBySlug.values()).sort((left, right) =>
          left.providerName.localeCompare(right.providerName),
        ),
        tags,
        variants,
      };
    })
    .sort(sortFamilies);

  const enrichedVariants = families
    .flatMap((family) =>
      family.variants.map((variant) => ({
        ...variant,
        familyName: family.name,
        familyDescription: family.description,
        familyUrl: family.url,
        familyBuildCommand: family.buildCommand,
        familyVariantCount: family.variantCount,
        siblingVariants: family.variants.map((sibling) => ({
          variantId: sibling.variantId,
          variantDescription: sibling.variantDescription,
          isDefault: sibling.isDefault,
          url: sibling.url,
        })),
      })),
    )
    .sort(sortVariants);

  const result = {
    registryUrl: `https://github.com/${REGISTRY_OWNER}/${REGISTRY_REPO}`,
    families,
    variants: enrichedVariants,
    categoryOptions: Array.from(guidedCategories.values()),
  };

  writeCache(result);
  return withCarousel(result);
}
