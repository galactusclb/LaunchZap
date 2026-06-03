const path = require('path')

module.exports = {
    'apps/api/**/*.{js,ts}': (files) => {
        const apiDir = path.join(process.cwd(), 'apps/api')
        const relative = files.map((f) => path.relative(apiDir, f)).join(' ')
        return [
            `cd apps/api && npx eslint --fix ${relative}`,
            `npx prettier --write ${files.join(' ')}`,
        ]
    },
    'web/**/*.{js,ts,tsx}': (files) => {
        const webDir = path.join(process.cwd(), 'web')
        const relative = files.map((f) => path.relative(webDir, f)).join(' ')
        return [
            `cd web && npx eslint --fix ${relative}`,
            `npx prettier --write ${files.join(' ')}`,
        ]
    },
}
