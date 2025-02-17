// babel.config.cjs

// Export the Babel configuration object
module.exports = {
    // Define the presets that Babel should use
    presets: [
        // Transform newer JavaScript syntax to older versions for compatibility
        '@babel/preset-env',
        // Transform JSX syntax for React
        '@babel/preset-react',
        // Transform TypeScript syntax, including TSX files
        '@babel/preset-typescript'
    ]
}
