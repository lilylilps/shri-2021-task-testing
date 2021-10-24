module.exports = {
    baseUrl: 'https://shri.yandex/hw/store',

    sets: {
        desktop: {
            files: 'test/hermione/*.hermione.js',
        },
    },

    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        }
    },
}