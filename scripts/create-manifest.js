// Load requirements.
const fs = require("fs");
const cli = require("command-line-args");

// Intialize and load command line parameters.
const now = Math.abs(new Date() | 0);
const possibleTypes = ["panel", "video_overlay", "video_component", "mobile"];
const stdout = "standard output";
const defaultZoomPixels = 1024;
const options = [
  { name: "types", alias: "t", type: String, multiple: true, description: `types of extension, at least one of ${possibleTypes.join(", ")}` },
  { name: "panel_height", alias: "p", type: Number, defaultValue: 300, description: "height of panel extension" },
  { name: "zoom_pixels", alias: "z", type: Number, defaultValue: defaultZoomPixels, description: "base width of extension for calculating zoom (0 no zoom)" },
  { name: "component_size", alias: "c", type: String, defaultValue: "30%x40%", description: "size of video component extension, width by height" },
  { name: "base_uri", alias: "b", type: String, defaultValue: "https://localhost.rig.twitch.tv:8080", description: "testing base URI of extension assets" },
  { name: "author_name", alias: "a", type: String, defaultValue: "twitchrig", description: "extension author name" },
  { name: "support_email", alias: "e", type: String, defaultValue: "support@localhost", description: "extension support email" },
  { name: "name", alias: "n", type: String, defaultValue: `Hello World Panel Extension`, description: "extension name" },
  { name: "description", alias: "d", type: String, defaultValue: `Description of extension ${now}.`, description: "extension description" },
  { name: "summary", alias: "m", type: String, defaultValue: `Summary of extension ${now}.`, description: "extension summary" },
  { name: "output_file", alias: "o", type: String, defaultValue: stdout, description: "output file path" },
  { name: "help", alias: "h", type: Boolean, description: "this help text" },
];
const args = cli(options);

// Validate command line parameters.
const types = args.types && args.types.map(s => s.split(',')).reduce((a, b) => a.concat(b), []).filter(s => s.length);
const componentSize = extractSize(args.component_size);
const panelHeight = extractExtent(args.panel_height);
const zoomPixels = args.zoom_pixels;
if (args.help || !componentSize || !panelHeight || !areAllValid(types)) {
  const scriptName = process.argv[1].split(require("path").sep).pop();
  console.log(`Usage: node ${scriptName} -t {${possibleTypes.join(",")}} [other options]`);
  console.log();
  options.forEach(option => {
    const defaultValue = option.defaultValue !== undefined ? ` (default ${JSON.stringify(option.defaultValue)})` : "";
    console.log(`  -${option.alias}  ${option.description}${defaultValue}`);
  });
  console.log();
  console.log("You may specify the types either with multiple -t options or a single -t option\n" +
    "with comma- or space-delimited values.");
  console.log();
  console.log("The height of a panel extension must be between 100 and 500.  The width of a\n" +
    "video component extension must be between 1.00% and 50.00%.  The height of a\n" +
    "video component extension must be between 1.00% and 100.00%.");
  process.exit(args.help ? 0 : 2);
}

// Generate and print the manifest.
const manifest = generateManifest(args.base_uri);
const outputFile = args.output_file;
const fd = outputFile === stdout ? process.stdout.fd : fs.openSync(outputFile, "w");
fs.writeSync(fd, JSON.stringify(manifest, null, 2));

function extractSize(arg) {
  const ar = arg.split("x");
  if (ar.length === 2) {
    const width = extractValue(ar[0]);
    const height = extractValue(ar[1]);
    if (width >= 100 && width <= 5000 && height >= 100 && height <= 10000) {
      return { width, height };
    }
  }

  function extractValue(value) {
    return Math.round(parseFloat(value.split("%")[0], 10) * 100);
  }
}

function extractExtent(arg) {
  const extent = Math.round(arg);
  if (extent >= 100 && extent <= 500) {
    return extent;
  }
}

function areAllValid(types) {
  return types && types.length > 0 && types.every(type => ~possibleTypes.indexOf(type));
}

function generateManifest(baseUri) {
  return {
    id: "u0000000000000000000" + now,
    state: "Testing",
    version: "0.0.1",
    anchor: "",
    panel_height: ~types.indexOf("panel") ? panelHeight : 0,
    author_name: args.author_name,
    support_email: args.support_email,
    name: args.name,
    description: args.description,
    summary: args.summary,
    viewer_url: `${baseUri}/${~types.indexOf("panel") ? 'panel' : types[0]}.html`,
    viewer_urls: getViewerUrls(baseUri),
    views: {
      ...getViews(),
      config: { viewer_url: `${baseUri}/config.html` },
      live_config: { viewer_url: `${baseUri}/live_config.html` },
    },
    config_url: `${baseUri}/config.html`,
    live_config_url: `${baseUri}/live_config.html`,
    icon_url: "https://media.forgecdn.net/avatars/158/128/636650453584584748.png",
    icon_urls: { "100x100": "https://media.forgecdn.net/avatars/158/128/636650453584584748.png" },
    screenshot_urls: ["internal/screenshots/test_data.png"],
    asset_urls: null,
    installation_count: -42,
    can_install: true,
    whitelisted_panel_urls: [],
    whitelisted_config_urls: [],
    required_broadcaster_abilities: [],
    eula_tos_url: "",
    privacy_policy_url: "",
    request_identity_link: false,
    vendor_code: "",
    sku: "",
    bits_enabled: false
  };

  function getViewerUrls(baseUri) {
    const views = {};
    for (const t of types) {
      const viewKey = t === "video_component" ? "component" : t;
      views[viewKey] = `${baseUri}/${t}.html`;
    }
    return views;
  }

  function getViews() {
    const views = {};
    for (const t of types) {
      const viewKey = t === "video_component" ? "component" : t;
      views[viewKey] = getView(t);
    }
    return views;

    function getView(t) {
      const viewerUrl = `${baseUri}/${t}.html`;
      switch (t) {
        case "panel":
          return {
            viewer_url: viewerUrl,
            height: panelHeight,
          };
        case "mobile":
        case "video_overlay":
          return {
            viewer_url: viewerUrl,
          };
        case "video_component":
          return {
            viewer_url: viewerUrl,
            aspect_width: componentSize.width,
            aspect_height: componentSize.height,
            size: 0,
            zoom: !!zoomPixels,
            zoom_pixels: zoomPixels || defaultZoomPixels,
          };
      }
    }
  }
}
