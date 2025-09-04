# Docusaurus Plugin Matomo

## Description

A comprehensive Docusaurus plugin for Matomo analytics with support for both
standard tracking and Matomo Tag Manager integration.

This plugin provides seamless Matomo analytics integration for Docusaurus sites,
offering advanced privacy controls and flexible configuration options. It
supports both traditional Matomo tracking and the modern Tag Manager approach,
making it suitable for organizations with varying analytics requirements.

The plugin is designed with privacy in mind, offering built-in support for Do
Not Track headers, IP anonymization, and cookie-less tracking to ensure GDPR
compliance. It automatically handles single-page application navigation tracking
and provides enhanced internal link monitoring.

@whitespace-se/docusaurus-plugin-matomo is maintained by web analytics
specialists at [Whitespace](https://whitespace.se).

## Standard Matomo Tracking

For direct Matomo integration, configure the plugin with your site ID and Matomo
instance URL. This approach gives you full control over tracking settings and
privacy options.

```javascript
module.exports = {
  plugins: [
    [
      "@whitespace-se/docusaurus-plugin-matomo",
      {
        siteId: "1",
        matomoUrl: "https://your-matomo-instance.com",
        respectDoNotTrack: true,
        anonymizeIp: true,
      },
    ],
  ],
};
```

## Matomo Tag Manager

For advanced tracking scenarios, use Matomo Tag Manager integration. This
approach centralizes all tracking configuration within your Tag Manager
container.

```javascript
module.exports = {
  plugins: [
    [
      "@whitespace-se/docusaurus-plugin-matomo",
      {
        matomoUrl: "https://your-matomo-instance.com",
        tagManagerContainerId: "ABC123",
      },
    ],
  ],
};
```

## Configuration Options

| Option                  | Type    | Required | Default        | Description                                       |
| ----------------------- | ------- | -------- | -------------- | ------------------------------------------------- |
| `siteId`                | string  | Yes\*    | -              | Your Matomo site ID                               |
| `matomoUrl`             | string  | Yes      | -              | Your Matomo instance URL (without trailing slash) |
| `tagManagerContainerId` | string  | No       | -              | Matomo Tag Manager container ID                   |
| `trackingEnabled`       | boolean | No       | `true`         | Enable/disable tracking                           |
| `respectDoNotTrack`     | boolean | No       | `true`         | Respect Do Not Track browser setting              |
| `disableCookies`        | boolean | No       | `false`        | Disable cookies for privacy                       |
| `anonymizeIp`           | boolean | No       | `false`        | Anonymize visitor IP addresses                    |
| `debug`                 | boolean | No       | `false`        | Enable debug mode for development testing         |
| `phpScript`             | string  | No       | `'matomo.php'` | Custom PHP script path                            |
| `jsScript`              | string  | No       | `'matomo.js'`  | Custom JavaScript script path                     |
| `additionalTrackers`    | array   | No       | `[]`           | Additional Matomo trackers                        |

\*Required only for standard tracking mode, not needed for Tag Manager

## Privacy and GDPR Compliance

The plugin includes comprehensive privacy controls to help you comply with data
protection regulations:

- **Do Not Track support**: Automatically respects browser Do Not Track headers
- **IP anonymization**: Anonymizes visitor IP addresses before storage
- **Cookie-less tracking**: Option to disable cookies entirely
- **Production-only mode**: Automatically disabled in development to prevent
  data pollution

## Advanced Configuration

### Multiple Trackers

Configure additional Matomo instances for cross-site tracking:

```javascript
{
  additionalTrackers: [
    {
      siteId: '2',
      trackerUrl: 'https://backup-matomo-instance.com/matomo.php',
    },
  ],
}
```

### Custom Script Paths

Override default Matomo script paths for custom installations:

```javascript
{
  phpScript: 'custom-matomo.php',
  jsScript: 'custom-matomo.js',
}
```

### Debug Mode

Enable debug mode for development testing:

```javascript
{
  debug: true, // Enables tracking in development mode
}
```

## How it Works

**Production Environment**: The plugin automatically injects Matomo tracking
code into your site's HTML head section. For Tag Manager configurations, it
loads the container script. For standard configurations, it generates the
complete Matomo tracking setup.

**Development Environment**: Tracking is automatically disabled in development
mode to keep your analytics data clean and prevent accidental data collection
during development.

**Single Page Application Support**: The plugin automatically tracks navigation
within your Docusaurus site, including page changes, hash fragment navigation,
and query parameter modifications.

**Internal Link Tracking**: All internal navigation is automatically tracked,
providing comprehensive insights into user behavior across your documentation
site.

## Installation

```bash
npm install @whitespace-se/docusaurus-plugin-matomo
```

## Whitespace & Matomo

We provide comprehensive support for Matomo configuration, operation, and web
analytics implementation. Our customer portfolio includes over 30 public sector
organizations, such as the Swedish Tax Agency, Swedish National Archives,
Uppsala Municipality, Trelleborg Municipality, Swedish Social Insurance Agency,
and Statistics Sweden.

Learn more about [Whitespace & Matomo](https://whitespace.se/matomo/).

## License

MIT © [Whitespace AB](https://whitespace.se)
